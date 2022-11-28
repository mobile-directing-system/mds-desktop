import { LandingLayoutComponent } from './landing-layout.component';
import { byTextContent, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { AppRoutes } from '../../constants/routes';
import { NetService } from '../../services/net.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('LandingLayoutComponent.integration', () => {
  let spectator: SpectatorRouting<LandingLayoutComponent>;
  let component: LandingLayoutComponent;
  const createComponent = createRoutingFactory({
    component: LandingLayoutComponent,
    imports: [CoreModule],
    mocks: [NetService],
    routes: AppRoutes,
    stubsEnabled: false,
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the change-server-url button', () => {
    const changeBtn = spectator.query(byTextContent('Change server url', { selector: 'a' }));
    expect(changeBtn).toExist();
  });

  it('should navigate to change-server-url when button is clicked', async () => {
    const expectUrl = '/set-server-url';
    expect(spectator.router.url).not.toEqual(expectUrl);

    spectator.click(byTextContent('Change server url', { selector: 'a' }));
    await spectator.fixture.whenStable();

    expect(spectator.router.url).toEqual('/set-server-url');
  });

  it('should hide the change-server-url button when on change page', fakeAsync(async () => {
    const changeUrl = '/set-server-url';

    spectator.fixture.ngZone?.run(() => {
      spectator.router.navigate([changeUrl]).then();
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    expect(spectator.router.url).toEqual(changeUrl);

    expect(spectator.query(byTextContent('Change server url', { selector: 'a' }))).not.toBeVisible();
  }));
});
