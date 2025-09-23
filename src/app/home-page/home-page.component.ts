import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { BookingDataService } from '../services/booking-data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
    standalone: true,
  styleUrls: ['./home-page.component.css']

})
export class HomePageComponent {

  constructor(private router: Router, private bookService: BookService, private bookingDataService: BookingDataService) {}
 
  boxOfficesAvailables:boolean = false;
  unavailableServiceMsg: String | undefined;
  bookingMsg: string | undefined;

  // Método para redirigir a las rutas correspondientes
  route(ruta: string): void {
      this.router.navigate([ruta]);
  }
}
