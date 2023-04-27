import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainTextMessageSummaryComponent } from './plain-text-message-summary.component';

describe('PlainTextMessageSummaryComponent', () => {
  let component: PlainTextMessageSummaryComponent;
  let fixture: ComponentFixture<PlainTextMessageSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlainTextMessageSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlainTextMessageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
