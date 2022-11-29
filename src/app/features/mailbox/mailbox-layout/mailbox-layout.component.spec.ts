import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailboxLayoutComponent } from './mailbox-layout.component';

describe('MailboxLayoutComponent', () => {
  let component: MailboxLayoutComponent;
  let fixture: ComponentFixture<MailboxLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailboxLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailboxLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
