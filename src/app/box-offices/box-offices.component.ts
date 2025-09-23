import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { BoxData } from '../models/box-data.model';
import { Route, Router } from '@angular/router';
import { BookingDataService } from '../services/booking-data.service';

@Component({
  selector: 'app-box-offices',
  templateUrl: './box-offices.component.html',
  styleUrls: ['./box-offices.component.css']
})
export class BoxOfficesComponent implements OnInit {

  boxes: BoxData[] = [];

  constructor(private bookService: BookService, private router: Router, private bookinDataService: BookingDataService) {}

  ngOnInit(): void {
    this.bookService.checkBoxOfficeAvailables().subscribe({
      next: (response: any) => {
        this.boxes = response.boxDataList; // aquí sí es BoxData[]
      },
      error: (err) => {
        console.error('Error al obtener las taquillas', err);
      }
    });
  }

  onBoxClick(box: BoxData): void {
    if (!box.available) return; // opcional: no hacer nada si no está disponible
    this.bookinDataService.setSelectedBox(box);
    this.router.navigate(['/generateBooking']);
  }

}
