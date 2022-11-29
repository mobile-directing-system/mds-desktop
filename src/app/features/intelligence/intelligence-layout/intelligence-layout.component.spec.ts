import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelligenceLayoutComponent } from './intelligence-layout.component';

describe('IntelligenceLayoutComponent', () => {
  let component: IntelligenceLayoutComponent;
  let fixture: ComponentFixture<IntelligenceLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntelligenceLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntelligenceLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
