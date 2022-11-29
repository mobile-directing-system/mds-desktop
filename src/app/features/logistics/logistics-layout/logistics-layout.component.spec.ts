import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticsLayoutComponent } from './logistics-layout.component';

describe('LogisticsLayoutComponent', () => {
  let component: LogisticsLayoutComponent;
  let fixture: ComponentFixture<LogisticsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogisticsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
