import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {DetailedRadioDelivery, RadioDelivery} from "../../../../core/model/radio-delivery";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../mailbox/incoming-messages-view/incoming-messages-view.component";
import {MessageService} from "../../../../core/services/message/message.service";
import {NotificationService} from "../../../../core/services/notification.service";
import {Router} from "@angular/router";
import {DeliveryItemDialogAction, DeliveryItemDialogData} from "../signaler-outgoing-view.component";

/**
 * Component for visualising one {@link RadioDelivery}
 */
@Component({
  selector: 'app-delivery-item',
  templateUrl: './delivery-item.component.html',
  styleUrls: ['./delivery-item.component.scss']
})
export class DeliveryItemComponent {

  constructor(
    public dialogRef: MatDialogRef<DeliveryItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeliveryItemDialogData,
    public messageService: MessageService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  /**
   * Closes dialog
   */
  closeDialog(action: DeliveryItemDialogAction): void {
    console.log("MMV closed")
    this.dialogRef.close(action);
  }

  protected readonly DeliveryItemDialogAction = DeliveryItemDialogAction;
}
