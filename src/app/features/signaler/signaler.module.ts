import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalerIncomingView } from './incoming/signaler-incoming-view.component';
import { SignalerOutgoingView } from './outgoing/signaler-outgoing-view.component';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MessageSummaryComponent } from './incoming/message-summary/message-summary.component';



@NgModule({
  declarations: [
    SignalerIncomingView,
    SignalerOutgoingView,
    MessageSummaryComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule
  ]
})
export class SignalerModule { }
