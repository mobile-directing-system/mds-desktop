import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalerOutgoingView } from './signaler-outgoing-view.component';

describe('SignalerOutgoingView', () => {
  let component: SignalerOutgoingView;
  let fixture: ComponentFixture<SignalerOutgoingView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignalerOutgoingView ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalerOutgoingView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
