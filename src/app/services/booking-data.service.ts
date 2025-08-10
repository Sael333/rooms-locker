// booking-data.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingDataService {
  private bookingData: any = null;
  private bookingMsg: string | undefined;

  setBookingData(data: any, msg?: string) {
    this.bookingData = data;
    this.bookingMsg = msg;
  }

  getBookingData() {
    return this.bookingData;
  }

  getBookingMsg() {
    return this.bookingMsg;
  }

  clear() {
    this.bookingData = null;
    this.bookingMsg = undefined;
  }
}
