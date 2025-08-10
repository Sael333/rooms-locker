import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(private router: Router, private bookService: BookService) {}
  boxOfficesAvailables:boolean = false;
  unavailableServiceMsg: String | undefined;
  // Método para redirigir a las rutas correspondientes
  route(ruta: string): void {
    if (ruta == "generateBooking") {
      this.bookService.checkBoxOfficeAvailables().subscribe(response => {
        if (response.status == 200 && response.body == true) {
          this.router.navigate([ruta]);
        } else {
          this.unavailableServiceMsg = "Lo sentimos, todas las taquillas estan ocupadas";
        }
      },
      error => {
        console.error('Error al comprobar taquillas disponibles', error);
        // Aquí puedes manejar el error (ej., mostrar un mensaje de error)
      });
    } else {
      this.router.navigate([ruta]);
    }
       
    }
}
