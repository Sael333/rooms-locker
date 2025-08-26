import { Component } from '@angular/core';
import { BookService } from '../services/book.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from '../services/payment.service';
import { Router } from '@angular/router';
import { BookingDataService } from '../services/booking-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-generate-booking',
  templateUrl: './generate-booking.component.html',
  styleUrls: ['./generate-booking.component.css']
})
export class GenerateBookingComponent {
  minDate: string = '';
  totalPrice: number | null = null;
  PRICE_PER_DAY = environment.price;

  booking: any;  
  bookingMsg: string | undefined;
  paymentData: { paymentConfirm: boolean; userId: string; } | undefined;
  isLoading = false;

  // 🔹 Nuevo: lista de tamaños y tamaño seleccionado
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

    // 🔹 Recuperar tamaños disponibles del servicio
    this.availableSizes = this.bookingDataService.getAvailableSizes();
    // Limpieza de datos antiguos
    this.bookingDataService.clear();
  }

  // Seleccionar tamaño
  selectSize(size: string) {
    this.selectedSize = size;
  }

  // Envío del formulario
  onSubmit(form: NgForm) {
    if (form.valid && this.selectedSize) {
      this.isLoading = true;

      const bookData = {
        name: form.value.name,
        phone: form.value.phone,
        email: form.value.email,
        endDate: this.calculateEndDate(form.value.expiration),
        paymentConfirm: false,
        totalPrice: this.totalPrice,
        size: this.selectedSize  // 🔹 añadimos el tamaño
      };

      this.redirectToCheckout(bookData);
    }
  }

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

  calculatePrice() {
    const input = (<HTMLInputElement>document.getElementById('expiration')).value;
    if (!input) {
      this.totalPrice = this.PRICE_PER_DAY;
      return;
    }

    const [yearStr, monthStr, dayStr] = input.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      this.totalPrice = this.PRICE_PER_DAY;
      return;
    }

    const expirationDateLocal = new Date(year, month - 1, day);
    const now = new Date();
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = expirationDateLocal.getTime() - todayLocal.getTime();
    const diffDays = Math.floor(diffMs / msPerDay);

    const daysToCharge = diffDays < 0 ? 1 : diffDays + 1;
    // 🔹 Precio base
    let dailyPrice = this.PRICE_PER_DAY;

    // 🔹 Recargo de 2€/día si la taquilla es XL
    if (this.selectedSize === 'XL') {
      dailyPrice += environment.plusPrice;
    }

    this.totalPrice = daysToCharge * dailyPrice;
  }

  calculateEndDate(expirationDate: string): string {
    const expirationMoment = moment(expirationDate, 'YYYY-MM-DD');
    const today = moment().startOf('day');

    if (expirationMoment.isSame(today, 'day')) {
      return expirationMoment.add(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      return expirationMoment.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    }
  }
}
