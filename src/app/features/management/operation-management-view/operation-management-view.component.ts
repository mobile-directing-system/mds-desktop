import { Component } from '@angular/core';
import { createSearchParams, orderDirFromSort, Paginated, PaginationParams } from '../../../core/util/store';
import { OperationService, OperationSort } from '../../../core/services/operation.service';
import { Operation } from '../../../core/model/operation';
import { Loader } from '../../../core/util/loader';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { MDSError, MDSErrorCode } from '../../../core/util/errors';
import { Sort } from '@angular/material/sort';

/**
 * View with operation list.
 */
@Component({
  selector: 'app-operation-management-view',
  templateUrl: './operation-management-view.component.html',
  styleUrls: ['./operation-management-view.component.scss'],
})
export class OperationManagementView {
  columnsToDisplay = ['title', 'description', 'start', 'end', 'props'];
  pagination?: PaginationParams<OperationSort>;
  loadedOperations?: Paginated<Operation>;
  search: string = '';


  /**
   * Loader for when we are currently retrieving data.
   */
  retrieving = new Loader();

  constructor(private operationService: OperationService, private router: Router, private route: ActivatedRoute) {
  }

  refresh(): void {
    this.retrieving.loadFrom(() => {
      if (!this.pagination) {
        return EMPTY;
      }
      if (this.search != '') {
        return this.operationService.searchOperations(createSearchParams(this.pagination, this.search), {})
          .pipe(map(result => result.toPaginated()));
      }
      return this.operationService.getOperations(this.pagination, {});
    }).subscribe(result => (this.loadedOperations = result));
  }

  navigateToOperation(operationId: string) {
    this.router.navigate([operationId], { relativeTo: this.route }).then();
  }

  createOperation() {
    this.router.navigate(['create'], { relativeTo: this.route }).then();
  }

  /**
   * Called when pagination is updated.
   * @param pagination
   */
  page(pagination: PaginationParams<string>): void {
    this.pagination = pagination.mapOrderBy(OperationManagementView.mapOrderBy);
    this.refresh();
  }

  asOperation(o: Operation): Operation {
    return o;
  }

  private static mapOrderBy(s: string): OperationSort | undefined {
    switch (s) {
      case 'title':
        return OperationSort.ByTitle;
      case 'description':
        return OperationSort.ByDescription;
      case 'start':
        return OperationSort.ByStart;
      case 'end':
        return OperationSort.ByEnd;
      case '':
        return undefined;
      default:
        throw new MDSError(MDSErrorCode.AppError, `unsupported order-by: ${ s }`);
    }
  }

  /**
   * Called when sort changes.
   * @param sort New sort.
   */
  sortChange(sort: Sort): void {
    if (!this.pagination) {
      return;
    }
    this.pagination.applyOrderBy(OperationManagementView.mapOrderBy(sort.active), orderDirFromSort(sort));
    this.refresh();
  }

  searchChange(term: string): void {
    this.search = term;
    this.refresh();
  }

  /**
   * Returns `true` when start timestamp is not reached, yet.
   * @param operation The operation to check.
   */
  isOperationInFuture(operation: Operation): boolean {
    return operation.start.getTime() > new Date().getTime();
  }

  /**
   * Returns `true` when the operation is currently active, meaning that end is not set or in the future and start
   * already reached.
   * @param operation The operation to check active-state for.
   */
  isOperationActive(operation: Operation): boolean {
    if (operation.start.getTime() > new Date().getTime()) {
      return false;
    }
    if (operation.end === undefined) {
      return true;
    }
    return operation.end > new Date();
  }
}
