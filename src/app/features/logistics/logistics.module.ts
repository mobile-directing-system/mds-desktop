import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticsLayoutComponent } from './logistics-layout/logistics-layout.component';
import { ChannelsComponent } from './channels/channels.component';
import { CoreModule } from '../../core/core.module';
import { AngularMaterialModule } from '../../core/util/angular-material.module';
import { ChannelDetailsDialog } from './channels/channel-details-dialog/channel-details-dialog.component';
import { RadioChannelDetailsComponent } from './channels/channel-details-dialog/radio-channel-details/radio-channel-details.component';
import { InAppNotificationChannelDetailsComponent } from './channels/channel-details-dialog/in-app-notification-channel-details/in-app-notification-channel-details.component';


@NgModule({
  declarations: [
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
  ],
})
export class LogisticsModule {
}
