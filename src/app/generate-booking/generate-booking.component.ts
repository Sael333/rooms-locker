import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoxData } from '../models/box-data.model';
import { BookingDataService } from '../services/booking-data.service';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-generate-booking',
  templateUrl: './generate-booking.component.html',
  styleUrls: ['./generate-booking.component.css']
})
export class GenerateBookingComponent implements OnInit {
  box!: BoxData; // taquilla seleccionada
  days: number = 1;
  contactMethod: 'email' | 'sms' | null = null;
  email: string = '';
  phone: string = '';

  constructor(
    private router: Router,
    private bookingDataService: BookingDataService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.box = this.bookingDataService.getSelectedBox()!;
  }

  incrementDays() { this.days++; }
  decrementDays() { if (this.days > 1) this.days--; }

  finalizeBooking() {
    if (!this.contactMethod) {
      alert('Selecciona SMS o Email como método de notificación.');
      return;
    }

    // Construir objeto BookingRequest
    const bookingRequest = {
      boxId: this.box.boxId,
      email: this.contactMethod === 'email' ? this.email : null,
      phone: this.contactMethod === 'sms' ? this.phone : null,
      notification: this.contactMethod === 'email' ? 'EMAIL' : 'SMS',
      days: this.days
    };

    // ✅ Usar el servicio para enviar la reserva
    this.bookService.sendBook(bookingRequest).subscribe({
      next: (response) => {
        if (response.status === 200 || response.status === 201) {
          alert('Reserva finalizada con éxito');
          this.router.navigate(['/']);
        } else {
          alert('No se pudo completar la reserva. Inténtalo de nuevo.');
        }
      },
      error: (err) => {
        console.error('Error al enviar reserva', err);
        alert('Error al enviar la reserva');
      }
    });
  }
}
