import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSummaryComponent } from './message-summary.component';

describe('MessageSummaryComponent', () => {
  let component: MessageSummaryComponent;
  let fixture: ComponentFixture<MessageSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
