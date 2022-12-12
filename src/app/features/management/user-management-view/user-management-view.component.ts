import { Component } from '@angular/core';
import { createSearchParams, orderDirFromSort, Paginated, PaginationParams } from '../../../core/util/store';
import { UserService, UserSort } from '../../../core/services/user.service';
import { User } from '../../../core/model/user';
import { Sort } from '@angular/material/sort';
import { EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { Loader } from '../../../core/util/loader';
import { MDSError, MDSErrorCode } from '../../../core/util/errors';

/**
 * View with user list.
 */
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management-view.component.html',
  styleUrls: ['./user-management-view.component.scss'],
})
export class UserManagementView {
  columnsToDisplay = ['lastName', 'firstName', 'username', 'props'];
  pagination?: PaginationParams<UserSort>;
  loadedUsers?: Paginated<User>;
  search: string = '';

  /**
   * Loader for when we are currently retrieving data.
   */
  retrieving = new Loader();

  constructor(private userService: UserService) {
  }

  refresh(): void {
    this.retrieving.loadFrom(() => {
      if (!this.pagination) {
        return EMPTY;
      }
      if (this.search != '') {
        return this.userService.searchUsers(createSearchParams(this.pagination, this.search), true)
          .pipe(map(result => result.toPaginated()));
      }
      return this.userService.getUsers(this.pagination);
    }).subscribe(result => (this.loadedUsers = result));
  }

  editUser(userId: string): void {
    console.log(`edit user ${ userId }`);
  }

  createUser(): void {
  }

  /**
   * Called when pagination is updated.
   * @param pagination
   */
  page(pagination: PaginationParams<string>): void {
    this.pagination = pagination.mapOrderBy(UserManagementView.mapOrderBy);
    this.refresh();
  }

  asUser(u: User): User {
    return u;
  }

  private static mapOrderBy(s: string): UserSort | undefined {
    switch (s) {
      case 'lastName':
        return UserSort.ByLastName;
      case 'firstName':
        return UserSort.ByFirstName;
      case 'username':
        return UserSort.ByUsername;
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
    this.pagination.applyOrderBy(UserManagementView.mapOrderBy(sort.active), orderDirFromSort(sort));
    this.refresh();
  }

  searchChange(term: string): void {
    this.search = term;
    this.refresh();
  }
}
