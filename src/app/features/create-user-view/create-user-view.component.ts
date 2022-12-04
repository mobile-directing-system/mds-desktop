import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../core/util/loader';
import { NotificationService } from '../../core/services/notification.service';
import { FormBuilder } from '@angular/forms';
import { MDSError, MDSErrorCode } from '../../core/util/errors';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/model/user';

/**
 * View for creating a new user.
 */
@Component({
  selector: 'app-create-user-view',
  templateUrl: './create-user-view.component.html',
  styleUrls: ['./create-user-view.component.scss'],
})
export class CreateUserView implements OnInit, OnDestroy {

  /**
   * Loader for when creating a new user and awaiting the response.
   */
  creatingUser = new Loader();

  form = this.fb.nonNullable.group({
    username: this.fb.nonNullable.control<string>(''),
    first_name: this.fb.nonNullable.control<string>(''),
    last_name: this.fb.nonNullable.control<string>(''),
    is_admin: this.fb.nonNullable.control<boolean>(false),
    pass: this.fb.nonNullable.control<string>(''),
  });

  allowCreation = false;

  private s: Subscription[] = [];

  constructor(private userService: UserService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router) {
  };

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.form.valueChanges.subscribe(v => {
      if (!v.username) {
        this.allowCreation = false;
        return;
      }
      if (!v.first_name) {
        this.allowCreation = false;
        return;
      }
      if (!v.last_name) {
        this.allowCreation = false;
        return;
      }
      if (!v.pass) {
        this.allowCreation = false;
        return;
      }
    }));
  }

  createUser(): void {
    const username = this.form.value.username;
    if (username === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'username is not set');
    }
    const first_name = this.form.value.first_name;
    if (first_name === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'first_name is not set');
    }
    const last_name = this.form.value.last_name;
    if (last_name === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'last_name is not set');
    }
    const pass = this.form.value.pass;
    if (pass === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'pass is not set');
    }
    const isAdmin = this.form.value.is_admin;
    if (isAdmin === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'isAdmin is not set');
    }
    this.creatingUser.load(this.userService.createUser({
      username: username,
      firstName: first_name,
      lastName: last_name,
      initialPass: pass,
      isAdmin: isAdmin,
    })).subscribe({
      next: (newUser: User): void => {
        if (!newUser) {
          this.notificationService.notifyUninvasiveShort($localize`User creation failed.`);
          return;
        }
        this.router.navigate(['/']).then();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`User creation failed.`);
      },
    });
  }
}
