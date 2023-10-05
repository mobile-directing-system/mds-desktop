import { TestBed } from '@angular/core/testing';

import { LocalStorageIncidentService } from './local-storage-incident.service';
import { IncidentService } from './incident.service';
import { Incident } from '../../model/incident';
import { IncidentFilters } from './incident.service';
import { mockLocalStorage } from '../../testutil/testutil';

describe('LocalStorageIncidentService', () => {
  let service: IncidentService;

  const exampleIncidents: Incident[] = [
    {
      id: "0",
      name: "Incident 123",
      description: "Test",
      operation: "1234",
      isCompleted: false
    },
    {
      id: "1",
      name: "Incident 456",
      description: "Test",
      operation: "1234",
      isCompleted: false
    },
    {
      id: "2",
      name: "Incident 890",
      description: "Test",
      operation: "1234",
      isCompleted: true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: IncidentService,
          useClass: LocalStorageIncidentService
        }
      ]
    });
    mockLocalStorage();
    service = TestBed.inject(IncidentService);
    exampleIncidents.forEach(i => service.createIncident(i));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch incidents without filter correctly', () => {
    service.getIncidents().subscribe(incidents => {
      expect(incidents.length).toBe(exampleIncidents.length);
    });
  });

  it('should fetch incidents with name filter correctly', () => {
    const filters: IncidentFilters = {
      byName: "Incident 123"
    };
    service.getIncidents(filters).subscribe(incidents => {
      expect(incidents.length).toBe(1);
      expect(incidents[0].name).toBe(filters.byName!);
    });
  });

  it('should fetch incidents with name and operation filter correctly', () => {
    const filters: IncidentFilters = {
      byName: "Incident 123",
      byOperation: "1234"
    };
    service.getIncidents(filters).subscribe(incidents => {
      expect(incidents.length).toBe(1);
      expect(incidents[0].name).toBe(filters.byName!);
      expect(incidents[0].operation).toBe(filters.byOperation!);
    });
  });

  it('should fetch incidents with isCompleted filter correctly', ()=> {
    const filters: IncidentFilters = {
      isCompleted: true
    }
    service.getIncidents(filters).subscribe(incidents => {
      expect(incidents.length).toBe(1);
      expect(incidents[0].name).toBe("Incident 890");
    });
  });
});
