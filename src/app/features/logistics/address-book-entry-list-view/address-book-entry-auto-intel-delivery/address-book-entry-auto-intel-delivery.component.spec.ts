import { AddressBookEntryAutoIntelDeliveryComponent } from './address-book-entry-auto-intel-delivery.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../../../core/core.module';
import { LogisticsModule } from '../../logistics.module';
import { AddressBookService } from '../../../../core/services/addressbook.service';
import { NotificationService } from '../../../../core/services/notification.service';

describe('AddressBookEntryAutoIntelDeliveryComponent', () => {
  let spectator: Spectator<AddressBookEntryAutoIntelDeliveryComponent>;
  let component: AddressBookEntryAutoIntelDeliveryComponent;
  const createComponent = createComponentFactory({
    component: AddressBookEntryAutoIntelDeliveryComponent,
    imports: [
      CoreModule,
      LogisticsModule,
    ],
    mocks: [AddressBookService, NotificationService],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
