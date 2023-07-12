import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationTableLayoutComponent } from './operation-table-layout.component';

describe('OperationTableLayoutComponent', () => {
  let component: OperationTableLayoutComponent;
  let fixture: ComponentFixture<OperationTableLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationTableLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationTableLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
