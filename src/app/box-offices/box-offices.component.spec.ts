import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxOfficesComponent } from './box-offices.component';

describe('BoxOfficesComponent', () => {
  let component: BoxOfficesComponent;
  let fixture: ComponentFixture<BoxOfficesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoxOfficesComponent]
    });
    fixture = TestBed.createComponent(BoxOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
