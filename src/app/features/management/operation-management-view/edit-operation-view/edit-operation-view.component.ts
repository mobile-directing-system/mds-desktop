import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { forkJoin, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationService } from '../../../../core/services/operation.service';
import { User } from '../../../../core/model/user';
import { Sort } from '@angular/material/sort';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';
import { UserService, UserSort } from '../../../../core/services/user.service';
import { OrderDir, orderDirFromSort, SearchResult } from '../../../../core/util/store';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-edit-operation-view',
  templateUrl: './edit-operation-view.component.html',
  styleUrls: ['./edit-operation-view.component.scss'],
})
export class EditOperationViewComponent implements OnInit, OnDestroy {

  updatingOperation = new Loader();
  showMemberSelection = false;

  currentStartDate: Date = new Date();
  retrieving = new Loader();
  private s: Subscription[] = [];
  operationId = '';
  members: User[] = [];
  columnsToDisplay = ['lastName', 'firstName', 'username', 'props'];


  form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control<string>('', [Validators.required]),
    description: this.fb.nonNullable.control<string>('', [Validators.required]),
    start: this.fb.nonNullable.control<Date>(new Date(), [Validators.required]),
    end: this.fb.nonNullable.control<Date | undefined>(undefined, [this.validateEndDate()]),
    isArchived: this.fb.nonNullable.control<boolean>(false, [Validators.required]),
    members: this.fb.nonNullable.control<string[]>([]),
  });

  constructor(private operationService: OperationService, private userService: UserService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute) {
    this.updatingOperation.bindFormGroup(this.form);
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.route.params.pipe(
      switchMap(params => {
        this.operationId = params['operationId'];
        return this.operationService.getOperationById(this.operationId);
      }),
      tap(operation => {
        this.form.patchValue({
          title: operation.title,
          description: operation.description,
          isArchived: operation.is_archived,
        });
        let operationStart = new Date(operation.start);
        this.currentStartDate = operationStart;
        this.form.controls.start.patchValue(operationStart);
        if (operation.end) {
          let operationEnd = new Date(operation!.end);
          this.form.controls.end.patchValue(operationEnd);
        }
      })).subscribe());
    this.s.push(this.operationService.getOperationMembers(this.operationId).pipe(
      tap(members => {
        this.members = [];
        this.members = members;
      }),
      map(members => {
        this.form.controls.members.patchValue(members.map(member => member.id));
      }),
    ).subscribe());
    this.s.push(
      this.form.controls.members.valueChanges.pipe(
        switchMap(members => {
          this.members = [];
          return forkJoin(members.map(memberId => this.userService.getUserById(memberId)));
        }),
        tap(currentGroupMembers => {
          this.members = currentGroupMembers;
        }),
      ).subscribe());
    this.s.push(this.form.controls.start.valueChanges.pipe(tap(newStartDate => {
      this.currentStartDate = newStartDate;
    })).subscribe());
  }

  updateOperation(): void {
    const title = this.form.value.title;
    if (title === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'title-control is not set');
    }
    const description = this.form.value.description;
    if (description === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'description-control is not set');
    }
    const start = this.form.value.start;
    if (start === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'start-control is not set');
    }
    const end = this.form.value.end;
    if (end === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'end-control is  not set');
    }
    const isArchived = this.form.value.isArchived;
    if (isArchived === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'isArchived-control is not set');
    }
    this.updatingOperation.load(this.operationService.updateOperation({
      id: this.operationId,
      title: title,
      description: description,
      start: start,
      end: end,
      is_archived: isArchived,
    }).pipe(
      switchMap(() => this.operationService.updateOperationMembers(this.operationId, this.form.controls.members.value)),
    )).subscribe({
      next: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Operation updated successfully.`);
        this.close();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Updating operation failed.`);
      },
    });
  }

  searchUser(query: string): Observable<User[]> {
    if (query === '') {
      return of([]);
    }
    return this.userService.searchUsers({
      query: query,
      limit: 5,
      offset: 0,
    }, true).pipe(
      map((res: SearchResult<User>): User[] => {
        return res.hits;
      }));
  }

  private static mapOrderBy(s: string): UserSort | undefined {
    switch (s) {
      case 'firstName':
        return UserSort.ByFirstName;
      case 'lastName':
        return UserSort.ByLastName;
      case 'username':
        return UserSort.ByUsername;
      case '':
        return undefined;
      default:
        throw new MDSError(MDSErrorCode.AppError, `unsupported order-by: ${ s }`);
    }
  }

  getUserById(userId: string): Observable<User> {
    return this.userService.getUserById(userId);
  }

  /**
   * Called when sort changes.
   * @param sort New sort.
   */
  sortChange(sort: Sort): void {
    let sortedMembers = this.members.map(x => x);
    switch (EditOperationViewComponent.mapOrderBy(sort.active)) {
      case UserSort.ByLastName:
        if (orderDirFromSort(sort) === OrderDir.Asc) {
          sortedMembers.sort((a, b) => a.lastName.localeCompare(b.lastName));
        } else {
          sortedMembers.sort((a, b) => b.lastName.localeCompare(a.lastName));
        }
        break;
      case UserSort.ByFirstName:
        if (orderDirFromSort(sort) === OrderDir.Asc) {
          sortedMembers.sort((a, b) => a.firstName.localeCompare(b.firstName));
        } else {
          sortedMembers.sort((a, b) => b.firstName.localeCompare(a.firstName));
        }
        break;
      case UserSort.ByUsername:
        if (orderDirFromSort(sort) === OrderDir.Asc) {
          sortedMembers.sort((a, b) => a.username.localeCompare(b.username));
        } else {
          sortedMembers.sort((a, b) => b.username.localeCompare(a.username));
        }
        break;
    }
    this.members = sortedMembers;
  }

  validateEndDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      if (control.value.getTime() > this.currentStartDate.getTime()) {
        return null;
      } else {
        return { isValidEndDate: true };
      }
    };
  }

  removeMember(memberId: string): void {
    this.form.controls.members.patchValue(this.form.controls.members.value.filter(item => item != memberId));
  }

  navigateToMembers(): void {
    this.router.navigate(['members'], { relativeTo: this.route }).then();
  }

  asUser(entity: User): User {
    return entity;
  }

  close(): void {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }
}
