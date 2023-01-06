import { Routes } from '@angular/router';
import { LoginView } from '../../features/auth/login-view/login-view.component';
import { LandingLayoutComponent } from '../components/landing-layout/landing-layout.component';
import { SetServerURLView } from '../../features/auth/set-server-url-view/set-server-url-view.component';
import { HomeLayoutComponent } from '../components/home-layout/home-layout.component';
import { EditUserView } from '../../features/management/user-management-view/edit-user-view/edit-user-view.component';
import {
  UpdateUserPasswordView,
} from '../../features/management/user-management-view/update-user-password-view/update-user-password-view.component';
import {
  CreateUserView,
} from '../../features/management/user-management-view/create-user-view/create-user-view.component';
import { ManageLayoutComponent } from '../../features/management/manage-layout/manage-layout.component';
import { UserManagementView } from '../../features/management/user-management-view/user-management-view.component';
import { MailboxLayoutComponent } from '../../features/mailbox/mailbox-layout/mailbox-layout.component';
import {
  IntelligenceLayoutComponent,
} from '../../features/intelligence/intelligence-layout/intelligence-layout.component';
import { ResourcesLayoutComponent } from '../../features/resources/resources-layout/resources-layout.component';
import { LogisticsLayoutComponent } from '../../features/logistics/logistics-layout/logistics-layout.component';
import { GroupManagementView } from '../../features/management/group-management-view/group-management-view.component';
import {
  OperationManagementView,
} from '../../features/management/operation-management-view/operation-management-view.component';
import {
  CreateGroupView,
} from '../../features/management/group-management-view/create-group-view/create-group-view.component';
import {
  EditGroupView,
} from '../../features/management/group-management-view/edit-group-view/edit-group-view.component';
import {
  CreateOperationViewComponent,
} from '../../features/management/operation-management-view/create-operation-view/create-operation-view.component';

/**
 * Routes for usage in {@link AppModule}.
 */
export const AppRoutes: Routes = [
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
          },
          {
            path: 'users/create',
            component: CreateUserView,
          },
          {
            path: 'users/:userId',
            component: EditUserView,
          },
          {
            path: 'users/:userId/update-pass',
            component: UpdateUserPasswordView,
          },
          {
            path: 'groups',
            component: GroupManagementView,
          },
          {
            path: 'groups/create',
            component: CreateGroupView,
          },
          {
            path: 'groups/:groupId',
            component: EditGroupView,
          },
          {
            path: 'operations',
            component: OperationManagementView,
          },
          {
            path: 'operations/create',
            component: CreateOperationViewComponent,
          }
        ],
      },
      {
        path: 'mailbox',
        component: MailboxLayoutComponent,
      },
      {
        path: 'intelligence',
        component: IntelligenceLayoutComponent,
      },
      {
        path: 'resources',
        component: ResourcesLayoutComponent,
      },
      {
        path: 'logistics',
        component: LogisticsLayoutComponent,
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
