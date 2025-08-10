import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookingDataService } from '../services/booking-data.service';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.css']
})
export class ManageBookingComponent {

  codeMsg: string | null = null;
  errorMsg: string | null = null;
  booking: any;
  bookingMsg: string | undefined;
  loading = false; // estado de carga

  constructor(private bookService: BookService, private bookingDataService: BookingDataService) {}


onGenerateCode(form: any) {
  if (form.invalid) {
    return;
  }

  const reservationId = form.value.reservationId;
  this.codeMsg = null;
  this.loading = true; // activar estado de carga

  this.bookService.pickupLuggagge(reservationId).subscribe({
    next: (response: any) => {
      if (response.status === 200) {
        this.booking = response.body;
        localStorage.removeItem('bookData');
        this.codeMsg = `Ha recibido el código de recogida de maletas en su email.`;
      } else if (response.status === 204) {
        this.codeMsg = `Su reserva ha caducado, debe realizar una nueva reserva.`;
      }
      this.loading = false; // desactivar carga
    },
    error: (err) => {
      console.error('Error en generateCode:', err);
      this.codeMsg = 'Error al generar el código. Intente nuevamente.';
      this.loading = false; // desactivar carga
    }
  });
}

}
