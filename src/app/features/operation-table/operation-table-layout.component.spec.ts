import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationTableLayout } from './operation-table-layout.component';

describe('OperationTableLayout', () => {
  let component: OperationTableLayout;
  let fixture: ComponentFixture<OperationTableLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationTableLayout ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationTableLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
