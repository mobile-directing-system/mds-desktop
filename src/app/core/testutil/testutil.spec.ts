import { Route, Routes } from '@angular/router';
import { HomeLayoutComponent } from '../components/home-layout/home-layout.component';
import { ManageLayoutComponent } from '../../features/management/manage-layout/manage-layout.component';
import { UserManagementView } from '../../features/management/user-management-view/user-management-view.component';
import { MailboxLayoutComponent } from '../../features/mailbox/mailbox-layout/mailbox-layout.component';
import { LandingLayoutComponent } from '../components/landing-layout/landing-layout.component';
import { SetServerURLView } from '../../features/auth/set-server-url-view/set-server-url-view.component';
import { LoginView } from '../../features/auth/login-view/login-view.component';
import { clearRouteComponentsExcept, clearRouteComponentsFor } from './testutil';

describe('clearRouteComponentsFor', () => {
  it('should clear correctly', () => {
    const routes: Routes = [
      {
        path: '',
        component: HomeLayoutComponent,
        children: [
          {
            path: 'manage',
            component: ManageLayoutComponent,
            children: [
              {
                path: 'users',
                component: UserManagementView,
                children: [
                  {
                    path: 'wales',
                    component: UserManagementView,
                  },
                ],
              },
            ],
          },
          {
            path: 'mailbox',
            component: MailboxLayoutComponent,
          },
        ],
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
    const expectCleared: Route[] = [
      {
        path: '',
        component: undefined,
        canActivate: undefined,
        canActivateChild: undefined,
        children: [
          {
            path: 'manage',
            component: undefined,
            canActivate: undefined,
            canActivateChild: undefined,
            children: [
              {
                path: 'users',
                component: undefined,
                canActivate: undefined,
                canActivateChild: undefined,
                children: [
                  {
                    path: 'wales',
                    component: UserManagementView,
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            path: 'mailbox',
            component: MailboxLayoutComponent,
            children: [],
          },
        ],
      },
      {
        path: '',
        component: undefined,
        canActivate: undefined,
        canActivateChild: undefined,
        children: [
          {
            path: 'set-server-url',
            component: SetServerURLView,
            children: [],
          },
          {
            path: 'login',
            component: LoginView,
            children: [],
          },
        ],
      },
    ];
    const got = clearRouteComponentsFor(routes, '/manage/users');
    expect(got).toEqual(expectCleared);
  });
});


describe('clearRouteComponentsExcept', () => {
  it('should clear correctly', () => {
    const routes: Routes = [
      {
        path: '',
        component: HomeLayoutComponent,
        children: [
          {
            path: 'manage',
            component: ManageLayoutComponent,
            children: [
              {
                path: 'users',
                component: UserManagementView,
                children: [
                  {
                    path: 'wales',
                    component: UserManagementView,
                  },
                ],
              },
            ],
          },
          {
            path: 'mailbox',
            component: MailboxLayoutComponent,
          },
        ],
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
    const expectCleared: Route[] = [
      {
        path: '',
        component: undefined,
        canActivate: undefined,
        canActivateChild: undefined,
        children: [
          {
            path: 'manage',
            component: undefined,
            canActivate: undefined,
            canActivateChild: undefined,
            children: [
              {
                path: 'users',
                component: UserManagementView,
                children: [
                  {
                    path: 'wales',
                    component: undefined,
                    canActivate: undefined,
                    canActivateChild: undefined,
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            path: 'mailbox',
            component: undefined,
            canActivate: undefined,
            canActivateChild: undefined,
            children: [],
          },
        ],
      },
      {
        path: '',
        component: undefined,
        canActivate: undefined,
        canActivateChild: undefined,
        children: [
          {
            path: 'set-server-url',
            component: undefined,
            canActivate: undefined,
            canActivateChild: undefined,
            children: [],
          },
          {
            path: 'login',
            component: undefined,
            canActivate: undefined,
            canActivateChild: undefined,
            children: [],
          },
        ],
      },
    ];
    const got = clearRouteComponentsExcept(routes, '/manage/users');
    expect(got).toEqual(expectCleared);
  });
});
