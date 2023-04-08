import { SetServerURLView } from './set-server-url-view.component';
import { createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { AuthModule } from '../auth.module';
import { NetService } from '../../../core/services/net.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AppRoutes } from '../../../core/constants/routes';
import { AuthService } from '../../../core/services/auth.service';
import { fakeAsync, tick } from '@angular/core/testing';

function genFactoryOptions(): SpectatorRoutingOptions<SetServerURLView> {
  return {
    component: SetServerURLView,
    imports: [
      AuthModule,
    ],
    mocks: [
      NetService,
      AuthService,
      NotificationService,
      LocalStorageService,
    ],
    routes: AppRoutes,
    stubsEnabled: false,
  };
}

describe('SetServerURLView', () => {
  let spectator: SpectatorRouting<SetServerURLView>;
  let component: SetServerURLView;
  const createComponent = createRoutingFactory(genFactoryOptions());

  const serverURL = 'http://dinner:1234';
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    navigateSpy = spyOn(spectator.router, 'navigate').and.resolveTo();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should prefill the current server url', () => {
    spectator.inject(LocalStorageService).getItem.and.returnValue(serverURL);

    component.ngOnInit();

    expect(component.serverUrlFC.value).toEqual(serverURL);
  });

  describe('apply', () => {
    beforeEach(() => {
      component.serverUrlFC.setValue(serverURL);
    });

    it('should apply the base url to net service', () => {
      component.apply();
      expect(spectator.inject(NetService).setBaseUrl).toHaveBeenCalledOnceWith(serverURL);
    });

    it('should navigate to login page after apply', () => {
      component.apply();
      expect(navigateSpy).toHaveBeenCalled();
    });

    it('should clear login data', () => {
      component.apply();
      expect(spectator.inject(AuthService).clearLogin).toHaveBeenCalledOnceWith();
    });

    it('should notify of success', () => {
      component.apply();
      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalledTimes(1);
    });
  });
});

describe('SetServerURLView.integration', () => {
  let spectator: SpectatorRouting<SetServerURLView>;
  let component: SetServerURLView;
  const createComponent = createRoutingFactory(genFactoryOptions());

  const serverURL = 'http://dinner:1234';
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    navigateSpy = spyOn(spectator.router, 'navigate').and.resolveTo();
  });

  it('should disable the apply-button when no url was entered', () => {
    expect(spectator.query('form button')).toBeDisabled();
  });

  it('should disable the apply-button when an incorrect url was entered', fakeAsync(async () => {
    component.serverUrlFC.setValue('invalid url');
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('form button')).toBeDisabled();
  }));

  it('should enable the apply-button when a correct url was entered', fakeAsync(async () => {
    component.serverUrlFC.setValue(serverURL);
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('form button')).not.toBeDisabled();
  }));

  it('should apply when apply-button is clicked', fakeAsync(async () => {
    component.serverUrlFC.setValue(serverURL);
    const applySpy = spyOn(component, 'apply');
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    spectator.click('form button');

    expect(applySpy).toHaveBeenCalledOnceWith();
  }));
});
