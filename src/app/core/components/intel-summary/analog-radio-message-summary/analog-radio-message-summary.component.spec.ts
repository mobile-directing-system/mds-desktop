import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogRadioMessageSummaryComponent } from './analog-radio-message-summary.component';

describe('AnalogRadioMessageSummaryComponent', () => {
  let component: AnalogRadioMessageSummaryComponent;
  let fixture: ComponentFixture<AnalogRadioMessageSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalogRadioMessageSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalogRadioMessageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
