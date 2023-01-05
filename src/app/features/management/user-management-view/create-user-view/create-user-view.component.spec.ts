import { CreateUserView } from './create-user-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { NotificationService } from '../../../../core/services/notification.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { ManagementModule } from '../../management.module';

function genFactoryOptions(): SpectatorRoutingOptions<CreateUserView> {
  return {
    component: CreateUserView,
    imports: [
      ManagementModule,
    ],
    mocks: [
      NotificationService,
      UserService,
    ],
    detectChanges: false,
  };
}

describe('CreateUserView', () => {
  let spectator: SpectatorRouting<CreateUserView>;
  let component: CreateUserView;
  const createComponent = createRoutingFactory(genFactoryOptions());
  const username = 'butter';
  const firstname = 'fasten';
  const lastname = 'whatever';
  const isAdmin = false;
  const pass = 'X3Q';

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
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

  it('should disable user creation without values', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should disable user creation without username', fakeAsync(() => {
    component.form.setValue({
      username: '',
      firstName: firstname,
      lastName: lastname,
      pass: pass,
      isAdmin: isAdmin,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should disable user creation without firstname', fakeAsync(() => {
    component.form.setValue({
      username: username,
      firstName: '',
      lastName: lastname,
      pass: pass,
      isAdmin: isAdmin,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should disable user creation without lastname', fakeAsync(() => {
    component.form.setValue({
      username: username,
      firstName: firstname,
      lastName: '',
      pass: pass,
      isAdmin: isAdmin,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should disable user creation without password', fakeAsync(() => {
    component.form.setValue({
      username: username,
      firstName: firstname,
      lastName: lastname,
      pass: '',
      isAdmin: isAdmin,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should allow creation with all values set', fakeAsync(() => {
    component.form.setValue({
      username: username,
      firstName: firstname,
      lastName: lastname,
      pass: pass,
      isAdmin: isAdmin,
    });
    tick();
    expect(component.form.valid).toBeTrue();
  }));

  describe('createUser', () => {
    it('should fail without username', fakeAsync(() => {
      component.form.setValue({
        username: '',
        firstName: firstname,
        lastName: lastname,
        pass: pass,
        isAdmin: isAdmin,
      });
      tick();
      expect(component.createUser).toThrowError();
    }));

    it('should fail without firstname', fakeAsync(() => {
      component.form.setValue({
        username: username,
        firstName: '',
        lastName: lastname,
        pass: pass,
        isAdmin: isAdmin,
      });
      tick();
      expect(component.createUser).toThrowError();
    }));

    it('should fail without lastname', fakeAsync(() => {
      component.form.setValue({
        username: username,
        firstName: firstname,
        lastName: '',
        pass: pass,
        isAdmin: isAdmin,
      });
      tick();
      expect(component.createUser).toThrowError();
    }));

    it('should fail without password', fakeAsync(() => {
      component.form.setValue({
        username: username,
        firstName: firstname,
        lastName: lastname,
        pass: '',
        isAdmin: isAdmin,
      });
      tick();
      expect(component.createUser).toThrowError();
    }));

    it('should create user correctly', fakeAsync(() => {
      component.form.setValue(({
        username: username,
        firstName: firstname,
        lastName: lastname,
        pass: pass,
        isAdmin: isAdmin,
      }));
      tick();
      spectator.inject(UserService).createUser.and.returnValue(of({
        id: 'height',
        username: username,
        firstName: firstname,
        lastName: lastname,
        pass: pass,
        isAdmin: isAdmin,
      }));

      component.createUser();
      tick();
      expect(spectator.inject(UserService).createUser).toHaveBeenCalledOnceWith({
        username: username,
        firstName: firstname,
        lastName: lastname,
        initialPass: pass,
        isAdmin: isAdmin,
      });
    }));

    it('should show an error message if user creation failed', fakeAsync(() => {
      component.form.setValue(({
        username: username,
        firstName: firstname,
        lastName: lastname,
        pass: pass,
        isAdmin: isAdmin,
      }));
      tick();
      spectator.inject(UserService).createUser.and.returnValue(of(void 0));

      component.createUser();
      tick();
      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));

    it('should show an error message if user creation failed 2', fakeAsync(() => {
      component.form.setValue(({
        username: username,
        firstName: firstname,
        lastName: lastname,
        pass: pass,
        isAdmin: isAdmin,
      }));
      tick();
      spectator.inject(UserService).createUser.and.returnValue(throwError(() => ({})));

      component.createUser();
      tick();
      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));
  });

  it('should disable create user button when creation is not allowed', fakeAsync(async () => {
    component.form.setValue({
      username: '',
      firstName: '',
      lastName: '',
      pass: '',
      isAdmin: isAdmin,
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Create', { selector: 'button' }))).toBeDisabled();
  }));

  it('should enable create user button when creation is not allowed', fakeAsync(async () => {
    component.form.setValue(({
      username: username,
      firstName: firstname,
      lastName: lastname,
      pass: pass,
      isAdmin: isAdmin,
    }));
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Create', { selector: 'button' }))).not.toBeDisabled();
  }));

  it('should create user when create user button is pressed', fakeAsync(async () => {
    component.form.setValue(({
      username: username,
      firstName: firstname,
      lastName: lastname,
      pass: pass,
      isAdmin: isAdmin,
    }));
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    spyOn(component, 'createUser');

    spectator.click(byTextContent('Create', { selector: 'button' }));

    expect(component.createUser).toHaveBeenCalledOnceWith();
  }));
});
