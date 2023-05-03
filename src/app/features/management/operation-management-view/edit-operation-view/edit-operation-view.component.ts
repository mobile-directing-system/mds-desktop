import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { combineLatest, forkJoin, Observable, Subscription, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationService } from '../../../../core/services/operation.service';
import { User } from '../../../../core/model/user';
import { Sort } from '@angular/material/sort';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';
import { UserService, UserSort } from '../../../../core/services/user.service';
import { SearchResult, sortStrings } from '../../../../core/util/store';
import * as moment from 'moment';
import { UpdateOperationMembersPermission, UpdateOperationPermission } from '../../../../core/permissions/operations';
import { AccessControlService } from '../../../../core/services/access-control.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-edit-operation-view',
  templateUrl: './edit-operation-view.component.html',
  styleUrls: ['./edit-operation-view.component.scss'],
})
export class EditOperationViewComponent implements OnInit, OnDestroy {

  loader = new Loader();
  /**
   * Loader for when retrieving members of the operation.
   */
  retrieving = new Loader();

  private s: Subscription[] = [];
  /**
   * Id of the current operation.
   */
  operationId = '';
  /**
   * Contains user data of the current operation members.
   */
  operationMembers: User[] = [];

  columnsToDisplayForMemberTable = ['lastName', 'firstName', 'username', 'props', 'remove'];


  constructor(private operationService: OperationService, private userService: UserService,
              private notificationService: NotificationService, private fb: FormBuilder,
              private acService: AccessControlService, private router: Router, private route: ActivatedRoute) {
    this.form.disable();
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.route.params.pipe(
      // Get operation with the id from the current route.
      switchMap(params => {
        this.operationId = params['operationId'];
        this.form.disable();
        return this.loader.load(combineLatest({
          operation: this.operationService.getOperationById(this.operationId),
          operationMembers: this.operationService.getOperationMembers(this.operationId),
          isUpdateGranted: this.isUpdateGranted(),
        }));
      }),
      tap(result => {
        // Update form values.
        this.form.patchValue({
          title: result.operation.title,
          description: result.operation.description,
          isArchived: result.operation.isArchived,
        });
        let operationStart = new Date(result.operation.start);
        this.form.controls.start.patchValue(moment(operationStart));
        if (result.operation.end) {
          let operationEnd = new Date(result.operation.end);
          this.form.controls.end.patchValue(moment(operationEnd));
        }
        this.operationMembers = result.operationMembers;
        this.form.controls.members.patchValue(result.operationMembers.map(member => member.id));
        if (!result.isUpdateGranted) {
          // Keep everything disabled.
          return;
        }
        this.form.enable();
      })).subscribe());

    // When members changes also update the table.
    this.s.push(this.form.controls.members.valueChanges.pipe(
      switchMap(members => {
        this.operationMembers = [];
        return this.loader.load(forkJoin(members.map(memberId => this.userService.getUserById(memberId))));
      }),
      tap(retrievedMemberDetails => this.operationMembers = retrievedMemberDetails),
    ).subscribe());

    this.s.push(this.form.controls.start.valueChanges.pipe(tap(_ => {
      this.form.controls.end.updateValueAndValidity();
    })).subscribe());
  }

  form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control<string>('', [Validators.required]),
    description: this.fb.nonNullable.control<string>(''),
    start: this.fb.nonNullable.control<moment.Moment>(moment(), [Validators.required]),
    end: this.fb.control<moment.Moment | null>(null, [this.validateEndDate()]),
    isArchived: this.fb.nonNullable.control<boolean>(false, [Validators.required]),
    members: this.fb.nonNullable.control<string[]>([]),
  });
  membersToAddForm = this.fb.nonNullable.control<string[]>([]);

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
    this.loader.load(this.operationService.updateOperation({
      id: this.operationId,
      title: title,
      description: description,
      start: start.toDate(),
      end: end?.toDate(),
      isArchived: isArchived,
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

  /**
   * Searches {@link User}s with the given params and returns the first five hits.
   * There five more users retrieved than there are elements in the members list to make sure that the shown hits do not
   * include users, that are not already member of the operation.
   * @param query The search query.
   */
  searchUsers(query: string): Observable<User[]> {
    let searchLimit = this.operationMembers.length + 5;
    return this.userService.searchUsers({
      query: query,
      limit: searchLimit,
      offset: 0,
    }, false).pipe(
      map((res: SearchResult<User>): User[] => {
        return res.hits;
      }),
      map(hits => {
        let currentMemberIds = this.operationMembers.map(member => member.id);
        //Filter members to add form to only contain ids, that are not already part of members.
        let membersToAdd = hits.filter(function(hit) {
          return !currentMemberIds.includes(hit.id);
        });
        return membersToAdd.splice(0, 5);
      }),
    );
  }

  private static mapMembersOrderBy(s: string): UserSort | undefined {
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
   * Called when sort for table containing members changes.
   * @param sort New sort.
   */
  memberSortChange(sort: Sort): void {
    let sortedMembers = this.operationMembers.map(x => x);
    switch (EditOperationViewComponent.mapMembersOrderBy(sort.active)) {
      case UserSort.ByLastName:
        sortStrings(sortedMembers, sort, from => from.lastName);
        break;
      case UserSort.ByFirstName:
        sortStrings(sortedMembers, sort, from => from.firstName);
        break;
      case UserSort.ByUsername:
        sortStrings(sortedMembers, sort, from => from.username);
        break;
    }
    this.operationMembers = sortedMembers;
  }

  /**
   * Validates whether the selected end date is past the selected start date.
   */
  validateEndDate(): ValidatorFn {
    return (_: AbstractControl): ValidationErrors | null => {
      if (!this.form?.controls.end.getRawValue()) {
        return null;
      }
      if (this.form.controls.end.getRawValue()?.isAfter(this.form.controls.start.getRawValue())) {
        return null;
      } else {
        return { isValidEndDate: true };
      }
    };
  }

  /**
   * Removes the member with the given id.
   * @param memberId The id of the member to remove.
   */
  removeMember(memberId: string): void {
    this.form.controls.members.patchValue(this.form.controls.members.value.filter(item => item != memberId));
  }

  /**
   * Adds members form {@link SearchableMultiChipEntityInputComponent} to members list and resets the input of
   * membersToAdd.
   */
  addMembers() {
    let currentMemberIds = this.form.controls.members.getRawValue();
    // Filter members to add to the form control to only contain ids, that are not already part of members.
    let memberIdsToAdd = this.membersToAddForm.value.filter(memberId => !currentMemberIds.includes(memberId));
    this.s.push(this.loader.load(forkJoin(memberIdsToAdd.map(memberId => this.userService.getUserById(memberId))))
      .subscribe(membersToAdd => {
        this.operationMembers = [...membersToAdd, ...this.operationMembers];
        this.form.controls.members.setValue([...memberIdsToAdd, ...this.form.controls.members.getRawValue()]);
      }));
    this.membersToAddForm.patchValue([]);
  }

  asUser(entity: User): User {
    return entity;
  }

  /**
   * Navigates to the previous page.
   */
  close(): void {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }

  isUpdateGranted(): Observable<boolean> {
    return this.acService.isGranted([UpdateOperationPermission(), UpdateOperationMembersPermission()]);
  }
}
