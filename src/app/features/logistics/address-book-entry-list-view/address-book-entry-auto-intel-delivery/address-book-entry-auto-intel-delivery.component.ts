import { Component, Input } from '@angular/core';
import { AddressBookService } from '../../../../core/services/addressbook.service';
import { Loader } from '../../../../core/util/loader';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-address-book-entry-auto-intel-delivery',
  templateUrl: './address-book-entry-auto-intel-delivery.component.html',
  styleUrls: ['./address-book-entry-auto-intel-delivery.component.scss'],
})
export class AddressBookEntryAutoIntelDeliveryComponent {
  loader = new Loader();

  private _entryId?: string;
  /**
   * Id of the address book entry to display auto intel delivery state for.
   * @param entryId
   */
  @Input() set entryId(entryId: string | undefined) {
    this._entryId = entryId;
    this.refresh();
  }

  refresh(): void {
    if (!this._entryId) {
      return;
    }
    this.isAutoIntelDeliveryEnabled = false;
    this.loader.take(this.addressBookService.isAutoIntelDeliveryEnabledForAddressBookEntry(this._entryId)
      .subscribe(isEnabled => this.isAutoIntelDeliveryEnabled = isEnabled), 'enabled-retrieval');
  }

  /**
   * Describes whether auto intel delivery is enabled for the entry with {@link _entryId}.
   */
  isAutoIntelDeliveryEnabled = false;

  constructor(private addressBookService: AddressBookService, private notificationService: NotificationService) {
  }

  enable(): void {
    if (!this._entryId) {
      return;
    }
    this.loader.take(this.addressBookService.enableAutoIntelDeliveryForAddressBookEntry(this._entryId)
      .subscribe(() => {
        this.notificationService.notifyUninvasiveShort($localize`Auto Intel Delivery for this entry is now enabled.`);
        this.refresh();
      }), 'set');
  }

  disable(): void {
    if (!this._entryId) {
      return;
    }
    this.loader.take(this.addressBookService.disableAutoIntelDeliveryForAddressBookEntry(this._entryId)
      .subscribe(() => {
        this.notificationService.notifyUninvasiveShort($localize`Auto Intel Delivery for this entry is now disabled.`);
        this.refresh();
      }), 'set');
  }
}
