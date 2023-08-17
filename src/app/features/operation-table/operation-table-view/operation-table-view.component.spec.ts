import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationTableView } from './operation-table-view.component';
import { mockLocalStorage } from 'src/app/core/util/testing';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { LocalStorageIncidentService } from 'src/app/core/services/incident/local-storage-incident.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LocalStorageResourceService } from 'src/app/core/services/resource/local-storage-resource.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('OperationTableView', () => {
  let component: OperationTableView;
  let fixture: ComponentFixture<OperationTableView>;
  let incidentService: IncidentService;

  beforeEach(async () => {
    let notificationServiceMock = jasmine.createSpyObj("NotificationService", ["notifyUninvasiveShort"]);
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ OperationTableView ],
      providers: [
        {
          provide: IncidentService,
          useClass: LocalStorageIncidentService
        },
        {
          provide: ResourceService,
          useClass: LocalStorageResourceService
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ]
    })
    .compileComponents();

    mockLocalStorage();

    incidentService = TestBed.inject(IncidentService);

    fixture = TestBed.createComponent(OperationTableView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
