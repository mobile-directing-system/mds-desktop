import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingMessagesViewComponent } from './outgoing-messages-view.component';

describe('OutgoingMessagesViewComponent', () => {
  let component: OutgoingMessagesViewComponent;
  let fixture: ComponentFixture<OutgoingMessagesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoingMessagesViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingMessagesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
