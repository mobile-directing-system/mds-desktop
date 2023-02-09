import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription, switchMap } from 'rxjs';
import { AddressBookService } from '../../../../core/services/addressbook.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { OperationService } from '../../../../core/services/operation.service';
import { Loader } from '../../../../core/util/loader';
import { User } from '../../../../core/model/user';
import { Operation } from '../../../../core/model/operation';
import { map } from 'rxjs/operators';
import { SearchResult } from '../../../../core/util/store';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';

/**
 * View to edit an existing {@link AddressBookEntry}
 */
@Component({
  selector: 'app-edit-address-book-entry-view',
  templateUrl: './edit-address-book-entry-view.component.html',
  styleUrls: ['./edit-address-book-entry-view.component.scss'],
})
export class EditAddressBookEntryView implements OnInit, OnDestroy {

  loader = new Loader();
  entryId = '';
  s: Subscription[] = [];
  userDetails: User | undefined | null;

  constructor(private addressBookService: AddressBookService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute, private userService: UserService, private operationService: OperationService) {
  }


  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.route.params.pipe(
      switchMap(params => {
        this.entryId = params['entryId'];
        return this.loader.load(this.addressBookService.getAddressBookEntryById(this.entryId));
      }),
    ).subscribe(currentEntry => {
      // patch the details of the current Entry.
      this.form.patchValue({
        label: currentEntry.label,
        description: currentEntry.description,
        operation: currentEntry.operation,
        user: currentEntry.user,
      });
      this.userDetails = currentEntry.userDetails;
    }));

    this.s.push(
      this.form.controls.user.valueChanges.pipe(
        switchMap(userId => {
          if (!userId){
            return of(null);
          }
          return this.userService.getUserById(userId);
        })
      ).subscribe(userDetails => {
        this.userDetails = userDetails;
      })
    )
  }

  form = this.fb.nonNullable.group({
    label: this.fb.nonNullable.control<string>('', Validators.required),
    description: this.fb.nonNullable.control<string>(''),
    operation: this.fb.nonNullable.control<string | null>(null),
    user: this.fb.nonNullable.control<string | null>(null),
  });

  updateEntry(): void {
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
    this.loader.load(this.addressBookService.updateAddressBookEntry({
      id: this.entryId,
      label: label,
      description: description,
      operation: operation ?? undefined,
      user: user ?? undefined,
    })).subscribe({
      next: _ => {
        this.cancel();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Updating address book entry failed.`);
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
