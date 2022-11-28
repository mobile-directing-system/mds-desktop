import { Routes } from '@angular/router';
import { LoginView } from '../../features/auth/login-view/login-view.component';
import { LandingLayoutComponent } from '../components/landing-layout/landing-layout.component';
import { SetServerURLView } from '../../features/auth/set-server-url-view/set-server-url-view.component';
import { HomeLayoutComponent } from '../components/home-layout/home-layout.component';

/**
 * Routes for usage in {@link AppModule}.
 */
export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
  },
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: 'set-server-url',
        component: SetServerURLView,
      },
      {
        path: 'login',
        component: LoginView,
      },
    ],
  },
];
