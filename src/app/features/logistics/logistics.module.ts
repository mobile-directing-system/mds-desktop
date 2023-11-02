import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { CoreModule } from '../../core/core.module';
import { AngularMaterialModule } from '../../core/util/angular-material.module';
import { AddressBookEntryAutoIntelDeliveryComponent } from './address-book-entry-list-view/address-book-entry-auto-intel-delivery/address-book-entry-auto-intel-delivery.component';
import { AddressBookEntryListView } from './address-book-entry-list-view/address-book-entry-list-view.component';
import {
  CreateAddressBookEntryView,
} from './address-book-entry-list-view/create-address-book-entry-view/create-address-book-entry-view.component';
import {
  EditAddressBookEntryView,
} from './address-book-entry-list-view/edit-address-book-entry-view/edit-address-book-entry-view.component';
import { AddressBookLayoutComponent } from './address-book-layout/address-book-layout.component';
import { IntelDeliveryModule } from './intel-delivery/intel-delivery.module';
import { LogisticsLayoutComponent } from './logistics-layout/logistics-layout.component';


@NgModule({
  declarations: [
    AddressBookEntryListView,
    LogisticsLayoutComponent,
    CreateAddressBookEntryView,
    EditAddressBookEntryView,
    LogisticsLayoutComponent,
    AddressBookEntryAutoIntelDeliveryComponent,
    AddressBookLayoutComponent
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
