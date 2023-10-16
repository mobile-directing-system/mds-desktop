import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { GroupService } from '../../../../core/services/group.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/model/user';
import { Observable, of, Subscription } from 'rxjs';
import { SearchResult } from '../../../../core/util/store';
import { Operation } from '../../../../core/model/operation';
import { OperationService } from '../../../../core/services/operation.service';
import { map } from 'rxjs/operators';

/**
 * View to create a group.
 */
@Component({
  selector: 'app-create-group-view',
  templateUrl: './create-group-view.component.html',
  styleUrls: ['./create-group-view.component.scss'],
})
export class CreateGroupView implements OnInit, OnDestroy {
  /**
   * Loader for when creating a new group and awaiting the response.
   */
  creatingGroup = new Loader();

  s: Subscription[] = [];

  form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control<string>('', [Validators.required]),
    description: this.fb.nonNullable.control<string>(''),
    operation: this.fb.nonNullable.control<string | null>(null, [], [this.groupMembersMustBeOperationMemberValidator()]),
    members: this.fb.nonNullable.control<string[]>([]),
  });

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.form.controls.members.valueChanges.subscribe(() => this.form.controls.operation.updateValueAndValidity()));
  };

  constructor(private groupService: GroupService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute, private userService: UserService, private operationService: OperationService) {
  }

  createGroup(): void {
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
    this.creatingGroup.load(this.groupService.createGroup({
      title: title,
      description: description,
      operation: operation ?? undefined,
      members: members,
    })).subscribe({
      next: _ => {
        this.cancel();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Role creation failed.`);
      },
    });
  }

  getUserById(id: string): Observable<User> {
    return this.userService.getUserById(id);
  }

  getOperationById(id: string): Observable<Operation> {
    return this.operationService.getOperationById(id);
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

  asUser(entity: User): User {
    return entity;
  }

  asOperation(entity: Operation): Operation {
    return entity;
  }

  cancel() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
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
