import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BoxData } from '../models/box-data.model';


@Injectable({
  providedIn: 'root',
})
export class BookService {

  private apiUrl = environment.apiUrl;  // Cambia esta URL por la del backend.

  constructor(private http: HttpClient) {}

  // Método para enviar los datos de la reserva al backend
  sendBook(bookData: any): Observable<HttpResponse<any>> {
    return this.http.post(this.apiUrl.concat("/book"), bookData, {observe: 'response' });
  }

  // Método para enviar los datos de la reserva al backend
  pickupLuggagge(bookingId: any): Observable<HttpResponse<any>> {
    return this.http.put(this.apiUrl.concat("/pickupLuggage"), bookingId, {observe: 'response' });
  }

  // 🔹 Comprobar disponibilidad + obtener tamaños
  checkBoxOfficeAvailables(): Observable<BoxData[]> {
    return this.http.get<BoxData[]>(
      this.apiUrl.concat("/checkBoxOfficeAvailable")
    );
  }
}
