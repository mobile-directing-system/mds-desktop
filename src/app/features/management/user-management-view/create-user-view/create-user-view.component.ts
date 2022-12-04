import { Component } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/model/user';

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
              private router: Router) {
  };

  createUser(): void {
    const username = this.form.value.username;
    if (username === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'username control is not set');
    }
    const firstName = this.form.value.firstName;
    if (firstName === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'first name control is not set');
    }
    const lastName = this.form.value.lastName;
    if (lastName === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'last name control is not set');
    }
    const pass = this.form.value.pass;
    if (pass === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'pass control is  not set');
    }
    const isAdmin = this.form.value.isAdmin;
    if (isAdmin === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'isAdmin control is not set');
    }
    this.userService.createUser({
      username: username,
      firstName: firstName,
      lastName: lastName,
      initialPass: pass,
      isAdmin: isAdmin,
    }).subscribe({
      next: (newUser: User): void => {
        if (!newUser) {
          this.notificationService.notifyUninvasiveShort($localize`User creation failed.`);
          return;
        }
        this.cancel();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`User creation failed.`);
      },
    });
  }

  cancel() {
    this.router.navigate(['..']).then();
  }
}
