import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBookingComponent } from './generate-booking.component';

describe('GenerateBookingComponent', () => {
  let component: GenerateBookingComponent;
  let fixture: ComponentFixture<GenerateBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateBookingComponent]
    });
    fixture = TestBed.createComponent(GenerateBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
