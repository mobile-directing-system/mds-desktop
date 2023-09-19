import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerOutgoingLayoutComponent } from './reviewer-outgoing-layout.component';

describe('ReviewerOutgoingLayoutComponent', () => {
  let component: ReviewerOutgoingLayoutComponent;
  let fixture: ComponentFixture<ReviewerOutgoingLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerOutgoingLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerOutgoingLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
