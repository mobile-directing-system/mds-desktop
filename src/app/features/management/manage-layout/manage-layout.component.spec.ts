import { ManageLayoutComponent } from './manage-layout.component';
import { byTextContent, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { CoreModule } from '../../../core/core.module';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../core/constants/routes';
import { clearRouteComponentsExcept } from '../../../core/testutil/testutil';

describe('ManagementLayoutComponent', () => {
  let spectator: SpectatorRouting<ManageLayoutComponent>;
  const createComponent = createRoutingFactory({
    component: ManageLayoutComponent,
    imports: [
      CoreModule,
    ],
    stubsEnabled: false,
    routes: clearRouteComponentsExcept(AppRoutes, '/manage'),
  });

  beforeEach(async () => {
    spectator = createComponent();
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('side nav items', () => {
    const tests: {
      name: string,
      link: string[],
    }[] = [
      {
        name: 'Users',
        link: ['/manage', 'users'],
      },
      {
        name: 'Groups',
        link: ['/manage', 'groups'],
      },
      {
        name: 'Operations',
        link: ['/manage', 'operations'],
      },
    ];
    tests.forEach(tt => {
      const ttName = tt.name.toLowerCase();
      const url = tt.link.join('/');
      const itemSelector = byTextContent(tt.name, {
        selector: 'app-side-nav-item div',
        exact: false,
      });

      it(`should display side nav item for ${ ttName }`, () => {
        expect(spectator.query(itemSelector)).toExist();
      });

      it(`should navigate correctly when clicking side nav item ${ ttName }`, async () => {
        expect(spectator.router.url).not.toEqual(url);

        spectator.click(itemSelector);
        await spectator.fixture.whenStable();

        expect(spectator.inject(Router).url).toEqual(url);
      });
    });
  });
});
