import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './authService.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {

  private apiUrl = environment.apiUrl;  // Cambia esta URL por la del backend.

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
  // 🔹 Comprobar disponibilidad + obtener tamaños
  checkBoxOfficeAvailables(): Observable<HttpResponse<{ available: boolean, sizes: string[] }>> {
    return this.http.get<{ available: boolean, sizes: string[] }>(
      this.apiUrl.concat("/checkBoxOfficeAvailable"),
      { observe: 'response' }
    );
  }

  // 🔹 Obtener tamaños disponibles desde backend
  getAvailableSizes(): Observable<HttpResponse<string[]>> {
    return this.http.get<string[]>(this.apiUrl.concat("/lockers/sizes"), { observe: 'response' });
  }
}
