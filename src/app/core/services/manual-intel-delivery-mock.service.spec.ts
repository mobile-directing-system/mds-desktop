import { TestBed } from '@angular/core/testing';

import { ManualIntelDeliveryMockService } from './manual-intel-delivery-mock.service';

describe('ManualIntelDeliveryMockService', () => {
  let service: ManualIntelDeliveryMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManualIntelDeliveryMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
