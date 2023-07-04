import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalerIncomingView } from './incoming/signaler-incoming-view.component';
import { SignalerOutgoingView } from './outgoing/signaler-outgoing-view.component';



@NgModule({
  declarations: [
  
    SignalerIncomingView,
    SignalerOutgoingView
  ],
  imports: [
    CommonModule
  ]
})
export class SignalerModule { }
