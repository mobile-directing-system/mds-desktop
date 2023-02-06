import { HomeLayoutComponent } from './home-layout.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { User } from '../../model/user';
import { Router } from '@angular/router';
import { AppRoutes } from '../../constants/routes';
import { clearRouteComponentsExcept } from '../../testutil/testutil';

function genFactoryOptions(): SpectatorRoutingOptions<HomeLayoutComponent> {
  return {
    component: HomeLayoutComponent,
    imports: [
      CoreModule,
    ],
    mocks: [
      AuthService,
      UserService,
    ],
    detectChanges: false,
    routes: clearRouteComponentsExcept(AppRoutes, '/'),
  };
}

describe('HomeLayoutComponent', () => {
  let spectator: SpectatorRouting<HomeLayoutComponent>;
  const createComponent = createRoutingFactory<HomeLayoutComponent>({
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

  it('should show the logo', () => {
    expect(spectator.query('app-logo')).toExist();
  });

  describe('menu items', () => {
    const tests: {
      name: string,
      link: string[],
    }[] = [
      {
        name: 'Mailbox',
        link: ['/mailbox'],
      },
      {
        name: 'Intelligence',
        link: ['/intelligence'],
      },
      {
        name: 'Resources',
        link: ['/resources'],
      },
      {
        name: 'Logistics',
        link: ['/logistics'],
      },
    ];
    tests.forEach(tt => {
      const ttName = tt.name.toLowerCase();
      const url = tt.link.join('/');
      const menuItemSelector = byTextContent(tt.name, { selector: 'div' });

      it(`should display menu item for ${ ttName }`, () => {
        expect(spectator.query(menuItemSelector)).toExist();
      });

      it(`should navigate correctly when clicking menu item ${ ttName }`, async () => {
        expect(spectator.router.url).not.toEqual(url);

        spectator.click(menuItemSelector);
        await spectator.fixture.whenStable();

        expect(spectator.inject(Router).url).toEqual(url);
      });

      it(`should highlight menu item ${ ttName } when active`, async () => {
        spectator.fixture.ngZone?.run(() => {
          spectator.router.navigate(tt.link).then();
        });
        await spectator.fixture.whenStable();

        expect(spectator.query(menuItemSelector)).toHaveClass('active');
      });
    });
  });
});
