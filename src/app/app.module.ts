import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BoxOfficesComponent } from './box-offices/box-offices.component';
import { GenerateBookingComponent } from './generate-booking/generate-booking.component';

const appRoutes: Routes = [
  // Aquí defines tus rutas
  { path: '', component: HomePageComponent},
  { path: 'boxOffice', component: BoxOfficesComponent},
  { path: 'generateBooking', component: GenerateBookingComponent}
  // otras rutas
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    BoxOfficesComponent,
    GenerateBookingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
