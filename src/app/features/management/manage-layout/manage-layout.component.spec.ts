import { ManageLayoutComponent } from './manage-layout.component';
import { byTextContent, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { CoreModule } from '../../../core/core.module';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../core/constants/routes';
import { clearRouteComponentsExcept } from '../../../core/testutil/testutil';
import { AccessControlService } from '../../../core/services/access-control.service';
import { PermissionMatcher } from '../../../core/permissions/permissions';
import { ViewUserPermission } from '../../../core/permissions/users';
import { ViewGroupPermission } from '../../../core/permissions/groups';
import { ViewAnyOperationPermission } from '../../../core/permissions/operations';
import { fakeAsync, tick } from '@angular/core/testing';
import { AccessControlMockService } from '../../../core/services/access-control-mock.service';

describe('ManagementLayoutComponent', () => {
  let spectator: SpectatorRouting<ManageLayoutComponent>;
  let component: ManageLayoutComponent;
  const createComponent = createRoutingFactory({
    component: ManageLayoutComponent,
    imports: [
      CoreModule,
    ],
    providers: [
      {
        provide: AccessControlService,
        useExisting: AccessControlMockService,
      },
    ],
    stubsEnabled: false,
    routes: clearRouteComponentsExcept(AppRoutes, '/manage'),
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('side nav items', () => {
    const tests: {
      name: string,
      link: string[],
      requiredPermissions: PermissionMatcher[]
    }[] = [
      {
        name: 'Users',
        link: ['/manage', 'users'],
        requiredPermissions: [ViewUserPermission()],
      },
      {
        name: 'Groups',
        link: ['/manage', 'groups'],
        requiredPermissions: [ViewGroupPermission()],
      },
      {
        name: 'Operations',
        link: ['/manage', 'operations'],
        requiredPermissions: [ViewAnyOperationPermission()],
      },
    ];
    tests.forEach(tt => {
      const ttName = tt.name.toLowerCase();
      const url = tt.link.join('/');
      const itemSelector = byTextContent(tt.name, {
        selector: 'app-side-nav-item div',
        exact: false,
      });

      describe(tt.name, () => {
        it(`should display side nav item for ${ ttName } if permissions granted`, () => {
          expect(spectator.query(itemSelector)).toExist();
        });

        it('should hide side nav item if not granted', fakeAsync(async () => {
          spectator.inject(AccessControlMockService).setNoAdminAndGranted([]);
          tick();
          spectator.detectChanges();
          await spectator.fixture.whenStable();

          expect(spectator.query(itemSelector)).not.toExist();
        }));

        it(`should navigate correctly when clicking side nav item ${ ttName }`, async () => {
          expect(spectator.router.url).not.toEqual(url);

          spectator.click(itemSelector);
          await spectator.fixture.whenStable();

          expect(spectator.inject(Router).url).toEqual(url);
        });
      });
    });
  });
});
