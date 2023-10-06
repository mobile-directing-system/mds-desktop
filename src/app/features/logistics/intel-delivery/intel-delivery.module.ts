import { NgModule } from '@angular/core';
import { IntelDeliveryView } from './intel-delivery-view/intel-delivery-view.component';
import { CoreModule } from '../../../core/core.module';
import { IntelDeliveryStatusComponent } from './intel-delivery-status/intel-delivery-status.component';
import { OpenIntelDeliveriesTableComponent } from './open-intel-deliveries-table/open-intel-deliveries-table.component';
import { IntelToDeliverDetailsComponent } from './intel-to-deliver-details/intel-to-deliver-details.component';
import { IntelToDeliverAttemptsComponent } from './intel-to-deliver-attempts/intel-to-deliver-attempts.component';
import {
  IntelToDeliverChannelSelectionComponent,
} from './intel-to-deliver-channel-selection/intel-to-deliver-channel-selection.component';
import { DeliverChannelComponent } from './deliver-channel/deliver-channel.component';
import { RouterLink } from '@angular/router';
import { CancelIntelDeliveryDialog } from './cancel-intel-delivery-dialog/cancel-intel-delivery-dialog.component';

/**
 * @deprecated because requirements of application changed. Is replaced by {@link ReviewerIncomingLayoutComponent} and
 * {@link ReviewerOutgoingLayoutComponent}
 */
@NgModule({
  declarations: [
    IntelDeliveryView,
    IntelDeliveryStatusComponent,
    OpenIntelDeliveriesTableComponent,
    IntelToDeliverDetailsComponent,
    IntelToDeliverAttemptsComponent,
    IntelToDeliverChannelSelectionComponent,
    DeliverChannelComponent,
    CancelIntelDeliveryDialog,
  ],
  imports: [
    CoreModule,
    RouterLink,
  ],
})
export class IntelDeliveryModule {
}
