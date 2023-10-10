import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneChannelDetailsComponent } from './phone-channel-details.component';

describe('PhoneChannelDetailsComponent', () => {
  let component: PhoneChannelDetailsComponent;
  let fixture: ComponentFixture<PhoneChannelDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneChannelDetailsComponent]
    });
    fixture = TestBed.createComponent(PhoneChannelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
