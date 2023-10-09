import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailChannelDetailsComponent } from './mail-channel-details.component';

describe('MailChannelDetailsComponent', () => {
  let component: MailChannelDetailsComponent;
  let fixture: ComponentFixture<MailChannelDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MailChannelDetailsComponent]
    });
    fixture = TestBed.createComponent(MailChannelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
