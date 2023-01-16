import { MissingPermissionsView } from './missing-permissions-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { Location } from '@angular/common';
import { AppRoutes } from '../../constants/routes';
import { clearRouteComponentsExcept } from '../../testutil/testutil';

describe('MissingPermissionsView', () => {
  let spectator: SpectatorRouting<MissingPermissionsView>;
  let component: MissingPermissionsView;
  const createComponent = createRoutingFactory({
    component: MissingPermissionsView,
    imports: [CoreModule],
    mocks: [Location],
    routes: clearRouteComponentsExcept(AppRoutes, '/missing-permissions'),
    stubsEnabled: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fixture', () => {
    beforeEach(async () => {
      await spectator.fixture.whenStable();
    });

    it('should display hint', () => {
      expect(spectator.query(byTextContent('missing permission', {
        exact: false,
        selector: 'h3',
      }))).toBeVisible();
    });

    it('should display back-button', () => {
      expect(spectator.query(byTextContent('Back', { selector: 'button' }))).toBeVisible();
    });

    it('should display log-out-button', () => {
      expect(spectator.query(byTextContent('Log out', { selector: 'button' }))).toBeVisible();
    });

    it('should navigate to logout when log-out-button is clicked', async () => {
      spectator.click(byTextContent('Log out', { selector: 'button' }));
      await spectator.fixture.whenStable();
      expect(spectator.router.url).toEqual('/logout');
    });

    it('should navigate back when back is clicked', () => {
      spectator.click(byTextContent('Back', { selector: 'button' }));
      expect(spectator.inject(Location).back).toHaveBeenCalledOnceWith();
    });
  });
});
