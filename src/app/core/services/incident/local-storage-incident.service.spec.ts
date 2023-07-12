import { TestBed } from '@angular/core/testing';

import { LocalStorageIncidentService } from './local-storage-incident.service';
import { IncidentService } from './incident.service';

describe('LocalStorageIncidentService', () => {
  let service: IncidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: IncidentService,
          useClass: LocalStorageIncidentService
        }
      ]
    });
    service = TestBed.inject(IncidentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
