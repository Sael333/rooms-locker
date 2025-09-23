import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxOfficesComponent } from './box-offices/box-offices.component';
import { GenerateBookingComponent } from './generate-booking/generate-booking.component';

const routes: Routes = [
  { path: 'boxOffice', component: BoxOfficesComponent },
  { path: 'generateBooking', component: GenerateBookingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
