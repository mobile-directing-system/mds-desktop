import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationTableView } from './operation-table-view.component';

describe('OperationTableView', () => {
  let component: OperationTableView;
  let fixture: ComponentFixture<OperationTableView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationTableView ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationTableView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
