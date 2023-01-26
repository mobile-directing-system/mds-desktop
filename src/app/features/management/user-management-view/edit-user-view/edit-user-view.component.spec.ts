import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { NotificationService } from '../../../../core/services/notification.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { EditUserView } from './edit-user-view.component';
import { ManagementModule } from '../../management.module';
import { AccessControlService } from '../../../../core/services/access-control.service';
import { AccessControlMockService } from '../../../../core/services/access-control-mock.service';
import { PermissionName } from '../../../../core/permissions/permissions';
import { User } from '../../../../core/model/user';

function genFactoryOptions(): SpectatorRoutingOptions<EditUserView> {
  return {
    component: EditUserView,
    imports: [
      ManagementModule,
    ],
    providers: [
      {
        provide: AccessControlService,
        useExisting: AccessControlMockService,
      },
    ],
    mocks: [
      NotificationService,
      UserService,
    ],
    params: {
      userId: 'defend',
    },
    detectChanges: false,
  };
}

describe('EditUserView', () => {
  let spectator: SpectatorRouting<EditUserView>;
  let component: EditUserView;
  const createComponent = createRoutingFactory(genFactoryOptions());
  const id = 'defend';
  const username = 'child';
  const firstname = 'widen';
  const lastname = 'examine';
  const isAdmin = false;
  const isActive = true;
  const allPermissions = [
    { name: PermissionName.ViewUser },
    { name: PermissionName.UpdateUser },
    { name: PermissionName.UpdateUserPass },
    { name: PermissionName.SetUserAdmin },
    { name: PermissionName.SetUserActiveState },
  ];

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    const user: User = {
      id: id,
      username: username,
      firstName: firstname,
      lastName: lastname,
      isAdmin: isAdmin,
      isActive: isActive,
    };
    spectator.inject(UserService).getUserById.and.returnValue(of(user));
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.detectChanges();
  });

  it('should go to /users/ when click on close', fakeAsync(() => {
    spectator.click(byTextContent('Cancel', { selector: 'button' }));
    tick();
    expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['..'], { relativeTo: spectator.activatedRouteStub });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable form without update-permissions', fakeAsync(() => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions.filter(p => p.name != PermissionName.UpdateUser));
    spectator.setRouteParam('', '');
    tick();
    expect(component.form.disabled).toBeTrue();
  }));

  it('should disable is-admin-control without set-admin-permissions', fakeAsync(() => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions.filter(p => p.name != PermissionName.SetUserAdmin));
    spectator.setRouteParam('', '');
    tick();
    expect(component.form.controls.isAdmin.disabled).toBeTrue();
  }));

  it('should disable is-active-control without set-admin-permissions', fakeAsync(() => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions.filter(p => p.name != PermissionName.SetUserActiveState));
    spectator.setRouteParam('', '');
    tick();
    expect(component.form.controls.isActive.disabled).toBeTrue();
  }));

  it('should disable user update without username', fakeAsync(() => {
    component.form.setValue({
      username: '',
      firstName: firstname,
      lastName: lastname,
      isAdmin: isAdmin,
      isActive: isActive,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should disable user update without first name', fakeAsync(() => {
    component.form.setValue({
      username: username,
      firstName: '',
      lastName: lastname,
      isAdmin: isAdmin,
      isActive: isActive,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should disable user update without last name', fakeAsync(() => {
    component.form.setValue({
      username: username,
      firstName: firstname,
      lastName: '',
      isAdmin: isAdmin,
      isActive: isActive,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should allow user update with all values set', fakeAsync(async () => {
    component.form.setValue({
      username: username,
      firstName: firstname,
      lastName: lastname,
      isAdmin: isAdmin,
      isActive: isActive,
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    expect(component.form.valid).toBeTrue();
  }));

  describe('updateUser', () => {
    it('should fail without username', fakeAsync(() => {
      component.form.setValue({
        username: '',
        firstName: firstname,
        lastName: lastname,
        isAdmin: isAdmin,
        isActive: isActive,
      });
      tick();
      expect(component.updateUser).toThrowError();
    }));

    it('should fail without firstname', fakeAsync(() => {
      component.form.setValue({
        username: username,
        firstName: '',
        lastName: lastname,
        isAdmin: isAdmin,
        isActive: isActive,
      });
      tick();
      expect(component.updateUser).toThrowError();
    }));

    it('should fail without lastname', fakeAsync(() => {
      component.form.setValue({
        username: username,
        firstName: firstname,
        lastName: '',
        isAdmin: isAdmin,
        isActive: isActive,
      });
      tick();
      expect(component.updateUser).toThrowError();
    }));

    it('should update a user correctly', fakeAsync(() => {
      component.form.setValue({
        username: username,
        firstName: firstname,
        lastName: lastname,
        isAdmin: isAdmin,
        isActive: isActive,
      });
      tick();
      spectator.inject(UserService).updateUser.and.returnValue(of(void 0));

      component.updateUser();
      tick();
      expect(spectator.inject(UserService).updateUser).toHaveBeenCalledOnceWith({
        id: id,
        username: username,
        firstName: firstname,
        lastName: lastname,
        isAdmin: isAdmin,
        isActive: isActive,
      });
    }));

    it('should update a user correctly', fakeAsync(() => {
      component.form.setValue({
        username: username,
        firstName: firstname,
        lastName: lastname,
        isAdmin: isAdmin,
        isActive: isActive,
      });
      tick();
      spectator.inject(UserService).updateUser.and.returnValue(of(void 0));

      component.updateUser();
      tick();
      expect(spectator.inject(UserService).updateUser).toHaveBeenCalledOnceWith({
        id: id,
        username: username,
        firstName: firstname,
        lastName: lastname,
        isAdmin: isAdmin,
        isActive: isActive,
      });
    }));

    it('should show an error message if user update failed', fakeAsync(() => {
      component.form.setValue(({
        username: username,
        firstName: firstname,
        lastName: lastname,
        isAdmin: isAdmin,
        isActive: isActive,
      }));
      tick();
      spectator.inject(UserService).updateUser.and.returnValue(throwError(() => ({})));

      component.updateUser();
      tick();
      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));

    it('should include all fields even if controls are disabled', fakeAsync(() => {
      spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions
        .filter(p => p.name != PermissionName.SetUserAdmin)
        .filter(p => p.name != PermissionName.SetUserActiveState));
      spectator.setRouteParam('', '');
      tick();
      spectator.inject(UserService).updateUser.and.returnValue(of(void 0));

      component.updateUser();
      tick();
      expect(spectator.inject(UserService).updateUser).toHaveBeenCalledOnceWith({
        id: id,
        username: username,
        firstName: firstname,
        lastName: lastname,
        isAdmin: isAdmin,
        isActive: isActive,
      });
    }));
  });

  it('should disable update user button when update is not allowed', fakeAsync(async () => {
    component.form.setValue(({
      username: '',
      firstName: '',
      lastName: '',
      isAdmin: isAdmin,
      isActive: isActive,
    }));
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Save', { selector: 'button' }))).toBeDisabled();
  }));

  it('should enable save button when update is allowed', fakeAsync(async () => {
    component.form.setValue(({
      username: username,
      firstName: firstname,
      lastName: lastname,
      isAdmin: isAdmin,
      isActive: isActive,
    }));
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Save', { selector: 'button' }))).not.toBeDisabled();
  }));

  it('should update user when update user button is pressed', fakeAsync(async () => {
    component.form.setValue(({
      username: username,
      firstName: firstname,
      lastName: lastname,
      isAdmin: isAdmin,
      isActive: isActive,
    }));
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    spyOn(component, 'updateUser');

    spectator.click(byTextContent('Save', { selector: 'button' }));

    expect(component.updateUser).toHaveBeenCalledOnceWith();
  }));

  it('should show update-user-pass-button', async () => {
    expect(spectator.query(byTextContent('Change Password', {
      exact: false,
      selector: 'button',
    }))).toBeVisible();
  });

  it('should hide update-user-pass-button when missing required permissions', async () => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions.filter(p => p.name !== PermissionName.UpdateUserPass));
    spectator.detectChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Change Password', {
      exact: false,
      selector: 'button',
    }))).not.toBeVisible();
  });

  it('should navigate to update-user-pass view when change password button is pressed', fakeAsync(async () => {
    spectator.click(byTextContent('Change Password', { selector: 'button' }));
    tick();
    expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['update-pass'], { relativeTo: spectator.activatedRouteStub });
  }));

  it('should show permissions button', () => {
    expect(spectator.query(byTextContent('Permissions', { selector: 'button' }))).toBeVisible();
  });

  it('should hide permissions button when missing required permissions', async () => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions.filter(p => p.name !== PermissionName.UpdatePermissions));
    spectator.detectChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Permissions', {
      exact: false,
      selector: 'button',
    }))).not.toBeVisible();
  });

  it('should navigate to permissions-view when permissions button is clicked', () => {
    const navigateSpy = spyOn(component, 'navigateToPermissions');
    spectator.click(byTextContent('Permissions', { selector: 'button' }));
    expect(navigateSpy).toHaveBeenCalledOnceWith();
  });

  describe('navigateToPermissions', () => {
    it('should navigate to permissions view.', fakeAsync(() => {
      component.navigateToPermissions();
      expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['permissions'], { relativeTo: spectator.activatedRouteStub });
    }));
  });
});
