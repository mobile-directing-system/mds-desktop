import { TestBed } from '@angular/core/testing';

import { LocalStorageIncidentService } from './local-storage-incident.service';

describe('LocalStorageIncidentService', () => {
  let service: LocalStorageIncidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageIncidentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
