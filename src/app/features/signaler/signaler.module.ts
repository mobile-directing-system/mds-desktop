import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalerIncomingView } from './incoming/signaler-incoming-view.component';
import { SignalerOutgoingView } from './outgoing/signaler-outgoing-view.component';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';
import {DeliveryItemComponent} from "./outgoing/delivery-item/delivery-item.component";



@NgModule({
  declarations: [
    SignalerIncomingView,
    SignalerOutgoingView,
    DeliveryItemComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule
  ]
})
export class SignalerModule { }
