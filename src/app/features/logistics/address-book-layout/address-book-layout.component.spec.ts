import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookLayoutComponent } from './address-book-layout.component';

describe('AddressBookLayoutComponent', () => {
  let component: AddressBookLayoutComponent;
  let fixture: ComponentFixture<AddressBookLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressBookLayoutComponent]
    });
    fixture = TestBed.createComponent(AddressBookLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
