import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, of, Subscription, switchMap } from 'rxjs';
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
import { AddressBookEntry } from '../../../../core/model/address-book-entry';
import { Channel } from '../../../../core/model/channel';
import { ChannelService } from '../../../../core/services/channel.service';
import { AccessControlService } from '../../../../core/services/access-control.service';
import { ManageIntelDelivery } from '../../../../core/permissions/intel-delivery';

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

  form = this.fb.nonNullable.group({
    label: this.fb.nonNullable.control<string>('', Validators.required),
    description: this.fb.nonNullable.control<string>(''),
    operation: this.fb.nonNullable.control<string | null>(null),
    user: this.fb.nonNullable.control<string | null>(null),
    channels: this.fb.nonNullable.control<Channel[]>([]),
  });

  constructor(private addressBookService: AddressBookService, private notificationService: NotificationService,
              private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
              private userService: UserService, private operationService: OperationService,
              private channelService: ChannelService, private acService: AccessControlService) {
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.route.params.pipe(
      switchMap(params => {
        this.entryId = params['entryId'];
        return forkJoin({
          entry: this.loader.load(this.addressBookService.getAddressBookEntryById(this.entryId)),
          channels: this.loader.load(this.channelService.getChannelsByAddressBookEntry(this.entryId)),
        });
      }),
    ).subscribe(result => {
      this.form.patchValue({
        label: result.entry.label,
        description: result.entry.description,
        operation: result.entry.operation,
        user: result.entry.user,
        channels: result.channels,
      });
      this.userDetails = result.entry.userDetails;
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

  updateEntry(): void {
    const fv = this.form.getRawValue();
    const entry: AddressBookEntry = {
      id: this.entryId,
      label: fv.label,
      description: fv.description,
      operation: fv.operation ?? undefined,
      user: fv.user ?? undefined,
    };
    this.loader.load(forkJoin({
      entry: this.addressBookService.updateAddressBookEntry(entry),
      channels: this.channelService.updateChannelsByAddressBookEntry(this.entryId, fv.channels)
    })).subscribe({
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

  isManageAutoIntelDeliveryEnabled(): Observable<boolean> {
    return this.acService.isGranted([ManageIntelDelivery()])
  }
}
