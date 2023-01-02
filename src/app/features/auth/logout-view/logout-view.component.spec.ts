import { LogoutView } from './logout-view.component';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { clearRouteComponentsExcept } from '../../../core/testutil/testutil';
import { AppRoutes } from '../../../core/constants/routes';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';

describe('LogoutView', () => {
  let spectator: SpectatorRouting<LogoutView>;
  let component: LogoutView;
  const createComponent = createRoutingFactory<LogoutView>({
    component: LogoutView,
    routes: clearRouteComponentsExcept(AppRoutes, '/logout'),
    mocks: [AuthService],
    detectChanges: false,
  });
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;

    spectator.inject(AuthService).logout.and.returnValue(of(void 0));
    navigateSpy = jasmine.createSpy().and.resolveTo();
    spectator.router.navigate = navigateSpy;

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out', () => {
    expect(spectator.inject(AuthService).logout).toHaveBeenCalledOnceWith();
  });

  it('should navigate to login-page', () => {
    expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['/login']);
  });
});
