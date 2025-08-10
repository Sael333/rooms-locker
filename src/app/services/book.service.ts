import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './authService.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {

  private apiUrl = 'https://book-management-dev.onrender.com:8080/v1';  // Cambia esta URL por la del backend.

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para enviar los datos de la reserva al backend
  sendBook(bookData: any): Observable<HttpResponse<any>> {
    const headers = this.authService.getAuthenticatedHeaders();
    console.log(headers);
    return this.http.post(this.apiUrl.concat("/book"), bookData, { headers, observe: 'response' });
  }

  // Método para enviar los datos de la reserva al backend
  pickupLuggagge(bookingId: any): Observable<HttpResponse<any>> {
    const headers = this.authService.getAuthenticatedHeaders();
    console.log(headers);
    return this.http.put(this.apiUrl.concat("/pickupLuggage"), bookingId, { headers, observe: 'response' });
  }

  // Método para comprobar si hay taquillas disponibles
  checkBoxOfficeAvailables(): Observable<HttpResponse<any>> {
    return this.http.get(this.apiUrl.concat("/checkBoxOfficeAvailable"), { observe: 'response' });
  }
}
