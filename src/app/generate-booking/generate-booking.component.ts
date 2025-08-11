import { Component } from '@angular/core';
import { BookService } from '../services/book.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from '../services/payment.service';
import { Route, Router } from '@angular/router';
import { BookingDataService } from '../services/booking-data.service';

@Component({
  selector: 'app-generate-booking',
  templateUrl: './generate-booking.component.html',
  styleUrls: ['./generate-booking.component.css']
})
export class GenerateBookingComponent {
  minDate: string = '';
  [x: string]: any;
  totalPrice: number | null = null; // Inicializamos el precio como null
  PRICE_PER_DAY = 8;
  booking: any;  // Para almacenar la respuesta del backend
  bookingMsg: string | undefined;  // Para mostrar el mensaje en el HTML
  paymentData: { paymentConfirm: boolean; userId: string; } | undefined;
  
  constructor(private bookService: BookService, private bookingDataService: BookingDataService, private paymentService: PaymentService, private router: Router) {}

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];  // Formato 'YYYY-MM-DD'
  
      this.booking = this.bookingDataService.getBookingData();
      this.bookingMsg = this.bookingDataService.getBookingMsg();

      // Opcional: limpiar para evitar mostrar datos antiguos
      this.bookingDataService.clear();
    }
  
  // Función que se ejecuta cuando el formulario es enviado
  onSubmit(form: NgForm) {
      if (form.valid) {
        const bookData = {
          name: form.value.name,
          phone: form.value.phone,
          email: form.value.email,
          endDate: this.calculateEndDate(form.value.expiration),
          paymentConfirm: false,
          totalPrice: this.totalPrice,
        };
        this.redirectToCheckout(bookData);
    }
  }
  
   async redirectToCheckout(bookData: any) {
    try {
      const session = await this.paymentService.createCheckoutSession(bookData.totalPrice).toPromise();

      const stripe = await loadStripe('pk_test_51ReswyIsUbiUMsbMgVn2lygzeh2Emgct9ReqonVfqNNJFPm8o5TWVpE9lDhhEEcE5GboKHEx9N49MhlkXECaGGoy00VxmikJNY'); // clave pública de Stripe

      if (stripe && session?.id) {
              // Guarda la data temporalmente si la necesitas luego
              sessionStorage.setItem('bookData', JSON.stringify(bookData));

              const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
              if (error) console.error('Stripe redirection error:', error.message);
        }
    } catch (err) {
      console.error('Error creando la sesión:', err);
    }
  }
 
 calculatePrice() {
  const input = (<HTMLInputElement>document.getElementById('expiration')).value;
  if (!input) {
    this.totalPrice = this.PRICE_PER_DAY;
    return;
  }

  // Parsear YYYY-MM-DD como fecha local (evita el problema UTC)
  const [yearStr, monthStr, dayStr] = input.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    this.totalPrice = this.PRICE_PER_DAY;
    return;
  }

  const expirationDateLocal = new Date(year, month - 1, day); // medianoche local del día seleccionado
  const now = new Date();
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // medianoche local de hoy

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = expirationDateLocal.getTime() - todayLocal.getTime();
  const diffDays = Math.floor(diffMs / msPerDay); // diferencia en días calendario (puede ser 0,1,2,...)

  // Si la fecha es anterior, cobrar 1 día; en otro caso cobrar (diffDays + 1) para ser inclusivo
  const daysToCharge = diffDays < 0 ? 1 : diffDays + 1;

  this.totalPrice = daysToCharge * this.PRICE_PER_DAY;
}

  calculateEndDate(expirationDate: string): string {
    const expirationMoment = moment(expirationDate);
    
    const currentHour = moment().hours();
    const currentMinute = moment().minutes();

    expirationMoment.set('hour', currentHour);
    expirationMoment.set('minute', currentMinute);
    return expirationMoment.format('YYYY-MM-DDTHH:mm:ss');
  }
}
