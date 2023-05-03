import { Component, OnDestroy, OnInit } from '@angular/core';
import { WorkspaceService } from '../../../services/workspace.service';
import { OperationService } from '../../../services/operation.service';
import { Operation } from '../../../model/operation';
import { of, Subscription, switchMap, take, tap } from 'rxjs';
import { Loader } from '../../../util/loader';
import {
  SelectWorkspaceOperationDialog,
} from './select-workspace-operation-dialog/select-workspace-operation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Selector for selecting workspace operation.
 */
@Component({
  selector: 'app-workspace-operation-selector',
  templateUrl: './workspace-operation-selector.component.html',
  styleUrls: ['./workspace-operation-selector.component.scss'],
})
export class WorkspaceOperationSelectorComponent implements OnInit, OnDestroy {
  operation?: Operation;
  loader = new Loader();

  private s: Subscription[] = [];

  constructor(private workspaceService: WorkspaceService, private operationService: OperationService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.s.push(this.workspaceService.operationChange().pipe(
      switchMap(operationId => {
        if (operationId === undefined) {
          return of(undefined);
        }
        return this.loader.load(this.operationService.getOperationById(operationId));
      }),
      tap(operation => this.operation = operation),
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  asOperation(entity: Operation): Operation {
    return entity;
  }

  selectOperation(): void {
    this.workspaceService.operationChange().pipe(
      take(1),
      switchMap(operationId => SelectWorkspaceOperationDialog.open(this.dialog, { operationId: operationId }).afterClosed()),
    ).subscribe(result => {
      if (!result) {
        // Cancelled.
        return;
      }
      if (result.action === 'clear') {
        this.workspaceService.setOperation(undefined);
      } else if (result.action === 'submit') {
        this.workspaceService.setOperation(result.operationId);
      }
    });
  }
}
