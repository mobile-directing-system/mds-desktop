import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ManualIntelDeliveryService } from '../../../../core/services/manual-intel-delivery.service';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';

/**
 * Dialog data for {@link CancelIntelDeliveryDialog}.
 */
export interface CancelIntelDeliveryDialogData {
  deliveryId: string;
}

/**
 * Dialog result of {@link CancelIntelDeliveryDialog}.
 */
export type CancelIntelDeliveryDialogResult = {
  action: 'submit';
  deliveryToCancel: string;
  success: boolean;
  note: string | undefined;
}

/**
 * Dialog for confirming whether a delivery should be deleted as well as obtaining information regarding success and
 * note.
 */
@Component({
  selector: 'app-cancel-intel-delivery-dialog',
  templateUrl: './cancel-intel-delivery-dialog.component.html',
  styleUrls: ['./cancel-intel-delivery-dialog.component.scss'],
})
export class CancelIntelDeliveryDialog implements OnInit, OnDestroy {
  /**
   * The id of the currently selected delivery. This is used in order to disable confirmation if it differs from the
   * provided one in dialog data.
   * @private
   */
  private currentlySelectedDelivery?: string;
  form = this.fb.nonNullable.group({
    success: this.fb.nonNullable.control<boolean>(false),
    note: this.fb.nonNullable.control<string>(''),
  });

  private s: Subscription[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: CancelIntelDeliveryDialogData,
              private dialogRef: MatDialogRef<CancelIntelDeliveryDialog, CancelIntelDeliveryDialogResult>,
              private manualIntelDeliveryService: ManualIntelDeliveryService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.s.push(this.manualIntelDeliveryService.selectedChange()
      .subscribe(selected => this.currentlySelectedDelivery = selected?.delivery.delivery.id));
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  allowConfirm(): boolean {
    return this.currentlySelectedDelivery !== undefined && this.currentlySelectedDelivery === this.data.deliveryId;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the dialog with action that confirms delivery cancellation.
   */
  confirm(): void {
    const v = this.form.getRawValue();
    this.dialogRef.close({
      action: 'submit',
      deliveryToCancel: this.data.deliveryId,
      success: v.success,
      note: v.note !== '' ? v.note : undefined,
    });
  }

  static open(dialog: MatDialog, data: CancelIntelDeliveryDialogData): MatDialogRef<CancelIntelDeliveryDialog, CancelIntelDeliveryDialogResult> {
    return dialog.open<CancelIntelDeliveryDialog, CancelIntelDeliveryDialogData, CancelIntelDeliveryDialogResult>(CancelIntelDeliveryDialog, {
      data: data,
    });
  }
}
