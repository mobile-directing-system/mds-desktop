import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { CoreModule } from '../../../core.module';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { AppRoutes } from '../../../constants/routes';
import { fakeAsync, tick } from '@angular/core/testing';
import { User } from '../../../model/user';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ProfileComponent } from './profile.component';

function genFactoryOptions(): SpectatorRoutingOptions<ProfileComponent> {
  return {
    component: ProfileComponent,
    imports: [
      CoreModule,
    ],
    mocks: [
      AuthService,
      UserService,
    ],
    detectChanges: false,
    routes: AppRoutes,
  };
}

describe('ProfileComponent', () => {
  let spectator: SpectatorRouting<ProfileComponent>;
  const createComponent = createRoutingFactory<ProfileComponent>(genFactoryOptions());

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('user retrieval', () => {
    it('should retrieve the logged in user', fakeAsync(() => {
      const userId = 'garden';
      const user: User = {
        id: userId,
        username: 'absolute',
        firstName: 'party',
        lastName: 'collar',
        isActive: true,
        isAdmin: false,
      };
      spectator.inject(AuthService).userChange.and.returnValue(of(userId));
      spectator.inject(UserService).getUserById.and.returnValue(of(user));

      spectator.detectChanges();
      tick();

      expect(spectator.inject(UserService).getUserById).toHaveBeenCalledOnceWith(userId);
      expect(spectator.component.loggedInUser).toEqual(user);
    }));

    it('should not fail when not logged in', fakeAsync(() => {
      spectator.inject(AuthService).userChange.and.returnValue(of(void 0));

      spectator.detectChanges();
      tick();

      expect(spectator.inject(UserService).getUserById).not.toHaveBeenCalled();
      expect(spectator.component.loggedInUser).toEqual(undefined);
    }));
  });

  describe('logout', () => {
    it('should log out correctly', fakeAsync(() => {
      spectator.inject(AuthService).logout.and.returnValue(of(void 0));
      spectator.inject(Router).navigate.and.resolveTo();

      spectator.component.logout();
      tick();

      expect(spectator.inject(AuthService).logout).toHaveBeenCalledOnceWith();
    }));

    it('should navigate to login-page after logging out', fakeAsync(() => {
      spectator.inject(AuthService).logout.and.returnValue(of(void 0));
      spectator.inject(Router).navigate.and.resolveTo();

      spectator.component.logout();
      tick();

      expect(spectator.inject(Router).navigate).toHaveBeenCalledOnceWith(['/login']);
    }));
  });

  describe('assembleProfileName', () => {
    const tests: {
      name: string,
      noUser?: boolean,
      firstName?: string,
      lastName?: string,
      username?: string,
      want: string | undefined,
    }[] = [
      {
        name: 'no user',
        noUser: true,
        want: undefined,
      },
      {
        name: 'none set',
        want: '',
      },
      {
        name: 'only first name',
        firstName: 'question',
        want: 'question',
      },
      {
        name: 'only last name',
        lastName: 'through',
        want: 'through',
      },
      {
        name: 'only username',
        username: 'visit',
        want: 'visit',
      },
      {
        name: 'only full name',
        firstName: 'this',
        lastName: 'temple',
        want: 'this temple',
      },
      {
        name: 'all',
        firstName: 'offend',
        lastName: 'dollar',
        username: 'among',
        want: 'offend dollar (among)',
      },
    ];
    tests.forEach(tt => {
      it(`should assemble correct profile name (${ tt.name })`, () => {
        if (tt.noUser) {
          spectator.component.loggedInUser = undefined;
        } else {
          spectator.component.loggedInUser = {
            id: 'sail',
            firstName: tt.firstName ?? '',
            lastName: tt.lastName ?? '',
            username: tt.username ?? '',
            isActive: true,
            isAdmin: false,
          };
        }
        expect(spectator.component.assembleProfileName()).toEqual(tt.want);
      });
    });
  });
});

describe('ProfileComponent.integration', () => {
  let spectator: SpectatorRouting<ProfileComponent>;
  const createComponent = createRoutingFactory<ProfileComponent>({
    ...genFactoryOptions(),
    stubsEnabled: false,
  });

  beforeEach(fakeAsync(async () => {
    spectator = createComponent();
    const user: User = {
      id: 'autumn',
      username: 'absolute',
      firstName: 'party',
      lastName: 'collar',
      isActive: true,
      isAdmin: false,
    };
    spectator.inject(AuthService).userChange.and.returnValue(of('country'));
    spectator.inject(UserService).getUserById.and.returnValue(of(user));

    spectator.detectChanges();
    tick();
    await spectator.fixture.whenStable();
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('profile menu', () => {
    let overlayContainer: HTMLElement;

    beforeEach(async () => {
      spectator.click('div.profile');
      await spectator.fixture.whenStable();
      overlayContainer = spectator.inject(OverlayContainer).getContainerElement();
    });

    it('should create', async () => {
      expect(spectator.query('.mat-menu-panel .mat-menu-item')).toBeVisible();
    });

    it('should show currently logged-in user', async () => {
      const profileName = spectator.component.assembleProfileName();
      if (!profileName) {
        fail('missing profile name');
        return;
      }

      expect(byTextContent(profileName, { selector: 'span' }).execute(overlayContainer)).toBeVisible();
    });

    describe('management menu item', () => {
      const itemSelector = byTextContent('MDS Management', { selector: 'button' });

      it('should show', async () => {
        expect(itemSelector.execute(overlayContainer)).toBeVisible();
      });

      it('should navigate to management when clicked', async () => {
        itemSelector.execute(overlayContainer)[0].click();
        await spectator.fixture.whenStable();

        expect(spectator.inject(Router).url).toEqual('/manage');
      });
    });

    it('should log out when log-out-button is clicked', () => {
      const logOutSelector = byTextContent('Log out', { selector: 'button' });
      const logoutSpy = spyOn(spectator.component, 'logout');

      logOutSelector.execute(overlayContainer)[0].click();

      expect(logoutSpy).toHaveBeenCalledOnceWith();
    });
  });
});
