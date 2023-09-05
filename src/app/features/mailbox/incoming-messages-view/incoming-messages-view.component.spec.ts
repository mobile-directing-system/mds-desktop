import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingMessagesViewComponent } from './incoming-messages-view.component';

describe('IncomingMessagesViewComponent', () => {
  let component: IncomingMessagesViewComponent;
  let fixture: ComponentFixture<IncomingMessagesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingMessagesViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingMessagesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
