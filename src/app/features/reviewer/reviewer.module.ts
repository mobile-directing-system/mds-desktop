import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { OutgoingMessagesViewComponent } from './outgoing/outgoing-messages-view/outgoing-messages-view.component';
import { ReviewerOutgoingLayoutComponent } from './outgoing/reviewer-outgoing-layout/reviewer-outgoing-layout.component';



@NgModule({
  declarations: [
    ReviewerOutgoingLayoutComponent,
    OutgoingMessagesViewComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class ReviewerModule { }
