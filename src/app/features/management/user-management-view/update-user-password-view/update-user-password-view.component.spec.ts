import { UpdateUserPasswordView } from './update-user-password-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { NotificationService } from '../../../../core/services/notification.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { ManagementModule } from '../../management.module';

function genFactoryOptions(): SpectatorRoutingOptions<UpdateUserPasswordView> {
  return {
    component: UpdateUserPasswordView,
    imports: [
      ManagementModule,
    ],
    mocks: [
      NotificationService,
      UserService,
    ],
    params: {
      id: '007',
    },
    detectChanges: false,
  };
}

describe('UpdateUserPasswordView', () => {
  let spectator: SpectatorRouting<UpdateUserPasswordView>;
  let component: UpdateUserPasswordView;
  const createComponent = createRoutingFactory(genFactoryOptions());
  const id = '007';
  const newPassword = 'MyNewUtterlyCreativePassword';

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    spectator.inject(UserService).getUserById.and.returnValue(of({
      id: id,
      username: 'JamesBond',
      firstname: 'James',
      lastname: 'Bond',
      isAdmin: true,
      isActive: true,
    }));
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable updating password with no values set', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should disable updating password with no password set', fakeAsync(() => {
    component.form.setValue({
      newPassword: '',
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should allow updating password when password is set', fakeAsync(() => {
    component.form.setValue({
      newPassword: newPassword,
    });
    tick();
    expect(component.form.valid).toBeTrue();
  }));

  describe('updateUserPass', () => {
    it('should disable updating password with no password set', fakeAsync(() => {
      component.form.setValue({
        newPassword: '',
      });
      tick();
      expect(component.updateUserPass).toThrowError();
    }));

    it('should update password correctly', fakeAsync(() => {
      component.form.setValue({
        newPassword: newPassword,
      });
      tick();
      spectator.inject(UserService).updateUserPass.and.returnValue(of(undefined));

      component.updateUserPass();
      tick();

      expect(spectator.inject(UserService).updateUserPass).toHaveBeenCalledOnceWith(id, newPassword);
    }));

    it('show an error message if updating password failed', fakeAsync(() => {
      component.form.setValue({
        newPassword: newPassword,
      });
      tick();
      spectator.inject(UserService).updateUserPass.and.returnValue(throwError(() => ({})));

      component.updateUserPass();
      tick();

      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));
  });

  it('should disable update password button when not allowed', fakeAsync( async () => {
    component.form.setValue({
      newPassword: '',
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Update Password', { selector: 'button' }))).toBeDisabled();
  }));

  it('should enable update password button when allowed', fakeAsync( async () => {
    component.form.setValue({
      newPassword: newPassword,
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Update Password', { selector: 'button' }))).not.toBeDisabled();
  }));

  it('should update password when update password button is pressed', fakeAsync( async () => {
    component.form.setValue({
      newPassword: newPassword,
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    spyOn(component, 'updateUserPass');

    spectator.click(byTextContent('Update Password', { selector: 'button' }));

    expect(component.updateUserPass).toHaveBeenCalledOnceWith();
  }))
});

