import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = environment.apiUrl;  // URL de tu backend

  constructor(private http: HttpClient) {}

  // Método para procesar el pago y obtener el token
  generateSecurity(jwtData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/token`, jwtData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('jwtToken', response.token);
        }
      })
    );
  }

  // Obtener el token desde el almacenamiento local
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // Configurar cabeceras con el token JWT
  getAuthenticatedHeaders(): { Authorization: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {
        Authorization: ''
    };
  }

}
