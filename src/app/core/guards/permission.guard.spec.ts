import { PermissionGuard, PermissionGuardedRouteData } from './permission.guard';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { AccessControlService } from '../services/access-control.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateUserPermission, ViewUserPermission } from '../permissions/users';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';

describe('PermissionGuard', () => {
  let spectator: SpectatorService<PermissionGuard>;
  let service: PermissionGuard;
  const createService = createServiceFactory({
    service: PermissionGuard,
    imports: [RouterTestingModule],
    mocks: [AccessControlService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    let routeData: PermissionGuardedRouteData;
    const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    let routerState: RouterStateSnapshot;

    beforeEach(() => {
      routeData = {
        requirePermissions: [ViewUserPermission(), CreateUserPermission()],
      };
      route.data = routeData;
      spectator.inject(AccessControlService).isGranted.and.returnValue(of(true));
    });

    it('should return true when no required permissions are set', async () => {
      routeData.requirePermissions = undefined;
      const canActivate = await firstValueFrom(service.canActivate(route, routerState));
      expect(canActivate).toBeTrue();
    });

    it('should call access control service for retrieving granted permissions', async () => {
      spectator.inject(AccessControlService).isGranted.calls.reset();
      await firstValueFrom(service.canActivate(route, routerState));
      expect(spectator.inject(AccessControlService).isGranted).toHaveBeenCalledOnceWith(routeData.requirePermissions);
    });

    it('should return redirect when access is not granted', async () => {
      spectator.inject(AccessControlService).isGranted.and.returnValue(of(false));
      const canActivate = await firstValueFrom(service.canActivate(route, routerState));
      expect(canActivate).toEqual(spectator.inject(Router).parseUrl('/missing-permissions'));
    });

    describe('canActivateChild', () => {
      it('should use canActivate for evaluation', () => {
        const canActivateSpy = spyOn(service, 'canActivate');
        service.canActivateChild(route, routerState);
        expect(canActivateSpy).toHaveBeenCalledOnceWith(route, routerState);
      });
    });
  });
});
