import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationManagementView } from './operation-management-view.component';

describe('OperationManagementViewComponent', () => {
  let component: OperationManagementView;
  let fixture: ComponentFixture<OperationManagementView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationManagementView ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationManagementView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
