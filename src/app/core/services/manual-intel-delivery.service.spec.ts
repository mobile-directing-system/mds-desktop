import { TestBed } from '@angular/core/testing';

import { ManualIntelDeliveryService } from './manual-intel-delivery.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { IntelDeliveryService } from './intel-delivery.service';
import { IntelService } from './intel.service';
import { AddressBookService } from './addressbook.service';
import { ChannelService } from './channel.service';
import { UserService } from './user.service';
import { OperationService } from './operation.service';

describe('ManualIntelDeliveryService', () => {
  let spectator: SpectatorService<ManualIntelDeliveryService>;
  let service: ManualIntelDeliveryService;
  const createService = createServiceFactory({
    service: ManualIntelDeliveryService,
    mocks: [
      IntelDeliveryService,
      IntelService,
      AddressBookService,
      ChannelService,
      UserService,
      OperationService,
    ],
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManualIntelDeliveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
