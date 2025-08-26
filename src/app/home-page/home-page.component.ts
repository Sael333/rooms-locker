import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { BookingDataService } from '../services/booking-data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(private router: Router, private bookService: BookService, private bookingDataService: BookingDataService) {}
 
  boxOfficesAvailables:boolean = false;
  unavailableServiceMsg: String | undefined;

  // Método para redirigir a las rutas correspondientes
  route(ruta: string): void {
    if (ruta === "generateBooking") {
      this.bookService.checkBoxOfficeAvailables().subscribe({
        next: (response) => {
          if (response.status === 200 && response.body?.available) {
            // ✅ Guardamos en el servicio compartido
            this.bookingDataService.setAvailableSizes(response.body.sizes);
            this.router.navigate([ruta]);
          } else {
            this.unavailableServiceMsg = "Lo sentimos, todas las taquillas están ocupadas";
          }
        },
        error: (err) => {
          console.error('Error al comprobar taquillas disponibles', err);
          this.unavailableServiceMsg = "Error al comprobar disponibilidad";
        }
      });
    } else {
      this.router.navigate([ruta]);
    }
  }
}
