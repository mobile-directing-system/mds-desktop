import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioDeliveryItemComponent } from './radio-delivery-item.component';

describe('RadioDeliveryItemComponent', () => {
  let component: RadioDeliveryItemComponent;
  let fixture: ComponentFixture<RadioDeliveryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioDeliveryItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioDeliveryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
