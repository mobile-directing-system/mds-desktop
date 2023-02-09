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
import { AddressBookEntry } from '../../../../core/model/addressbookEntry';

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
          if (!userId) {
            return of(null);
          }
          return this.userService.getUserById(userId);
        }),
      ).subscribe(userDetails => {
        this.userDetails = userDetails;
      }),
    );
  }

  form = this.fb.nonNullable.group({
    label: this.fb.nonNullable.control<string>('', Validators.required),
    description: this.fb.nonNullable.control<string>(''),
    operation: this.fb.nonNullable.control<string | null>(null),
    user: this.fb.nonNullable.control<string | null>(null),
  });

  updateEntry(): void {
    const fv = this.form.getRawValue();
    const entry: AddressBookEntry = {
      id: this.entryId,
      label: fv.label,
      description: fv.description,
      operation: fv.operation ?? undefined,
      user: fv.user ?? undefined,
    };
    this.loader.load(this.addressBookService.updateAddressBookEntry(entry)).subscribe({
      next: _ => {
        this.close();
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

  close() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }

  delete(): void {
    this.loader.take(this.addressBookService.deleteAddressBookEntry(this.entryId)
      .subscribe(() => {
        this.notificationService.notifyUninvasiveShort(`Address book entry deleted.`);
        this.close();
      }));
  }
}
