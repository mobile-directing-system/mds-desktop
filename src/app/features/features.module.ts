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
import { OperationTableModule } from './operation-table/operation-table.module';


@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    ManagementModule,
    MailboxModule,
    IntelligenceModule,
    ResourcesModule,
    LogisticsModule,
    SignalerModule,
    ReviewerModule,
    OperationTableModule
  ],
})
export class FeaturesModule {
}
