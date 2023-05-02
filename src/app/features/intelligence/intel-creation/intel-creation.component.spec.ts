import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelCreationComponent } from './intel-creation.component';

describe('IntelCreationComponent', () => {
  let component: IntelCreationComponent;
  let fixture: ComponentFixture<IntelCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntelCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntelCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
