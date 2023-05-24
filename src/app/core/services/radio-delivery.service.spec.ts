import { TestBed } from '@angular/core/testing';

import { RadioDeliveryService } from './radio-delivery.service';

describe('RadioDeliveryService', () => {
  let service: RadioDeliveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioDeliveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
