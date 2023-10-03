import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDialog } from './review-dialog.component';

describe('ReviewDialog', () => {
  let component: ReviewDialog;
  let fixture: ComponentFixture<ReviewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
