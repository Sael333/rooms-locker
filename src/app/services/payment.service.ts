import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'https://book-management-dev.onrender.com:8080/v1';

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
