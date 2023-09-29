import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../incoming-messages-view.component";
import {MessageService} from "../../../../core/services/message/message.service";
import {NotificationService} from "../../../../core/services/notification.service";
import {Router} from "@angular/router";

/**
 * Detail view of one incoming message
 */
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
    private notificationService: NotificationService,
    private router: Router
  ) {}

  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Creates new message with passing the message as a context
   */
  reactWithNewMessage(): void {
    this.dialogRef.close();
    this.router.navigate(["/mailbox/create", this.data.messageRow.id]).then();
  }



  /**
   * Marks message as read/unread
   */
  toggleReadState(): void {
    // load message
   this.messageService.getMessageById(this.data.messageRow.id).subscribe((message) =>{
     if(!message){
       this.notificationService.notifyUninvasiveShort($localize`Error, could not find the message in the system.`);
       this.dialogRef.close();
       return;
     }

     // set message to read/unread for the logged-in role
     message.recipients.forEach((recipient) => {
       if(recipient.recipientId === this.data.loggedInRole.id) recipient.read = !this.data.isRead;
     })

     // save message
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
