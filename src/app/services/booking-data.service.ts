// booking-data.service.ts
import { Injectable } from '@angular/core';
import { BoxData } from '../models/box-data.model';

@Injectable({
  providedIn: 'root'
})
export class BookingDataService {
  private bookingData: any = null;
  private bookingMsg: string | undefined;
  private boxData: any = [];
  private selectedBox: BoxData | null = null;

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
  
   // 🔹 NUEVOS métodos para tamaños
  setAvailableSizes(boxData: any) {
    this.boxData = boxData;
  }

  getBoxData() {
    return this.boxData;
  }

  setBookingMsg(msg?: string) {
    this.bookingMsg = msg;
  }

  setSelectedBox(box: BoxData) {
    this.selectedBox = box;
  }

  getSelectedBox(): BoxData | null {
    return this.selectedBox;
  }
}
