import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailboxLayoutComponent } from './mailbox-layout/mailbox-layout.component';
import { IncomingMessagesViewComponent } from './incoming-messages-view/incoming-messages-view.component';
import {CoreModule} from "../../core/core.module";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import { IncomingMessageComponent } from './incoming-messages-view/incoming-message/incoming-message.component';
import { CreateMessageComponent } from './create-message/create-message.component';
import {RouterLink} from "@angular/router";



@NgModule({
  declarations: [
    MailboxLayoutComponent,
    IncomingMessagesViewComponent,
    IncomingMessageComponent,
    CreateMessageComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    RouterLink
  ]
})
export class MailboxModule { }
