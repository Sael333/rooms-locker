import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserComponent } from './generate-booking.component';

describe('HomeUserComponent', () => {
  let component: HomeUserComponent;
  let fixture: ComponentFixture<HomeUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeUserComponent]
    });
    fixture = TestBed.createComponent(HomeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
