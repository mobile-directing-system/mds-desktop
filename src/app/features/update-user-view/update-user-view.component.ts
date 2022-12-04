import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../core/util/loader';
import { NotificationService } from '../../core/services/notification.service';
import { FormBuilder } from '@angular/forms';
import { MDSError, MDSErrorCode } from '../../core/util/errors';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/model/user';

/**
 *  View for updating a user.
 */
@Component({
  selector: 'app-update-user-view',
  templateUrl: './update-user-view.component.html',
  styleUrls: ['./update-user-view.component.scss'],
})
export class UpdateUserView implements OnInit, OnDestroy {

  /**
   * Loader for when updating a user and awaiting the response.
   */
  updatingUser = new Loader();

  form = this.fb.nonNullable.group({
    username: this.fb.nonNullable.control<string>(''),
    first_name: this.fb.nonNullable.control<string>(''),
    last_name: this.fb.nonNullable.control<string>(''),
    is_admin: this.fb.nonNullable.control<boolean>(false),
    is_active: this.fb.nonNullable.control<boolean>(true),
  });

  private s: Subscription[] = [];

  allowCreation = false;

  id = '';

  constructor(private userService: UserService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    // Get id of current user from router path.
    this.id = this.route.snapshot.params['id'];
    // set form default values to values of current user.
    this.s.push(this.userService.getUserById(this.id).subscribe(u => {
      this.form.patchValue({
        username: u.username,
        first_name: u.firstName,
        last_name: u.lastName,
        is_admin: u.isAdmin,
        is_active: u.isActive,
      });
    }));

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
    }));
  }

  updateUser(): void {
    const username = this.form.value.username;
    if (username === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'username is not set');
    }
    const is_active = this.form.value.is_active;
    if (is_active === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'is_active is not set');
    }
    const first_name = this.form.value.first_name;
    if (first_name === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'first_name is not set');
    }
    const last_name = this.form.value.last_name;
    if (last_name === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'last_name is not set');
    }
    const isAdmin = this.form.value.is_admin;
    if (isAdmin === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'isAdmin is not set');
    }
    this.updatingUser.load(this.userService.updateUser({
      id: this.id,
      username: username,
      firstName: first_name,
      lastName: last_name,
      isAdmin: isAdmin,
      isActive: is_active,
    })).subscribe({
      next: _ => {
        this.router.navigate(['/']).then();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Updating user failed.`);
      },
    });
  }
}
