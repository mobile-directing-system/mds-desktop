import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticsLayoutComponent } from './logistics-layout/logistics-layout.component';
import { AddressBookEntryLogisticsView } from './addressbook-logistics-view/addressbook-logistics-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';
import {
  CreateAddressBookLogisticsView,
} from './addressbook-logistics-view/create-address-book-logistics-view/create-address-book-logistics-view.component';
import {
  EditAddressBookLogisticsView,
} from './addressbook-logistics-view/edit-address-book-logistics-view/edit-address-book-logistics-view.component';
import { ChannelsComponent } from './channels/channels.component';
import { CoreModule } from '../../core/core.module';
import { AngularMaterialModule } from '../../core/util/angular-material.module';
import { ChannelDetailsDialog } from './channels/channel-details-dialog/channel-details-dialog.component';
import { RadioChannelDetailsComponent } from './channels/channel-details-dialog/radio-channel-details/radio-channel-details.component';
import { InAppNotificationChannelDetailsComponent } from './channels/channel-details-dialog/in-app-notification-channel-details/in-app-notification-channel-details.component';


@NgModule({
  declarations: [
    AddressBookEntryLogisticsView,
    LogisticsLayoutComponent,
    CreateAddressBookLogisticsView,
    EditAddressBookLogisticsView,
    LogisticsLayoutComponent,
    ChannelsComponent,
    ChannelDetailsDialog,
    RadioChannelDetailsComponent,
    InAppNotificationChannelDetailsComponent,
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
  ],
})
export class LogisticsModule {
}
