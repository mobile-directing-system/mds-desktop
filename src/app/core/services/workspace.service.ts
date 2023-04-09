import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {

  private operation = new BehaviorSubject<string | undefined>(undefined);

  /**
   * Notifies about changes to the currently selected operation.
   */
  operationChange(): Observable<string | undefined> {
    return this.operation.asObservable();
  }

  constructor(private lsService: LocalStorageService) {
    this.setOperation(lsService.getItem(LocalStorageService.TokenWorkspaceOperation) ?? undefined);
  }

  /**
   * Sets the current operation for the workspace.
   * @param operationId The id of the new selected operation.
   */
  setOperation(operationId: string | undefined): void {
    if (operationId === undefined) {
      this.lsService.removeItem(LocalStorageService.TokenWorkspaceOperation);
    } else {
      this.lsService.setItem(LocalStorageService.TokenWorkspaceOperation, operationId);
    }
    this.operation.next(operationId);
  }
}
