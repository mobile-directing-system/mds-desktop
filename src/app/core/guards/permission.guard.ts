import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Data, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PermissionMatcher } from '../permissions/permissions';
import { AccessControlService } from '../services/access-control.service';
import { map } from 'rxjs/operators';

/**
 * Route data with permissions for usage in {@link PermissionGuardedRoute.data}.
 */
export interface PermissionGuardedRouteData extends Data {
  requirePermissions?: PermissionMatcher[];
}

/**
 * Route for usage with {@link PermissionGuard} with {@link PermissionGuardedRouteData} as {@link Route.data}.
 */
export interface PermissionGuardedRoute extends Route {
  data?: PermissionGuardedRouteData;
  children?: PermissionGuardedRoute[];
}

/**
 * Guard for required permissions.
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionGuard  {
  private readonly redirectOnMissingPermission: UrlTree;

  constructor(private acService: AccessControlService, private router: Router) {
    this.redirectOnMissingPermission = this.router.parseUrl('/missing-permissions');
  }

  canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const data: PermissionGuardedRouteData | undefined = route.data;
    if (!data || !data.requirePermissions) {
      return of(true);
    }
    return this.acService.isGranted(data.requirePermissions).pipe(map(hasAccess => {
      if (hasAccess) {
        return true;
      }
      return this.redirectOnMissingPermission;
    }));
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
