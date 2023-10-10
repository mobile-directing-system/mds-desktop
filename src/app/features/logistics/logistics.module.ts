import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticsLayoutComponent } from './logistics-layout/logistics-layout.component';
import { AddressBookEntryListView } from './address-book-entry-list-view/address-book-entry-list-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';
import {
  CreateAddressBookEntryView,
} from './address-book-entry-list-view/create-address-book-entry-view/create-address-book-entry-view.component';
import {
  EditAddressBookEntryView,
} from './address-book-entry-list-view/edit-address-book-entry-view/edit-address-book-entry-view.component';
import { ChannelsComponent } from './channels/channels.component';
import { CoreModule } from '../../core/core.module';
import { AngularMaterialModule } from '../../core/util/angular-material.module';
import { ChannelDetailsDialog } from './channels/channel-details-dialog/channel-details-dialog.component';
import {
  RadioChannelDetailsComponent,
} from './channels/channel-details-dialog/radio-channel-details/radio-channel-details.component';
import { IntelDeliveryModule } from './intel-delivery/intel-delivery.module';
import { AddressBookEntryAutoIntelDeliveryComponent } from './address-book-entry-list-view/address-book-entry-auto-intel-delivery/address-book-entry-auto-intel-delivery.component';
import { AddressBookLayoutComponent } from './address-book-layout/address-book-layout.component';
import { MailChannelDetailsComponent } from './channels/channel-details-dialog/mail-channel-details/mail-channel-details.component';
import { PhoneChannelDetailsComponent } from './channels/channel-details-dialog/phone-channel-details/phone-channel-details.component';


@NgModule({
  declarations: [
    AddressBookEntryListView,
    LogisticsLayoutComponent,
    CreateAddressBookEntryView,
    EditAddressBookEntryView,
    LogisticsLayoutComponent,
    ChannelsComponent,
    ChannelDetailsDialog,
    RadioChannelDetailsComponent,
    AddressBookEntryAutoIntelDeliveryComponent,
    AddressBookLayoutComponent,
    MailChannelDetailsComponent,
    PhoneChannelDetailsComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLinkWithHref,
    MatNativeDateModule,
    MtxDatetimepickerModule,
    MtxNativeDatetimeModule,
    CommonModule,
    CoreModule,
    AngularMaterialModule,
    IntelDeliveryModule,
  ],
})
export class LogisticsModule {
}
