import { UserManagementView } from './user-management-view.component';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { CoreModule } from '../../../core/core.module';
import { AppRoutes } from '../../../core/constants/routes';

describe('UserManagementView', () => {
  let spectator: SpectatorRouting<UserManagementView>;
  const createComponent = createRoutingFactory({
    component: UserManagementView,
    imports: [
      CoreModule,
    ],
    routes: AppRoutes,
    stubsEnabled: false,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
