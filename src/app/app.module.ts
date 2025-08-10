import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { GenerateBookingComponent } from './generate-booking/generate-booking.component';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './home-page/home-page.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { PaymentComponent } from './payment/payment.component';
import { SuccessComponent } from './success/success.component';
const appRoutes: Routes = [
  // Aquí defines tus rutas
  { path: '', component: HomePageComponent },
  { path: 'generateBooking', component: GenerateBookingComponent },
  { path: 'pickupLuggage', component: ManageBookingComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'payment', component: PaymentComponent }
  // otras rutas
];

@NgModule({
  declarations: [
    AppComponent,
    GenerateBookingComponent,
    HomePageComponent,
    ManageBookingComponent,
    PaymentComponent,
    SuccessComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
