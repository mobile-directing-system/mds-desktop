import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalerIncomingView } from './incoming/signaler-incoming-view.component';
import { SignalerOutgoingView } from './outgoing/signaler-outgoing-view.component';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SignalerIncomingView,
    SignalerOutgoingView
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule
  ]
})
export class SignalerModule { }
