import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListActionBarComponent } from './list-action-bar.component';

describe('ListActionBarComponent', () => {
  let component: ListActionBarComponent;
  let fixture: ComponentFixture<ListActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListActionBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
