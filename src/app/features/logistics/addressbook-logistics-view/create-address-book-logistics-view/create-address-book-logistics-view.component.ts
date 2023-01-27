import { Component } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { OperationService } from '../../../../core/services/operation.service';
import { AddressBookService } from '../../../../core/services/addressbook.service';
import { User } from '../../../../core/model/user';
import { map } from 'rxjs/operators';
import { SearchResult } from '../../../../core/util/store';
import { Operation } from '../../../../core/model/operation';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';

/**
 * View to create a new {@link AddressBookEntry}.
 */
@Component({
  selector: 'app-create-address-book-logistics-view',
  templateUrl: './create-address-book-logistics-view.component.html',
  styleUrls: ['./create-address-book-logistics-view.component.scss']
})
export class CreateAddressBookLogisticsView {
  creatingAddressBookEntry = new Loader();

  form = this.fb.nonNullable.group({
    label: this.fb.nonNullable.control<string>('', Validators.required),
    description: this.fb.nonNullable.control<string>(''),
    operation: this.fb.nonNullable.control<string | null>(null),
    user: this.fb.nonNullable.control<string | null>(null),
  })

  constructor(private addressBookService: AddressBookService, private notificationService: NotificationService, private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute, private userService: UserService, private operationService: OperationService) {
  }

  createEntry(): void {
    const label = this.form.value.label;
    if (label === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'label control is not set.');
    }
    const description = this.form.value.description;
    if (description === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'description control is not set.');
    }
    const operation = this.form.value.operation;
    if (operation === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'operation control is not set.');
    }
    const user = this.form.value.user;
    if (user === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'user control is not set.');
    }
    this.creatingAddressBookEntry.load(this.addressBookService.createAddressBookEntry({
      label: label,
      description: description,
      operation: operation ?? undefined,
      user: user ?? undefined,
    })).subscribe({
      next: _ => {
        this.cancel();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Address book entry creation failed.`);
      },
    });
  }

  getUserById(id: string): Observable<User> {
    return this.userService.getUserById(id);
  }

  getOperationById(id: string): Observable<Operation> {
    return this.operationService.getOperationById(id);
  }

  asUser(entity: User): User {
    return entity;
  }

  asOperation(entity: Operation): Operation {
    return entity;
  }

  searchUsers(query: string): Observable<User[]> {
    return this.userService.searchUsers({
      query: query,
      limit: 5,
      offset: 0,
    }, false).pipe(
      map((res: SearchResult<User>): User[] => {
        return res.hits;
      }));
  }

  searchOperations(query: string): Observable<Operation[]> {
    return this.operationService.searchOperations({
        query: query,
        limit: 5,
        offset: 0,
      }, {},
    ).pipe(
      map((res: SearchResult<Operation>): Operation[] => {
        return res.hits;
      }));
  }

  cancel() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }
}
