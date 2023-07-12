import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIncidentComponent } from './create-incident.component';

describe('CreateIncidentComponent', () => {
  let component: CreateIncidentComponent;
  let fixture: ComponentFixture<CreateIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateIncidentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
