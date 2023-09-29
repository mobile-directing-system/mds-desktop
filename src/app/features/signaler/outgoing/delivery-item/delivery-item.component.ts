import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DeliveryItemDialogAction, DeliveryItemDialogData} from "../signaler-outgoing-view.component";

/**
 * Component for visualising a {@link Message} which should be sent
 */
@Component({
  selector: 'app-delivery-item',
  templateUrl: './delivery-item.component.html',
  styleUrls: ['./delivery-item.component.scss']
})
export class DeliveryItemComponent {

  constructor(
    public dialogRef: MatDialogRef<DeliveryItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeliveryItemDialogData
  ) {}

  /**
   * Closes the dialog
   */
  closeDialog(action: DeliveryItemDialogAction): void {
    this.dialogRef.close(action);
  }

  protected readonly DeliveryItemDialogAction = DeliveryItemDialogAction;
}
