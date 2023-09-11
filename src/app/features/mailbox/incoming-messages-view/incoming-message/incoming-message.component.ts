import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../incoming-messages-view.component";
import {MessageService} from "../../../../core/services/message/message.service";
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-incoming-message',
  templateUrl: './incoming-message.component.html',
  styleUrls: ['./incoming-message.component.scss']
})
export class IncomingMessageComponent {
  constructor(
    public dialogRef: MatDialogRef<IncomingMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public messageService: MessageService,
    private notificationService: NotificationService
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  toggleReadState(): void {
   this.messageService.getMessageById(this.data.messageRow.id).subscribe((message) =>{
     if(!message){
       this.notificationService.notifyUninvasiveShort($localize`Error, could not find the message in the system.`);
       this.dialogRef.close();
       return;
     }

     message.recipients.forEach((recipient) => {
       if(recipient.recipientId === this.data.loggedInRole.id) recipient.read = !this.data.isRead;
     })
     this.messageService.updateMessage(message).subscribe(success=>{
       if(success) {
         if(!this.data.isRead)this.notificationService.notifyUninvasiveShort($localize`Marked message as read.`);
         if(this.data.isRead)this.notificationService.notifyUninvasiveShort($localize`Marked message as unread.`);
       }
       else this.notificationService.notifyUninvasiveShort($localize`Error while marking the message as read.`);
       this.dialogRef.close();
     });
   })
  }
}
