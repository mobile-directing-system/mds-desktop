import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { PermissionService } from './permission.service';
import { BehaviorSubject, combineLatest, filter, Observable, of, switchMap } from 'rxjs';
import { Permission, PermissionMatcher } from '../permissions/permissions';
import { map } from 'rxjs/operators';
import { MDSError, MDSErrorCode } from '../util/errors';

/**
 * Service for checking whether the user is granted access by using permission matchers.
 */
@Injectable({
  providedIn: 'root',
})
export class AccessControlService {
  private isAdmin = new BehaviorSubject<boolean | undefined>(undefined);
  private granted = new BehaviorSubject<Permission[] | undefined>(undefined);

  constructor(private authService: AuthService, private userService: UserService,
              private permissionService: PermissionService) {
    this.authService.userChange().pipe(
      switchMap((userId: string | undefined) => {
        return combineLatest({
          isAdmin: userId !== undefined ? this.userService.getUserById(userId).pipe(map(u => u.isAdmin)) : of(false),
          granted: userId !== undefined ? this.permissionService.getPermissionsByUser(userId) : of(undefined),
        });
      }),
    ).subscribe(result => {
      this.isAdmin.next(result.isAdmin);
      this.granted.next(result.granted);
    });
  }

  /**
   * Returns true when the given permissions are granted. Keep in mind that the observable does _not_ complete!
   * @param requiredPermissions The permission matchers to check granted permissions against.
   */
  isGranted(requiredPermissions: PermissionMatcher[]): Observable<boolean> {
    return this.authService.userChange().pipe(
      switchMap(loggedInUser => {
        if (loggedInUser === undefined) {
          return of(false);
        }
        return combineLatest({
          isAdmin: this.isAdmin.pipe(filter(isAdmin => isAdmin !== undefined)),
          granted: this.granted.pipe(filter(granted => granted !== undefined)),
        }).pipe(map(result => {
            if (result.isAdmin === undefined) {
              throw new MDSError(MDSErrorCode.AppError, 'is-admin undefined although should be filtered');
            }
            if (result.granted === undefined) {
              throw new MDSError(MDSErrorCode.AppError, 'granted undefined although should be filtered');
            }
            return AccessControlService.permissionsOK(requiredPermissions, result.isAdmin, result.granted);
          }),
        );
      }),
    );
  }

  /**
   * Performs the actual matching for the given {@link PermissionMatcher} list and granted {@link Permission}s.
   * @param requiredPermissions List of required permissions.
   * @param isAdmin Whether the user is admin. This will always return `true`.
   * @param granted List of granted permissions.
   * @private
   */
  static permissionsOK(requiredPermissions: PermissionMatcher[], isAdmin: boolean, granted: Permission[]): boolean {
    if (isAdmin) {
      return true;
    }
    if (requiredPermissions.length === 0) {
      return true;
    }
    // Check matchers.
    return !requiredPermissions.some(matcher => !matcher(granted));
  }
}
