import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialog } from '../delete-confirm-dialog/delete-confirm-dialog.component';

/**
 * Delete-button with confirm-dialog.
 */
@Component({
  selector: 'app-delete-confirm-button',
  templateUrl: './delete-confirm-button.component.html',
  styleUrls: ['./delete-confirm-button.component.scss'],
})
export class DeleteConfirmButtonComponent {
  /**
   * Emits, when deletion is desired and confirmed.
   */
  @Output() deleteConfirmed = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {
  }

  /**
   * Opens the confirm dialog for confirming deletion.
   */
  requestConfirmAndDelete(): void {
    const result = DeleteConfirmDialog.open(this.dialog);
    result.afterClosed().subscribe(confirmed => confirmed && this.deleteConfirmed.next(void 0));
  }
}
