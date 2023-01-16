import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormBuilder, Validators } from '@angular/forms';
import { combineLatest, Observable, Subscription, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { ViewPermissionsPermission } from '../../../../core/permissions/permissions';
import {
  SetUserActiveStatePermission,
  SetUserAdminPermission,
  UpdateUserPassPermission,
  UpdateUserPermission,
} from '../../../../core/permissions/users';
import { AccessControlService } from '../../../../core/services/access-control.service';

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
  loader = new Loader();

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
              private acService: AccessControlService, private router: Router, private route: ActivatedRoute) {
    this.form.disable();
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    // Get id of current user from router path.
    this.s.push(this.route.params.pipe(
      switchMap(params => {
        this.id = params['userId'];
        this.form.disable();
        return combineLatest({
          user: this.loader.load(this.userService.getUserById(this.id)),
          isUpdateGranted: this.acService.isGranted([UpdateUserPermission()]),
          isSetAdminGranted: this.acService.isGranted([SetUserAdminPermission()]),
          isSetActiveStateGranted: this.acService.isGranted([SetUserActiveStatePermission()]),
        });
      }),
      tap(result => {
        this.form.patchValue({
          username: result.user.username,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          isAdmin: result.user.isAdmin,
          isActive: result.user.isActive,
        });
        if (!result.isUpdateGranted) {
          // Keep everything disabled.
          return;
        }
        this.form.enable();
        if (!result.isSetAdminGranted) {
          this.form.controls.isAdmin.disable();
        }
        if (!result.isSetActiveStateGranted) {
          this.form.controls.isActive.disable();
        }
      }),
    ).subscribe());
  }

  updateUser(): void {
    const v = this.form.getRawValue();
    this.loader.load(this.userService.updateUser({
      id: this.id,
      username: v.username,
      firstName: v.firstName,
      lastName: v.lastName,
      isAdmin: v.isAdmin,
      isActive: v.isActive,
    })).subscribe({
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

  /**
   * Navigates to the permissions-view for the user for checking and setting permissions.
   */
  navigateToPermissions(): void {
    this.router.navigate(['permissions'], { relativeTo: this.route }).then();
  }

  /**
   * True when updating user passwords is granted.
   */
  isUpdatePassGranted(): Observable<boolean> {
    return this.acService.isGranted([UpdateUserPassPermission()]);
  }

  /**
   * True when viewing permissions is granted.
   */
  isViewPermissionsGranted(): Observable<boolean> {
    return this.acService.isGranted([ViewPermissionsPermission()]);
  }
}
