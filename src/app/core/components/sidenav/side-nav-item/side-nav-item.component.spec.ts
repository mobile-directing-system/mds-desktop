import { SideNavItemComponent } from './side-nav-item.component';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { CoreModule } from '../../../core.module';
import { AppRoutes } from '../../../constants/routes';

describe('SideNavItemComponent.integration', () => {
  let spectator: SpectatorRouting<SideNavItemComponent>;
  const createComponent = createRoutingFactory({
    component: SideNavItemComponent,
    imports: [
      CoreModule,
    ],
    stubsEnabled: false,
    routes: AppRoutes,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display an icon if provided', async () => {
    spectator.component.icon = 'profile';
    spectator.detectChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('mat-icon')).toBeVisible();
  });

  it('should navigate to the provided link', async () => {
    spectator.component.link = ['/login'];
    spectator.detectChanges();
    await spectator.fixture.whenStable();

    spectator.click('div.item');
    await spectator.fixture.whenStable();

    expect(spectator.router.url).toEqual('/login');
  });
});
