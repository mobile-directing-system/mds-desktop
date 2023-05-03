import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WorkspaceService } from '../../../../services/workspace.service';
import { OperationService } from '../../../../services/operation.service';
import { AuthService } from '../../../../services/auth.service';
import { SearchResult } from '../../../../util/store';
import { filter, Observable, switchMap } from 'rxjs';
import { Operation } from '../../../../model/operation';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

/**
 * Dialog data for {@link SelectWorkspaceOperationDialog}.
 */
export interface SelectWorkspaceOperationDialogData {
  operationId?: string;
}

/**
 * Dialog result of {@link SelectWorkspaceOperationDialog}.
 */
export type SelectWorkspaceOperationDialogResult = {
  action: 'submit';
  operationId: string;
} | {
  action: 'clear'
}

/**
 * Dialog for selecting workspace operation. Used in home layout header.
 */
@Component({
  selector: 'app-select-workspace-operation-dialog',
  templateUrl: './select-workspace-operation-dialog.component.html',
  styleUrls: ['./select-workspace-operation-dialog.component.scss'],
})
export class SelectWorkspaceOperationDialog {
  operationFC = new FormControl<string | null>(null, Validators.required);

  constructor(private workspaceService: WorkspaceService, private operationService: OperationService,
              private authService: AuthService, private dialogRef: MatDialogRef<SelectWorkspaceOperationDialog, SelectWorkspaceOperationDialogResult>) {
  }

  static open(matDialog: MatDialog, data: SelectWorkspaceOperationDialogData): MatDialogRef<SelectWorkspaceOperationDialog, SelectWorkspaceOperationDialogResult> {
    return matDialog.open<SelectWorkspaceOperationDialog, SelectWorkspaceOperationDialogData, SelectWorkspaceOperationDialogResult>(SelectWorkspaceOperationDialog, {
      data: data,
    });
  }

  getOperationById(id: string): Observable<Operation> {
    return this.operationService.getOperationById(id);
  }

  searchOperations(query: string): Observable<Operation[]> {
    return this.authService.userChange().pipe(
      filter(userId => userId !== undefined),
      switchMap(userId => this.operationService.searchOperations({
        query: query,
        limit: 5,
        offset: 0,
      }, {
        forUser: userId,
      })),
      map((res: SearchResult<Operation>): Operation[] => res.hits),
    );
  }

  asOperation(entity: Operation): Operation {
    return entity;
  }

  apply(): void {
    const selectedOperation = this.operationFC.getRawValue();
    let result: SelectWorkspaceOperationDialogResult;
    if (selectedOperation === null) {
      result = {
        action: 'clear',
      };
    } else {
      result = {
        action: 'submit',
        operationId: selectedOperation,
      };
    }
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
