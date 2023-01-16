import { EditUserPermissionsView } from './edit-user-permissions-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { FeaturesModule } from '../../../features.module';
import { UserService } from '../../../../core/services/user.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { User } from '../../../../core/model/user';
import { Permission, PermissionName } from '../../../../core/permissions/permissions';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CoreModule } from '../../../../core/core.module';
import { AccessControlService } from '../../../../core/services/access-control.service';
import { AccessControlMockService } from '../../../../core/services/access-control-mock.service';
import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;
import anything = jasmine.anything;

function genFactoryOptions(): SpectatorRoutingOptions<EditUserPermissionsView> {
  return {
    component: EditUserPermissionsView,
    imports: [FeaturesModule, CoreModule],
    mocks: [
      UserService,
      PermissionService,
    ],
    providers: [
      {
        provide: AccessControlService,
        useExisting: AccessControlMockService,
      },
    ],
    detectChanges: false,
  };
}

describe('EditUserPermissionsView', () => {
  let spectator: SpectatorRouting<EditUserPermissionsView>;
  let component: EditUserPermissionsView;
  const createComponent = createRoutingFactory({
    ...genFactoryOptions(),
  });
  let user: User;
  let granted: Permission[];
  const allPermissions: Permission[] = [
    { name: PermissionName.ViewPermissions },
    { name: PermissionName.UpdatePermissions },
  ];

  beforeEach(fakeAsync(async () => {
    user = {
      id: 'popular',
      username: 'sea',
      lastName: 'split',
      firstName: 'paw',
      isAdmin: false,
      isActive: true,
    };
    granted = [
      { name: PermissionName.InvalidateIntel },
      { name: PermissionName.CreateUser },
    ];

    spectator = createComponent({
      params: {
        userId: user.id,
      },
    });
    component = spectator.component;

    spectator.inject(UserService).getUserById.and.returnValue(of(user));
    spectator.inject(PermissionService).getPermissionsByUser.and.returnValue(of(granted));
    spectator.detectChanges();
    tick();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user', fakeAsync(() => {
    expect(spectator.inject(UserService).getUserById).toHaveBeenCalledWith(user.id);
    expect(component.user).toEqual(user);
  }));

  it('should load permissions', fakeAsync(() => {
    expect(spectator.inject(PermissionService).getPermissionsByUser).toHaveBeenCalledWith(user.id);
  }));

  it('should load user on user change', fakeAsync(() => {
    const newUser = {
      ...user,
      id: 'realize',
    };
    spectator.inject(UserService).getUserById.and.returnValue(of(newUser));
    spectator.setRouteParam('userId', newUser.id);

    tick();

    expect(spectator.inject(UserService).getUserById).toHaveBeenCalledWith(newUser.id);
    expect(component.user).toEqual(newUser);
  }));

  it('should load permissions on user change', fakeAsync(() => {
    const newUserId = 'realize';
    const newGranted: Permission[] = [
      { name: PermissionName.UpdatePermissions },
    ];

    spectator.inject(PermissionService).getPermissionsByUser.and.returnValue(of(newGranted));
    spectator.setRouteParam('userId', newUserId);

    tick();

    expect(spectator.inject(PermissionService).getPermissionsByUser).toHaveBeenCalledWith(newUserId);
  }));

  it('should create form group from permissions', () => {
    expect(component.form).toBeTruthy();
  });

  it('should include all permissions in form group', () => {
    Object.values(PermissionName).forEach(permissionName => {
      expect(component.form?.value[permissionName]).withContext(`for ${ permissionName }`).not.toBeUndefined();
    });
  });

  it('should warn about unsupported permission names', fakeAsync(() => {
    const newUserId = 'realize';
    const newGranted: Permission[] = [
      { name: 'z9302ej' },
    ];
    const warnSpy = spyOn(console, 'warn');

    spectator.inject(PermissionService).getPermissionsByUser.and.returnValue(of(newGranted));
    spectator.setRouteParam('userId', newUserId);

    tick();

    expect(warnSpy).toHaveBeenCalledTimes(1);
  }));

  describe('save', () => {
    let navigateSpy: Spy;

    beforeEach(() => {
      navigateSpy = createSpy().and.resolveTo();
      spectator.router.navigate = navigateSpy;
    });

    it('should throw an error when user is not set', () => {
      component.user = undefined;
      expect(() => component.save()).toThrow();
    });

    it('should throw an error when form is not set', () => {
      component.form = undefined;
      expect(() => component.save()).toThrow();
    });

    it('should update correctly', fakeAsync(() => {
      spectator.inject(PermissionService).setPermissionsForUser.and.returnValue(of(void 0));

      component.save();
      tick();

      expect(spectator.inject(PermissionService).setPermissionsForUser).toHaveBeenCalledOnceWith(user.id, granted);
    }));

    it('should navigate to parent page when updated', fakeAsync(() => {
      spectator.inject(PermissionService).setPermissionsForUser.and.returnValue(of(void 0));

      component.save();
      tick();

      expect(navigateSpy).toHaveBeenCalledOnceWith(['..'], { relativeTo: spectator.activatedRouteStub });
    }));

    it('should not loose unsupported permissions on update', fakeAsync(async () => {
      const newUserId = 'realize';
      const newGranted: Permission[] = [
        { name: PermissionName.UpdateUser },
        { name: 'z9302ej' },
      ];
      spyOn(console, 'warn');
      spectator.inject(PermissionService).setPermissionsForUser.and.returnValue(of(void 0));
      spectator.inject(PermissionService).getPermissionsByUser.and.returnValue(of(newGranted));
      spectator.setRouteParam('userId', newUserId);
      tick();

      component.save();
      tick();

      expect(spectator.inject(PermissionService).setPermissionsForUser).toHaveBeenCalledOnceWith(anything(), newGranted);
    }));
  });

  it('should disable form when missing permissions', fakeAsync(() => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions.filter(p => p.name !== PermissionName.UpdatePermissions));
    spectator.setRouteParam('', '')
    tick();
    expect(component.form?.disabled).toBeTrue();
  }));

  describe('fixture', () => {
    beforeEach(async () => {
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
    })

    it('should display an informational notice for admin users', async () => {
      component.user = {
        ...user,
        isAdmin: true,
      };

      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(spectator.query(byTextContent('This user is an admin', {
        exact: false,
        selector: 'mat-card',
      }))).toBeVisible();
    });

    it('should display controls for all permissions', () => {
      Object.values(PermissionName).forEach(permissionName => {
        const selector = `app-simple-permission-control[ng-reflect-permission-name="${ permissionName.substring(0, 30) }"]`;
        expect(spectator.fixture.debugElement.query(By.css(selector)))
          .withContext(`for ${ permissionName } (selector ${ selector })`).toBeVisible();
      });
    });

    it('should close when close-button is clicked', () => {
      const closeSpy = spyOn(component, 'close');
      spectator.click(byTextContent('Close', { selector: 'button' }));
      expect(closeSpy).toHaveBeenCalledOnceWith();
    });

    it('should save when save-button is clicked', () => {
      const saveSpy = spyOn(component, 'save');
      spectator.click(byTextContent('Save', { selector: 'button' }));
      expect(saveSpy).toHaveBeenCalledOnceWith();
    });
  });
});
