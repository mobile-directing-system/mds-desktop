import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';

/**
 *  View for updating a user.
 */
@Component({
  selector: 'app-edit-user-view',
  templateUrl: './edit-user-view.component.html',
  styleUrls: ['./edit-user-view.component.scss'],
})
export class EditUserView implements OnInit, OnDestroy {

  /**
   * Loader for when updating a user and awaiting the response.
   */
  updatingUser = new Loader();

  form = this.fb.nonNullable.group({
    username: this.fb.nonNullable.control<string>('', [Validators.required]),
    firstName: this.fb.nonNullable.control<string>('', [Validators.required]),
    lastName: this.fb.nonNullable.control<string>('', [Validators.required]),
    isAdmin: this.fb.nonNullable.control<boolean>(false),
    isActive: this.fb.nonNullable.control<boolean>(true),
  });

  private s: Subscription[] = [];
  id = '';

  constructor(private userService: UserService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute) {
    this.updatingUser.bindFormGroup(this.form);
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    // Get id of current user from router path.
    this.s.push(this.route.params.subscribe(params => {
      this.id = params['userId'];
      this.updatingUser.load(this.userService.getUserById(this.id)).subscribe(u => {
        this.form.patchValue({
          username: u.username,
          firstName: u.firstName,
          lastName: u.lastName,
          isAdmin: u.isAdmin,
          isActive: u.isActive,
        });
      });
    }));
  }

  updateUser(): void {
    const username = this.form.value.username;
    if (username === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'username-control is not set');
    }
    const isActive = this.form.value.isActive;
    if (isActive === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'is-active-control is not set');
    }
    const firstName = this.form.value.firstName;
    if (firstName === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'first-name-control is not set');
    }
    const lastName = this.form.value.lastName;
    if (lastName === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'last-name-control is not set');
    }
    const isAdmin = this.form.value.isAdmin;
    if (isAdmin === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'is-admin-control is not set');
    }
    this.userService.updateUser({
      id: this.id,
      username: username,
      firstName: firstName,
      lastName: lastName,
      isAdmin: isAdmin,
      isActive: isActive,
    }).subscribe({
      next: _ => {
        this.close();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Updating user failed.`);
      },
    });
  }

  close() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }

  changePassword() {
    this.router.navigate(['update-pass'], { relativeTo: this.route }).then();
  }
}
