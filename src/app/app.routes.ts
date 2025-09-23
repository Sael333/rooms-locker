import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BoxOfficesComponent } from './box-offices/box-offices.component';
import { GenerateBookingComponent } from './generate-booking/generate-booking.component';

export const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'boxOffice', component: BoxOfficesComponent },
  { path: 'generateBooking', component: GenerateBookingComponent }
];
