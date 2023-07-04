import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerOutgoingView } from './reviewer-outgoing-view.component';

describe('ReviewerOutgoingView', () => {
  let component: ReviewerOutgoingView;
  let fixture: ComponentFixture<ReviewerOutgoingView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerOutgoingView ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerOutgoingView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
