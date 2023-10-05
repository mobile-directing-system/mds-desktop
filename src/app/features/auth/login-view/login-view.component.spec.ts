import { LoginView } from './login-view.component';
import { createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { AuthModule } from '../auth.module';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AppRoutes } from '../../../core/constants/routes';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

function genFactoryOptions(): SpectatorRoutingOptions<LoginView> {
  return {
    component: LoginView,
    imports: [
      AuthModule,
    ],
    mocks: [
      AuthService,
      NotificationService,
    ],
    routes: AppRoutes,
    stubsEnabled: false,
  };
}

describe('LoginView', () => {
  let spectator: SpectatorRouting<LoginView>;
  let component: LoginView;
  const createComponent = createRoutingFactory(genFactoryOptions());
  const username = 'once';
  const pass = 'way';
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    navigateSpy = spyOn(spectator.router, 'navigate').and.resolveTo();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable login with no credentials', () => {
    expect(component.allowLogin).toBeFalse();
  });

  it('should disable login with missing username', fakeAsync(() => {
    component.form.setValue({
      username: '',
      pass: pass,
    });
    tick();
    expect(component.allowLogin).toBeFalse();
  }));

  it('should disable login with missing password', fakeAsync(() => {
    component.form.setValue({
      username: username,
      pass: '',
    });
    tick();
    expect(component.allowLogin).toBeFalse();
  }));

  it('should allow login with provided credentials', fakeAsync(() => {
    component.form.setValue({
      username: username,
      pass: pass,
    });
    tick();
    expect(component.allowLogin).toBeTrue();
  }));

  describe('login', () => {
    it('should fail with missing username', fakeAsync(() => {
      component.form.setValue({
        username: '',
        pass: pass,
      });
      tick();
      expect(component.login).toThrowError();
    }));

    it('should fail with missing password', fakeAsync(() => {
      component.form.setValue({
        username: username,
        pass: '',
      });
      tick();
      expect(component.login).toThrowError();
    }));

    it('should navigate to homepage when logged in', fakeAsync(() => {
      component.form.setValue({
        username: username,
        pass: pass,
      });
      tick();
      spectator.inject(AuthService).login.and.returnValue(of(true));

      component.login();
      tick();

      expect(navigateSpy).toHaveBeenCalledOnceWith(['/']);
    }));

    it('should login correctly', fakeAsync(() => {
      component.form.setValue({
        username: username,
        pass: pass,
      });
      tick();
      spectator.inject(AuthService).login.and.returnValue(of(true));

      component.login();
      tick();

      expect(spectator.inject(AuthService).login).toHaveBeenCalledOnceWith(username, pass);
    }));

    it('show an error message if login failed', fakeAsync(() => {
      component.form.setValue({
        username: username,
        pass: pass,
      });
      tick();
      spectator.inject(AuthService).login.and.returnValue(of(false));

      component.login();
      tick();

      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));

    it('show an error message if login failed 2', fakeAsync(() => {
      component.form.setValue({
        username: username,
        pass: pass,
      });
      tick();
      spectator.inject(AuthService).login.and.returnValue(throwError(() => ({})));

      component.login();
      tick();

      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));
  });
});

describe('LoginView.integration', () => {
  let spectator: SpectatorRouting<LoginView>;
  let component: LoginView;
  const createComponent = createRoutingFactory({
    ...genFactoryOptions(),
    stubsEnabled: true,
  });
  const username = 'once';
  const pass = 'way';

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should disabled login button when login is not allowed', fakeAsync(async () => {
    component.form.setValue({
      username: '',
      pass: '',
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('form button')).toBeDisabled();
  }));

  it('should enable login button when login is allowed', fakeAsync(() => {
    component.form.setValue({
      username: username,
      pass: pass,
    });
    spectator.detectComponentChanges();
    spectator.tick();

    expect(spectator.query('form button')).not.toBeDisabled();
  }));

  it('should login when login button is pressed', fakeAsync(() => {
    component.form.setValue({
      username: username,
      pass: pass,
    });
    spectator.detectComponentChanges();
    spectator.tick();

    spyOn(component, 'login');

    spectator.click('form button');

    expect(component.login).toHaveBeenCalledOnceWith();
  }));
});
