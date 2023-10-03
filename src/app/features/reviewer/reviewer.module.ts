import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { OutgoingMessagesViewComponent } from './outgoing/outgoing-messages-view/outgoing-messages-view.component';
import { ReviewerOutgoingLayoutComponent } from './outgoing/reviewer-outgoing-layout/reviewer-outgoing-layout.component';
import { SelectChannelDialog } from './outgoing/select-channel-dialog/select-channel-dialog.component';
import { ReviewerIncomingLayoutComponent } from './incoming/reviewer-incoming-layout/reviewer-incoming-layout.component';
import { IncomingMessagesViewComponent } from './incoming/incoming-messages-view/incoming-messages-view.component';

@NgModule({
  declarations: [
    ReviewerOutgoingLayoutComponent,
    OutgoingMessagesViewComponent,
    SelectChannelDialog,
    ReviewerIncomingLayoutComponent,
    IncomingMessagesViewComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class ReviewerModule { }
