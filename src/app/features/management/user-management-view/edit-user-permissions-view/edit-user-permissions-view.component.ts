import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { User } from '../../../../core/model/user';
import { combineLatest, Subscription, switchMap, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Permission, PermissionName, UpdatePermissionPermission } from '../../../../core/permissions/permissions';
import { getEnumKeyByValue } from '../../../../core/util/misc';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';
import { AccessControlService } from '../../../../core/services/access-control.service';

/**
 * View for editing permissions of a user.
 */
@Component({
  selector: 'app-edit-user-permissions-view',
  templateUrl: './edit-user-permissions-view.component.html',
  styleUrls: ['./edit-user-permissions-view.component.scss'],
})
export class EditUserPermissionsView implements OnInit, OnDestroy {
  readonly PermissionName = PermissionName;
  loader: Loader = new Loader();
  /**
   * The user, permissions are being edited for.
   */
  user?: User;
  /**
   * The form with form controls mapped by {@link PermissionName}.
   */
  form?: FormGroup<{ [key: string]: FormControl<Permission | null> }>;

  private s: Subscription[] = [];

  constructor(private userService: UserService, private permissionService: PermissionService, private acService: AccessControlService,
              private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // Load user details and granted permissions on param changes.
    this.s.push(this.route.params.pipe(
      switchMap(params => {
        const userId = params['userId'];
        return this.loader.load(combineLatest({
          // Retrieve user details.
          user: this.userService.getUserById(userId),
          // Retrieve user permissions.
          permissions: this.permissionService.getPermissionsByUser(userId),
          isUpdateGranted: this.acService.isGranted([UpdatePermissionPermission()]).pipe(take(1)),
        }));
      }),
    ).subscribe(result => {
      this.user = result.user;
      // Build empty form.
      const formControls: { [key: string]: FormControl<Permission | null> } = {};
      const genFormControl = () => this.fb.control<Permission | null>(null);
      Object.values(PermissionName).forEach(permissionName => {
        formControls[permissionName] = genFormControl();
      });
      // Apply granted permissions for user.
      result.permissions.forEach(granted => {
        const grantedName = getEnumKeyByValue(PermissionName, granted.name);
        if (grantedName === null) {
          // Unsupported permission -> log warning but keep in order to not lose on update.
          console.warn(`unsupported permission: ${ granted.name }`);
          formControls[granted.name] = genFormControl();
          formControls[granted.name].setValue(granted);
          return;
        }
        formControls[PermissionName[grantedName]]?.setValue(granted);
      });
      // Create final form.
      this.form = this.fb.group(formControls);
      if (!result.isUpdateGranted) {
        this.form.disable();
      }
    }));
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  /**
   * Builds the final new permissions from {@link form} and updates via {@link PermissionService.setPermissionsForUser}.
   */
  save(): void {
    if (!this.user) {
      throw new MDSError(MDSErrorCode.AppError, 'user not set');
    }
    if (!this.form) {
      throw new MDSError(MDSErrorCode.AppError, 'form not set');
    }
    const newPermissions: Permission[] = [];
    Object.values(this.form.value).forEach(p => {
      if (p === null || p === undefined) {
        return;
      }
      newPermissions.push(p);
    });
    this.loader.load(this.permissionService.setPermissionsForUser(this.user.id, newPermissions))
      .subscribe(() => this.close());
  }

  close(): void {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }
}
