import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioDeliveryComponent } from './radio-delivery.component';

describe('RadioDeliveryComponent', () => {
  let component: RadioDeliveryComponent;
  let fixture: ComponentFixture<RadioDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioDeliveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
