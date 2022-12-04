import { CreateUserView } from './create-user-view.component';
import { createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { NotificationService } from '../../core/services/notification.service';
import { AppRoutes } from '../../core/constants/routes';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserService } from '../../core/services/user.service';

function genFactoryOptions(): SpectatorRoutingOptions<CreateUserView> {
  return {
    component: CreateUserView,
    imports: [],
    mocks: [
      NotificationService,
      UserService,
    ],
    routes: AppRoutes,
    stubsEnabled: false,
  };
}

describe('CreateUserView', () => {
  let spectator: SpectatorRouting<CreateUserView>;
  let component: CreateUserView;
  const createComponent = createRoutingFactory(genFactoryOptions());
  const username = 'JamesBond';
  const firstname = 'James';
  const lastname = 'Bond';
  const isAdmin = false;
  const pass = 'testPW';
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    navigateSpy = spyOn(spectator.router, 'navigate').and.resolveTo();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable user creation without credentials', () => {
    expect(component.allowCreation).toBeFalse();
  });

  it('should disable user creation without username', fakeAsync(() => {
    component.form.setValue({
      username: '',
      first_name: firstname,
      last_name: lastname,
      pass: pass,
      is_admin: isAdmin,
    });
    tick();
    expect(component.allowCreation).toBeFalse();
  }));

  it('should disable user creation without firstname', fakeAsync(() => {
    component.form.setValue({
      username: username,
      first_name: '',
      last_name: lastname,
      pass: pass,
      is_admin: isAdmin,
    });
    tick();
    expect(component.allowCreation).toBeFalse();
  }));

  it('should disable user creation without lastname', fakeAsync(() => {
    component.form.setValue({
      username: username,
      first_name: firstname,
      last_name: '',
      pass: pass,
      is_admin: isAdmin,
    });
    tick();
    expect(component.allowCreation).toBeFalse();
  }));

  it('should disable user creation without password', fakeAsync(() => {
    component.form.setValue({
      username: username,
      first_name: firstname,
      last_name: lastname,
      pass: '',
      is_admin: isAdmin,
    });
    tick();
    expect(component.allowCreation).toBeFalse();
  }));

  it('should allow creation with all values set', fakeAsync(() => {
    component.form.setValue({
      username: username,
      first_name: firstname,
      last_name: lastname,
      pass: pass,
      is_admin: isAdmin,
    });
    tick();
    expect(component.allowCreation).toBeTrue();
  }));

  describe('createUser', () => {
    it('should fail without username', fakeAsync(() => {
      component.form.setValue({
        username: '',
        first_name: firstname,
        last_name: lastname,
        pass: pass,
        is_admin: isAdmin,
      });
      tick();
      expect(component.createUser).toThrowError();
    }));

    it('should fail without firstname', fakeAsync(() => {
      component.form.setValue({
        username: username,
        first_name: '',
        last_name: lastname,
        pass: pass,
        is_admin: isAdmin,
      });
      tick();
      expect(component.createUser).toThrowError();
    }));

    it('should fail without lastname', fakeAsync(() => {
      component.form.setValue({
        username: username,
        first_name: firstname,
        last_name: '',
        pass: pass,
        is_admin: isAdmin,
      });
      tick();
      expect(component.createUser).toThrowError();
    }));

    it('should fail without password', fakeAsync(() => {
      component.form.setValue({
        username: username,
        first_name: firstname,
        last_name: lastname,
        pass: '',
        is_admin: isAdmin,
      });
      tick();
      expect(component.createUser).toThrowError();
    }));

    it('should create user correctly', fakeAsync(() => {
      component.form.setValue(({
        username: username,
        first_name: firstname,
        last_name: lastname,
        pass: pass,
        is_admin: isAdmin,
      }));
      tick();
      spectator.inject(UserService).createUser.and.returnValue({
        id: '007',
        username: username,
        first_name: firstname,
        last_name: lastname,
        pass: pass,
        is_admin: isAdmin,
      });

      component.createUser();
      tick();
      expect(spectator.inject(UserService).createUser).toHaveBeenCalledOnceWith({
        username: username,
        first_name: firstname,
        last_name: lastname,
        pass: pass,
        is_admin: isAdmin,
      });
    }));

    it('should show an error message if user creation failed', fakeAsync(() => {
      component.form.setValue(({
        username: username,
        first_name: firstname,
        last_name: lastname,
        pass: pass,
        is_admin: isAdmin,
      }));
      tick();
      spectator.inject(UserService).createUser.and.returnValue(of(undefined));

      component.createUser();
      tick();
      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));

    it('should show an error message if user creation failed 2', fakeAsync(() => {
      component.form.setValue(({
        username: username,
        first_name: firstname,
        last_name: lastname,
        pass: pass,
        is_admin: isAdmin,
      }));
      tick();
      spectator.inject(UserService).createUser.and.returnValue(throwError(() => ({})));

      component.createUser();
      tick();
      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));
  });
});

describe('CreateUserView.integration', () => {
  let spectator: SpectatorRouting<CreateUserView>;
  let component: CreateUserView;
  const createComponent = createRoutingFactory({
    ...genFactoryOptions(),
    stubsEnabled: true,
  });

  const username = 'JamesBond';
  const firstname = 'James';
  const lastname = 'Bond';
  const isAdmin = false;
  const pass = 'testPW';

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should disable create user button when creation is not allowed', fakeAsync(async () => {
    component.form.setValue(({
      username: '',
      first_name: '',
      last_name: '',
      pass: '',
      is_admin: isAdmin,
    }));
    tick();
    spectator.detectComponentChanges();
    await  spectator.fixture.whenStable();

    expect(spectator.query('from button')).toBeDisabled();
  }));

  it('should enable create user button when creation is not allowed', fakeAsync(async () => {
    component.form.setValue(({
      username: username,
      first_name: firstname,
      last_name: lastname,
      pass: pass,
      is_admin: isAdmin,
    }));
    tick();
    spectator.detectComponentChanges();
    await  spectator.fixture.whenStable();

    expect(spectator.query('from button')).not.toBeDisabled();
  }));

  it('should create user when create user button is pressed', fakeAsync( async () => {
    component.form.setValue(({
      username: username,
      first_name: firstname,
      last_name: lastname,
      pass: pass,
      is_admin: isAdmin,
    }));
    tick();
    spectator.detectComponentChanges();
    await  spectator.fixture.whenStable();
    spyOn(component, 'createUser');

    spectator.click('form button');

    expect(component.createUser).toHaveBeenCalledOnceWith();
  }))
})
