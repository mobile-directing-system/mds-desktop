import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelSummaryComponent } from './intel-summary.component';

describe('IntelSummaryComponent', () => {
  let component: IntelSummaryComponent;
  let fixture: ComponentFixture<IntelSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntelSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntelSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
