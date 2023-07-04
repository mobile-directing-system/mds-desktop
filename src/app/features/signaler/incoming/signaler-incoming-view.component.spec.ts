import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalerIncomingView } from './signaler-incoming-view.component';

describe('SignalerIncomingView', () => {
  let component: SignalerIncomingView;
  let fixture: ComponentFixture<SignalerIncomingView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignalerIncomingView ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalerIncomingView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
