import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { GroupService } from '../../../../core/services/group.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, UserSort } from '../../../../core/services/user.service';
import { OperationService } from '../../../../core/services/operation.service';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';
import { forkJoin, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { User } from '../../../../core/model/user';
import { Operation } from '../../../../core/model/operation';
import { SearchResult, sortStrings } from '../../../../core/util/store';
import { map } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-edit-group-view',
  templateUrl: './edit-group-view.component.html',
  styleUrls: ['./edit-group-view.component.scss'],
})
export class EditGroupView implements OnInit, OnDestroy {

  updatingGroup = new Loader();

  /**
   * Id of the currently loaded group.
   */
  groupId = '';

  private s: Subscription[] = [];

  columnsToDisplayForMemberTable = ['lastName', 'firstName', 'username', 'props', 'remove'];

  /**
   * Contains user data of the current group members.
   */
  groupMembers: User [] = [];

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.route.params.pipe(
      // Get group with the id within the route.
      switchMap(params => {
        this.groupId = params['groupId'];
        this.groupMembers = [];
        return this.updatingGroup.load(this.groupService.getGroupById(this.groupId));
      }),
      // Patch the form values.
      tap((currentGroup) => {
        this.form.patchValue({
          title: currentGroup.title,
          description: currentGroup.description,
          operation: currentGroup.operation,
          members: currentGroup.members,
        });
      }),
      // Retrieve the user-data for all members.
      switchMap(currentGroup => forkJoin(currentGroup.members.map(memberId => this.updatingGroup.load(this.userService.getUserById(memberId))))),
      // Add the users to the members array.
      tap(currentGroupMembers => {
        this.groupMembers = currentGroupMembers;
      }),
    ).subscribe());

    // Push value-change-subscription for memberIds.
    this.s.push(
      // Whenever members in form changes retrieve the user-data for the ids within.
      this.form.controls.members.valueChanges.pipe(
        switchMap(members => {
          this.groupMembers = [];
          return forkJoin(members.map(memberId => this.updatingGroup.load(this.userService.getUserById(memberId))));
        }),
        tap(currentGroupMembers => {
          this.groupMembers = currentGroupMembers;
        }),
      ).subscribe());

    this.s.push(
      this.membersToAddForm.valueChanges.subscribe(() => {
          this.form.controls.operation.updateValueAndValidity();
        },
      ),
    );
    this.s.push(
      this.form.controls.members.valueChanges.subscribe(() => {
          this.form.controls.operation.updateValueAndValidity();
        },
      ),
    );
  }

  form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control<string>('', [Validators.required]),
    description: this.fb.nonNullable.control<string>(''),
    operation: this.fb.control<string | undefined>(undefined, [], [
      this.groupMembersMustBeOperationMemberValidator(),
      this.groupMembersToAddMustBeOperationMemberValidator(),
    ]),
    members: this.fb.nonNullable.control<string[]>([]),
  });

  membersToAddForm = this.fb.nonNullable.control<string[]>([]);

  constructor(private groupService: GroupService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute, private userService: UserService, private operationService: OperationService) {
  };

  updateGroup(): void {
    const title = this.form.value.title;
    if (title === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'title control is not set.');
    }
    const description = this.form.value.description;
    if (description === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'description control is not set.');
    }
    const operation = this.form.value.operation;
    if (operation === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'operation control is not set.');
    }
    const members = this.form.value.members;
    if (members === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'members control is not set.');
    }
    this.groupService.updateGroup({
      id: this.groupId,
      title: title,
      description: description,
      operation: operation === null ? undefined : operation,
      members: members,
    }).subscribe({
      next: _ => {
        this.close();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Updating group failed.`);
      },
    });
  }

  getUserById(id: string): Observable<User> {
    return this.userService.getUserById(id);
  }

  getOperationById(id: string): Observable<Operation> {
    return this.operationService.getOperationById(id);
  }

  /**
   * Searches {@link Operation}s with the given params and returns the first five hits.
   * @param query The search query.
   */
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

  /**
   * Searches {@link User}s with the given params and returns the first five hits.
   * There five more users retrieved than there are elements in the members list to make sure that the shown hits do not
   * include users that are not already member of the group.
   * @param query The search query.
   */
  searchUsers(query: string): Observable<User[]> {
    let searchLimit = this.groupMembers.length + 5;
    return this.userService.searchUsers({
      query: query,
      limit: searchLimit,
      offset: 0,
    }, false).pipe(
      map((res: SearchResult<User>): User[] => {
        return res.hits;
      }),
      map(hits => {
        let currentMemberIds = this.groupMembers.map(member => member.id);
        //Filter members to add form to only contain ids, that are not already part of members.
        let membersToAdd = hits.filter(function(hit) {
          return !currentMemberIds.includes(hit.id);
        });
        return membersToAdd.splice(0, 5);
      }),
    );
  }

  asUser(entity: User): User {
    return entity as User;
  }

  asOperation(entity: Operation): Operation {
    return entity as Operation;
  }

  /**
   * Navigates to the previous page.
   */
  close() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
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
    let currentMemberIds = this.groupMembers.map(member => member.id);
    //Filter members to add form to only contain ids, that are not already part of members.
    let memberIdsToAdd = this.membersToAddForm.value.filter(function(memberId) {
      return !currentMemberIds.includes(memberId);
    });
    this.s.push(forkJoin(memberIdsToAdd.map(memberId => this.userService.getUserById(memberId))).subscribe(membersToAdd => {
      this.groupMembers = [...membersToAdd, ...this.groupMembers];
      this.form.controls.members.value.push(...memberIdsToAdd);
    }));
    this.membersToAddForm.patchValue([]);
  }

  private static mapMembersOrderBy(s: string): UserSort | undefined {
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
   * Called when sort for table containing members changes.
   * @param sort New sort.
   */
  memberSortChange(sort: Sort): void {
    let sortedMembers = this.groupMembers.map(x => x);
    switch (EditGroupView.mapMembersOrderBy(sort.active)) {
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
    this.groupMembers = sortedMembers;
  }

  /**
   * Validates whether the group members are also members of the selected operation.
   */
  groupMembersMustBeOperationMemberValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // Validate if Form already initialized.
      if (!this.form?.controls) {
        return of(null);
      }
      const groupMemberIds = this.form.controls.members.getRawValue();
      if (!control.value) {
        return of(null);
      }
      return this.operationService.getOperationMembers(control.value).pipe(
        map((operationMembers: User[]) => {
          return operationMembers.map(operationMember => operationMember.id);
        }),
        map(operationMemberIds => {
          return this.validateNoSameValuesInBothArrays(groupMemberIds, operationMemberIds) ? { groupMembersNotPartOfOperation: true } : null;
        }),
      );
    };
  }

  /**
   * Validates whether the members to be added are also members of the selected operation.
   */
  groupMembersToAddMustBeOperationMemberValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!this.form?.controls) {
        return of(null);
      }
      const groupMembersToAddIds = this.membersToAddForm.getRawValue();
      if (!control.value) {
        return of(null);
      }
      return this.operationService.getOperationMembers(control.value).pipe(
        map((operationMembers: User[]) => {
          return operationMembers.map(operationMember => operationMember.id);
        }),
        map(operationMemberIds => {
          return this.validateNoSameValuesInBothArrays(groupMembersToAddIds, operationMemberIds) ? { groupMembersNotPartOfOperation: true } : null;
        }),
      );
    };
  }

  /**
   * Validates whether there are any values in the first array, that are not also in second array.
   * @param arrA The array that is supposed to contain no values of the second array.
   * @param arrB The array that contains all allowed values for the first array.
   */
  validateNoSameValuesInBothArrays(arrA: string[], arrB: string[]): boolean {
    let filteredArr = arrA.filter(function(groupMemberId: string) {
      return !arrB.includes(groupMemberId);
    });
    return filteredArr.length > 0;
  }
}
