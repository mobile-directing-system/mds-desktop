import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { ReviewerOutgoingView } from './outgoing/reviewer-outgoing-view.component';



@NgModule({
  declarations: [
    ReviewerOutgoingView
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class ReviewerModule { }
