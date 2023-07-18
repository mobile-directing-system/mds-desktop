import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CreateIncidentComponent } from './create-incident.component';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { mockLocalStorage } from 'src/app/core/util/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LocalStorageIncidentService } from 'src/app/core/services/incident/local-storage-incident.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { mockLocalStorageService } from 'src/app/core/services/local-storage.service.spec';

describe('CreateIncidentComponent', () => {
  let component: CreateIncidentComponent;
  let fixture: ComponentFixture<CreateIncidentComponent>;
  let incidentService: IncidentService;

  beforeEach(async () => {
    let notificationServiceMock = jasmine.createSpyObj("NotificationService", ["notifyUninvasiveShort"]);
    await TestBed.configureTestingModule({
      declarations: [ CreateIncidentComponent ],
      imports: [ ReactiveFormsModule, FormsModule ],
      providers: [
        {
          provide: IncidentService,
          useClass: LocalStorageIncidentService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 0})
          }
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock
        },
        {
          provide: LocalStorageService,
          useValue: mockLocalStorageService()
        }
      ]
    })
    .compileComponents();

    mockLocalStorage();

    TestBed.inject(LocalStorageService).setItem(LocalStorageService.TokenWorkspaceOperation, "123");

    incidentService = TestBed.inject(IncidentService);

    fixture = TestBed.createComponent(CreateIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create incident correctly', () => {
    component.form.setValue({
      name: "Test",
      description: "123"
    });
    component.createIncident();
    incidentService.getIncidents().subscribe(incidents => {
       expect(incidents.length).toBe(1);
    });
  });
});
