import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth.module';
import { ManagementModule } from './management/management.module';
import { MailboxModule } from './mailbox/mailbox.module';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { ResourcesModule } from './resources/resources.module';
import { LogisticsModule } from './logistics/logistics.module';
import { SignalerModule } from './signaler/signaler.module';
import { ReviewerModule } from './reviewer/reviewer.module';
import { OperationTableView } from './operation-table/operation-table-view.component';


@NgModule({
  declarations: [
    OperationTableView,
  ],
  imports: [
    CommonModule,
    AuthModule,
    ManagementModule,
    MailboxModule,
    IntelligenceModule,
    ResourcesModule,
    LogisticsModule,
    SignalerModule,
    ReviewerModule
  ],
})
export class FeaturesModule {
}
