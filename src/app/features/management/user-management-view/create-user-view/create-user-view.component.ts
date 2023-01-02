import { Component } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';

/**
 * View for creating a new user.
 */
@Component({
  selector: 'app-create-user-view',
  templateUrl: './create-user-view.component.html',
  styleUrls: ['./create-user-view.component.scss'],
})
export class CreateUserView {

  /**
   * Loader for when creating a new user and awaiting the response.
   */
  creatingUser = new Loader();

  form = this.fb.nonNullable.group({
    username: this.fb.nonNullable.control<string>('', [Validators.required]),
    firstName: this.fb.nonNullable.control<string>('', [Validators.required]),
    lastName: this.fb.nonNullable.control<string>('', [Validators.required]),
    isAdmin: this.fb.nonNullable.control<boolean>(false),
    pass: this.fb.nonNullable.control<string>('', [Validators.required]),
  });

  constructor(private userService: UserService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute) {
  }

  createUser(): void {
    const username = this.form.value.username;
    if (username === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'username-control is not set');
    }
    const firstName = this.form.value.firstName;
    if (firstName === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'first-name-control is not set');
    }
    const lastName = this.form.value.lastName;
    if (lastName === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'last-name-control is not set');
    }
    const pass = this.form.value.pass;
    if (pass === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'pass-control is  not set');
    }
    const isAdmin = this.form.value.isAdmin;
    if (isAdmin === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'is-admin-control is not set');
    }
    this.creatingUser.load(this.userService.createUser({
      username: username,
      firstName: firstName,
      lastName: lastName,
      initialPass: pass,
      isAdmin: isAdmin,
    })).subscribe({
      next: _ => {
        this.notificationService.notifyUninvasiveShort($localize`User created successfully.`);
        this.close();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`User creation failed.`);
      },
    });
  }

  close() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }
}
