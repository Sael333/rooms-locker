import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

  stripePromise = loadStripe('pk_test_51ReswyIsUbiUMsbMgVn2lygzeh2Emgct9ReqonVfqNNJFPm8o5TWVpE9lDhhEEcE5GboKHEx9N49MhlkXECaGGoy00VxmikJNY'); // Tu clave pública

  constructor(private http: HttpClient) {}

  async redirectToCheckout() {
    const stripe = await this.stripePromise;
    this.http.post<any>('https://book-management-dev.onrender.com/v1/create-checkout-session', {}).subscribe(async (res) => {
      await stripe?.redirectToCheckout({ sessionId: res.id });
    });
  }
}
