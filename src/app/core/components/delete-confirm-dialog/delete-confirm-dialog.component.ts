import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

/**
 * Dialog for confirming deletion, returning a `boolean`, describing whether deletion was confirmed.
 */
@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss'],
})
export class DeleteConfirmDialog {
  /**
   * Message in the dialog content.
   */
  @Input() message: string = $localize`Do you really want to delete this entity?`;
  /**
   * Label for the delete-confirm-button.
   */
  @Input() deleteLabel: string = $localize`Delete`;

  constructor(private dialogRef: MatDialogRef<DeleteConfirmDialog>) {
  }

  static open(dialog: MatDialog): MatDialogRef<DeleteConfirmDialog, boolean> {
    return dialog.open<DeleteConfirmDialog, {}, boolean>(DeleteConfirmDialog);
  }

  /**
   * Closes the dialog with the given value.
   * @param confirmed The value to return.
   */
  close(confirmed: boolean): void {
    this.dialogRef.close(confirmed);
  }
}
