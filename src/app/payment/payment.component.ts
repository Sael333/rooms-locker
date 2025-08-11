import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

  stripePromise = loadStripe(environment.stripePublicKey); // Tu clave pública
  apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  async redirectToCheckout() {
    const stripe = await this.stripePromise;
    this.http.post<any>(this.apiUrl + '/create-checkout-session', {}).subscribe(async (res) => {
      await stripe?.redirectToCheckout({ sessionId: res.id });
    });
  }
}
