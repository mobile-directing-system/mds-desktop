import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerIncomingView } from './reviewer-incoming-view.component';

describe('ReviewerIncomingView', () => {
  let component: ReviewerIncomingView;
  let fixture: ComponentFixture<ReviewerIncomingView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerIncomingView ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerIncomingView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
