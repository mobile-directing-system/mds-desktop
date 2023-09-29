import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { OutgoingMessagesViewComponent } from './outgoing/outgoing-messages-view/outgoing-messages-view.component';
import { ReviewerOutgoingLayoutComponent } from './outgoing/reviewer-outgoing-layout/reviewer-outgoing-layout.component';
import { SelectChannelDialog } from './outgoing/select-channel-dialog/select-channel-dialog.component';
import { ReviewerIncomingView } from './incoming/reviewer-incoming-view.component';

@NgModule({
  declarations: [
    ReviewerOutgoingLayoutComponent,
    OutgoingMessagesViewComponent,
    SelectChannelDialog,
    ReviewerIncomingView
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class ReviewerModule { }
