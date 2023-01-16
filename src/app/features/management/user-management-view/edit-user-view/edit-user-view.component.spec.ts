import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { NotificationService } from '../../../../core/services/notification.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { EditUserView } from './edit-user-view.component';
import { ManagementModule } from '../../management.module';

function genFactoryOptions(): SpectatorRoutingOptions<EditUserView> {
  return {
    component: EditUserView,
    imports: [
      ManagementModule,
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

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    spectator.inject(UserService).getUserById.and.returnValue(of({
      id: id,
      username: username,
      firstname: firstname,
      lastname: lastname,
      isAdmin: isAdmin,
      isActive: isActive,
    }));
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

  it('should disable user update without values', () => {
    expect(component.form.valid).toBeFalse();
  });

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

  it('should allow user update with all values set', fakeAsync(() => {
    component.form.setValue({
      username: username,
      firstName: firstname,
      lastName: lastname,
      isAdmin: isAdmin,
      isActive: isActive,
    });
    tick();
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
      component.form.setValue(({
        username: username,
        firstName: firstname,
        lastName: lastname,
        isAdmin: isAdmin,
        isActive: isActive,
      }));
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

  it('should enable update user button when update is allowed', fakeAsync(async () => {
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
    spyOn(component, 'updateUser');

    spectator.click(byTextContent('Save', { selector: 'button' }));

    expect(component.updateUser).toHaveBeenCalledOnceWith();
  }));

  it('should navigate to update-user-pass view when change password button is pressed', fakeAsync(async () => {
    spectator.click(byTextContent('Change Password', { selector: 'button' }));
    tick();
    expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['update-pass'], { relativeTo: spectator.activatedRouteStub });
  }));

  it('should show permissions button', () => {
    expect(spectator.query(byTextContent('Permissions', { selector: 'button' }))).toBeVisible();
  });

  it('should navigate to permissions-view when permissions button is clicked', () => {
    const navigateSpy = spyOn(component, 'navigateToPermissions');
    spectator.click(byTextContent('Permissions', { selector: 'button' }));
    expect(navigateSpy).toHaveBeenCalledOnceWith();
  });

  describe('navigateToPermissions', () => {
    it('should navigate to permissions view.', fakeAsync(() => {
      component.navigateToPermissions()
      expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['permissions'], { relativeTo: spectator.activatedRouteStub });
    }));
  })
});
