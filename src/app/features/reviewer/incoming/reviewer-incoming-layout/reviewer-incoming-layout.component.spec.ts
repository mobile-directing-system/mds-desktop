import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerIncomingLayoutComponent } from './reviewer-incoming-layout.component';

describe('ReviewerIncomingLayoutComponent', () => {
  let component: ReviewerIncomingLayoutComponent;
  let fixture: ComponentFixture<ReviewerIncomingLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerIncomingLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerIncomingLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
