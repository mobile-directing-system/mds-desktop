import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserView } from './update-user-view.component';

describe('UpdateUserView', () => {
  let component: UpdateUserView;
  let fixture: ComponentFixture<UpdateUserView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserView ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUserView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
