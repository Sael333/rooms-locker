import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BookService } from '../services/book.service';
import { AuthService } from '../services/authService.service';
import { PaymentService } from '../services/payment.service';
import { BookingDataService } from '../services/booking-data.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  loading = true;
  errorMsg: string | null = null;
  booking: any;
  bookingMsg: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private bookingDataService: BookingDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];
      if (!sessionId) {
        this.handleError('No se encontró la sesión de pago.');
        return;
      }

      const pendingReservationJson = sessionStorage.getItem('bookData');
      if (!pendingReservationJson) {
        this.handleError('No se encontraron datos para completar la reserva.');
        return;
      }

      const pendingReservation = JSON.parse(pendingReservationJson);
      this.processPaymentConfirmation(sessionId, pendingReservation);
    });
  }

  private processPaymentConfirmation(sessionId: string, reservation: any) {
    this.paymentService.confirmPayment(sessionId).pipe(
      switchMap(confirmResponse => {
        if (!confirmResponse.success) {
          throw new Error('Pago no confirmado. No se puede realizar la reserva.');
        }

        const jwtData = {
          userId: reservation.email,
          paymentConfirm: true,
          amount: reservation.amount
        };

        return this.authService.generateSecurity(jwtData).pipe(
          switchMap(() => this.bookService.sendBook(reservation))
        );
      })
    ).subscribe({
      next: response => {
        if (response.status === 200) {
          this.booking = response.body;
          console.log('Reserva enviada con éxito', response);
          localStorage.removeItem('bookData');
          this.bookingMsg = `Reserva realizada con éxito ${this.booking.name}. Le hemos enviado los detalles de su reserva a su correo.`;

          this.bookingDataService.setBookingData(this.booking, this.bookingMsg);
          this.router.navigate(['/generateBooking']);
        } else if (response.status === 204) {
          this.bookingMsg = "Lo sentimos, todas nuestras taquillas están ocupadas, se le devolverá el importe en los siguientes días";
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error en el proceso de reserva:', err);
        if (err instanceof HttpErrorResponse) {
          this.handleHttpError(err);
        } else {
          this.handleError(err.message || 'Ocurrió un error inesperado. Por favor, inténtelo más tarde.');
        }
      }
    });
  }

  private handleHttpError(error: HttpErrorResponse) {
    this.loading = false;
    switch (true) {
      case error.status === 403:
        this.errorMsg = 'Acceso denegado (403). Por favor, verifique sus credenciales e intente de nuevo.';
        break;
      case error.status >= 400 && error.status < 500:
        this.errorMsg = 'Error de seguridad. Por favor, intente de nuevo.';
        break;
      case error.status === 500:
        this.errorMsg = 'Error del sistema. Por favor, inténtelo más tarde.';
        break;
      default:
        this.errorMsg = `Error inesperado (${error.status}). Por favor, contacte soporte.`;
        break;
    }
  }

  private handleError(message: string) {
    this.loading = false;
    this.errorMsg = message;
  }

  serializeBookingResponse(booking: any): any {
    return {
      bookingId: booking.bookingId,
      name: booking.name,
      boxOffice: booking.boxOffice,
      creationDate: booking.creationDate ? booking.creationDate.toString() : null,
      endDate: booking.endDate ? booking.endDate.toString() : null,
      securityCode: booking.securityCode,
      errorCode: booking.errorCode
    };
  }
}
