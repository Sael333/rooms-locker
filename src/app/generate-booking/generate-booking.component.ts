import { Component } from '@angular/core';
import { BookService } from '../services/book.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from '../services/payment.service';
import { Router } from '@angular/router';
import { BookingDataService } from '../services/booking-data.service';
import { environment } from 'src/environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-generate-booking',
  templateUrl: './generate-booking.component.html',
  styleUrls: ['./generate-booking.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('1000ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('800ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class GenerateBookingComponent {
  minDate: string = '';
  totalPrice: number | null = null;
  selectedDays: number | null = null;

  PRICE_PER_DAY = environment.price;

  booking: any;  
  bookingMsg: string | undefined;
  isLoading = false;

  // Tamaños de taquilla
  availableSizes: string[] = [];
  selectedSize: string | null = null;

  constructor(
    private bookService: BookService,
    private bookingDataService: BookingDataService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];  

    this.booking = this.bookingDataService.getBookingData();
    this.bookingMsg = this.bookingDataService.getBookingMsg();

    this.availableSizes = this.bookingDataService.getAvailableSizes();
    this.bookingDataService.clear();
  }

  // -------------------- FECHA --------------------
  onDateChange(expirationDate: string) {
    if (!expirationDate) {
      this.selectedDays = null;
      this.totalPrice = null;
      return;
    }

    const [yearStr, monthStr, dayStr] = expirationDate.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      this.selectedDays = null;
      this.totalPrice = null;
      return;
    }

    const expirationDateLocal = new Date(year, month - 1, day);
    const todayLocal = new Date();
    todayLocal.setHours(0,0,0,0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = expirationDateLocal.getTime() - todayLocal.getTime();
    const diffDays = Math.floor(diffMs / msPerDay);

    this.selectedDays = diffDays < 0 ? 1 : diffDays + 1;

    // Recalcular precio si ya hay tamaño seleccionado
    if (this.selectedSize) {
      this.calculatePrice();
    } else {
      this.totalPrice = null;
    }
  }

  // -------------------- TAMAÑO --------------------
  selectSize(size: string) {
    this.selectedSize = size;
    if (this.selectedDays !== null) {
      this.calculatePrice();
    } else {
      this.totalPrice = null;
    }
  }

  // -------------------- CALCULO PRECIO --------------------
  calculatePrice() {
    if (!this.selectedSize || this.selectedDays === null) {
      this.totalPrice = null;
      return;
    }

    let dailyPrice = this.PRICE_PER_DAY;

    if (this.selectedSize === 'XL') {
      dailyPrice += environment.plusPrice;
    }

    this.totalPrice = dailyPrice * this.selectedDays;
  }

  // -------------------- CALCULO FECHA FIN --------------------
  calculateEndDate(expirationDate: string): string {
    const expirationMoment = moment(expirationDate, 'YYYY-MM-DD');
    const today = moment().startOf('day');

    if (expirationMoment.isSame(today, 'day')) {
      return expirationMoment.add(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      return expirationMoment.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    }
  }

  // -------------------- ENVÍO FORMULARIO --------------------
  onSubmit(form: NgForm) {
    if (form.valid && this.selectedSize && this.selectedDays !== null) {
      this.isLoading = true;

      const bookData = {
        name: form.value.name,
        phone: form.value.phone,
        email: form.value.email,
        endDate: this.calculateEndDate(form.value.expiration),
        paymentConfirm: false,
        totalPrice: this.totalPrice,
        size: this.selectedSize
      };

      this.redirectToCheckout(bookData);
    }
  }

  // -------------------- STRIPE --------------------
  async redirectToCheckout(bookData: any) {
    try {
      const session = await this.paymentService.createCheckoutSession(bookData.totalPrice).toPromise();
      const stripe = await loadStripe(environment.stripePublicKey);

      if (stripe && session?.id) {
        sessionStorage.setItem('bookData', JSON.stringify(bookData));
        const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
        if (error) console.error('Stripe redirection error:', error.message);
      }
    } catch (err) {
      console.error('Error creando la sesión:', err);
    } finally {
      this.isLoading = false;
    }
  }
}
