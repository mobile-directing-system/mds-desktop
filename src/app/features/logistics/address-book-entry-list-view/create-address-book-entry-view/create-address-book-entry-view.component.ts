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
import { AddressBookEntry, CreateAddressBookEntry } from '../../../../core/model/addressbookEntry';

/**
 * View to create a new {@link AddressBookEntry}.
 */
@Component({
  selector: 'app-create-address-book-entry-view',
  templateUrl: './create-address-book-entry-view.component.html',
  styleUrls: ['./create-address-book-entry-view.component.scss'],
})
export class CreateAddressBookEntryView {
  creatingAddressBookEntry = new Loader();

  form = this.fb.nonNullable.group({
    label: this.fb.nonNullable.control<string>('', Validators.required),
    description: this.fb.nonNullable.control<string>(''),
    operation: this.fb.nonNullable.control<string | null>(null),
    user: this.fb.nonNullable.control<string | null>(null),
  });

  constructor(private addressBookService: AddressBookService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute, private userService: UserService, private operationService: OperationService) {
  }

  createEntry(): void {
    const fv = this.form.getRawValue();
    const create: CreateAddressBookEntry = {
      label: fv.label,
      description: fv.description,
      operation: fv.operation ?? undefined,
      user: fv.user ?? undefined,
    };
    this.creatingAddressBookEntry.load(this.addressBookService.createAddressBookEntry(create)).subscribe({
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
    ).pipe(map((res: SearchResult<Operation>): Operation[] => {
      return res.hits;
    }));
  }

  cancel() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }
}
