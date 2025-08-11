import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  confirmPayment(sessionId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/confirm-payment`, { sessionId });
  }

  createCheckoutSession(amount: number): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(
      `${this.baseUrl}/create-checkout-session`,
      { amount }
    );
  }
}
