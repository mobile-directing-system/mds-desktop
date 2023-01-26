import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { orderDirFromSort, Paginated, PaginationParams } from '../../../core/util/store';
import { EMPTY } from 'rxjs';
import { Loader } from '../../../core/util/loader';
import { GroupService, GroupSort } from '../../../core/services/group.service';
import { Group } from '../../../core/model/group';
import { MDSError, MDSErrorCode } from '../../../core/util/errors';
import { Sort } from '@angular/material/sort';
import { Operation } from '../../../core/model/operation';
import { OperationService } from '../../../core/services/operation.service';
import { map } from 'rxjs/operators';

/**
 * Interface to contain the group as well as it's associated operation.
 */
export interface GroupTableRowContent {
  group: Group,
  operation: Operation | null | undefined
}

@Component({
  selector: 'app-group-management-view',
  templateUrl: './group-management-view.component.html',
  styleUrls: ['./group-management-view.component.scss'],
})
export class GroupManagementView {
  columnsToDisplay = ['title', 'description', 'operation'];
  pagination?: PaginationParams<GroupSort>;
  loadedGroupTableData?: Paginated<GroupTableRowContent>;

  constructor(private router: Router, private route: ActivatedRoute, private groupService: GroupService, private operationService: OperationService) {
  }

  retrieving = new Loader();
  retrievingOperations = new Loader()

  refresh(): void {
    this.retrieving.loadFrom(() => {
      if (!this.pagination) {
        return EMPTY;
      }
      return this.groupService.getGroups(this.pagination, {}).pipe(
        map(paginatedGroups => {
          return new Paginated<GroupTableRowContent>(
            // Map groups to table row representation.
            paginatedGroups.entries.map(group => {
              // Operation is undefined from start but will be set null if group has no associated operation.
              // Otherwise, the respective operation will be retrieved.
              let tableEntry: GroupTableRowContent = {
                group: group,
                operation: undefined,
              };
              if (!group.operation) {
                tableEntry.operation = null;
              } else {
                this.retrievingOperations.load(this.operationService.getOperationById(group.operation)).subscribe(operation => tableEntry.operation = operation);
              }
              return tableEntry;
            }), {
              // Pagination details stay the same, since no extra groups where retrieved.
              retrieved: paginatedGroups.retrieved,
              limit: paginatedGroups.limit,
              offset: paginatedGroups.offset,
              total: paginatedGroups.total,
              orderedBy: paginatedGroups.orderedBy,
              orderDir: paginatedGroups.orderDir,
            });
        }),
      );
    }).subscribe(paginatedGroupTableContent => this.loadedGroupTableData = paginatedGroupTableContent);
  }

  navigateToGroup(groupId: string): void {
    this.router.navigate([groupId], { relativeTo: this.route }).then();
  }

  createGroup() {
    this.router.navigate(['create'], { relativeTo: this.route }).then();
  }

  /**
   * Called when pagination is updated.
   * @param pagination
   */
  page(pagination: PaginationParams<string>): void {
    this.pagination = pagination.mapOrderBy(GroupManagementView.mapOrderBy);
    this.refresh();
  }

  asGroupTableContent(groupTableContent: GroupTableRowContent): GroupTableRowContent {
    return groupTableContent;
  }

  /**
   * Returns the Operation title of the given groupTableContent. Returns an empty string if the operation
   * is null or undefined.
   * @param groupTableContent groupTableContent.
   */
  getOperationTitleFromGroupTableContent(groupTableContent: GroupTableRowContent): string {
    if (!groupTableContent.operation) {
      return '';
    }
    return groupTableContent.operation.title;
  }

  private static mapOrderBy(s: string): GroupSort | undefined {
    switch (s) {
      case 'byTitle':
        return GroupSort.ByTitle;
      case 'byDescription':
        return GroupSort.ByDescription;
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
    this.pagination.applyOrderBy(GroupManagementView.mapOrderBy(sort.active), orderDirFromSort(sort));
    this.refresh();
  }
}
