import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth.module';
import { ManagementModule } from './management/management.module';
import { MailboxModule } from './mailbox/mailbox.module';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { ResourcesModule } from './resources/resources.module';
import { LogisticsModule } from './logistics/logistics.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
    ManagementModule,
    MailboxModule,
    IntelligenceModule,
    ResourcesModule,
    LogisticsModule,
  ],
})
export class FeaturesModule {
}
