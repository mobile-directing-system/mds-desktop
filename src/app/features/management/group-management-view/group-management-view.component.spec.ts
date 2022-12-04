import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupManagementView } from './group-management-view.component';

describe('GroupManagementViewComponent', () => {
  let component: GroupManagementView;
  let fixture: ComponentFixture<GroupManagementView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupManagementView ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupManagementView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
