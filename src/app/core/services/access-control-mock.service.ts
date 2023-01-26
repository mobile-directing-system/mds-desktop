import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Permission, PermissionMatcher } from '../permissions/permissions';
import { map } from 'rxjs/operators';
import { AccessControlService } from './access-control.service';

/**
 * Service for mocking {@link AccessControlService} in tests.
 */
@Injectable({
  providedIn: 'root',
})
export class AccessControlMockService {
  private isAdmin = new BehaviorSubject<boolean>(true);
  private granted = new BehaviorSubject<Permission[]>([]);

  isGranted(requiredPermissions: PermissionMatcher[]): Observable<boolean> {
    return combineLatest({
      isAdmin: this.isAdmin,
      granted: this.granted,
    }).pipe(map(result => {
        return AccessControlService.permissionsOK(requiredPermissions, result.isAdmin, result.granted);
      }),
    );
  }

  /**
   * Unsets the admin-flag and grants the given permissions, overwriting previously granted ones.
   * @param granted New granted permissions.
   */
  setNoAdminAndGranted(granted: Permission[]) {
    this.isAdmin.next(false);
    this.granted.next(granted);
  }
}
