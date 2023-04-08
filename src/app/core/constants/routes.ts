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
import { GroupManagementView } from '../../features/management/group-management-view/group-management-view.component';
import {
  OperationManagementView,
} from '../../features/management/operation-management-view/operation-management-view.component';
import { LogoutView } from '../../features/auth/logout-view/logout-view.component';
import { PermissionGuard, PermissionGuardedRoute } from '../guards/permission.guard';
import { CreateUserPermission, UpdateUserPassPermission, ViewUserPermission } from '../permissions/users';
import { MissingPermissionsView } from '../components/missing-permissions-view/missing-permissions-view.component';
import {
  CreateGroupView,
} from '../../features/management/group-management-view/create-group-view/create-group-view.component';
import {
  EditGroupView,
} from '../../features/management/group-management-view/edit-group-view/edit-group-view.component';
import {
  CreateOperationView,
} from '../../features/management/operation-management-view/create-operation-view/create-operation-view.component';
import {
  EditOperationViewComponent,
} from '../../features/management/operation-management-view/edit-operation-view/edit-operation-view.component';
import {
  AddressBookEntryListView,
} from '../../features/logistics/address-book-entry-list-view/address-book-entry-list-view.component';
import {
  CreateAddressBookEntryView,
} from '../../features/logistics/address-book-entry-list-view/create-address-book-entry-view/create-address-book-entry-view.component';
import { LogisticsLayoutComponent } from '../../features/logistics/logistics-layout/logistics-layout.component';
import {
  EditAddressBookEntryView,
} from '../../features/logistics/address-book-entry-list-view/edit-address-book-entry-view/edit-address-book-entry-view.component';
import {
  EditUserPermissionsView,
} from '../../features/management/user-management-view/edit-user-permissions-view/edit-user-permissions-view.component';
import { ViewPermissionsPermission } from '../permissions/permissions';
import { CreateGroupPermission, ViewGroupPermission } from '../permissions/groups';
import {
  CreateOperationPermission,
  ViewAnyOperationPermission,
  ViewOperationMembersPermission,
} from '../permissions/operations';
import {
  CreateAddressBookEntryPermission,
  UpdateAddressBookEntryPermission,
  ViewAddressBookEntryPermission,
} from '../permissions/address-book-entries';

/**
 * Routes for usage in {@link AppModule}.
 */
export const AppRoutes: PermissionGuardedRoute[] = [
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
            data: {
              requirePermissions: [ViewUserPermission()],
            },
          },
          {
            path: 'users/create',
            component: CreateUserView,
            data: {
              requirePermissions: [CreateUserPermission()],
            },
          },
          {
            path: 'users/:userId',
            component: EditUserView,
            data: {
              requirePermissions: [ViewUserPermission()],
            },
          },
          {
            path: 'users/:userId/permissions',
            component: EditUserPermissionsView,
            data: {
              requirePermissions: [ViewUserPermission(), ViewPermissionsPermission()],
            },
          },
          {
            path: 'users/:userId/update-pass',
            component: UpdateUserPasswordView,
            data: {
              requirePermissions: [ViewUserPermission(), UpdateUserPassPermission()],
            },
          },
          {
            path: 'groups',
            component: GroupManagementView,
            data: {
              requirePermissions: [ViewGroupPermission()],
            },
          },
          {
            path: 'groups/create',
            component: CreateGroupView,
            data: {
              requirePermissions: [CreateGroupPermission(), ViewUserPermission()],
            },
          },
          {
            path: 'groups/:groupId',
            component: EditGroupView,
            data: {
              requirePermissions: [ViewGroupPermission()],
            },
          },
          {
            path: 'operations',
            component: OperationManagementView,
            data: {
              requirePermissions: [ViewAnyOperationPermission()],
            },
          },
          {
            path: 'operations/create',
            component: CreateOperationView,
            data: {
              requirePermissions: [CreateOperationPermission()],
            },
          },
          {
            path: 'operations/:operationId',
            component: EditOperationViewComponent,
            data: {
              requirePermissions: [
                ViewUserPermission(),
                ViewAnyOperationPermission(),
                ViewOperationMembersPermission(),
              ],
            },
          },
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
        children: [
          {
            path: 'address-book',
            component: AddressBookEntryListView,
            data: {
              requirePermissions: [
                ViewAddressBookEntryPermission(),
                ViewUserPermission(),
                ViewAnyOperationPermission(),
              ],
            },
          },
          {
            path: 'address-book/create',
            component: CreateAddressBookEntryView,
            data: {
              requirePermissions: [
                CreateAddressBookEntryPermission(),
                ViewUserPermission(),
                ViewAnyOperationPermission(),
              ],
            },
          },
          {
            path: 'address-book/:entryId',
            component: EditAddressBookEntryView,
            data: {
              requirePermissions: [
                UpdateAddressBookEntryPermission(),
                ViewUserPermission(),
                ViewAnyOperationPermission(),
              ],
            },
          }
        ]
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
        path: 'missing-permissions',
        component: MissingPermissionsView,
      },
      {
        path: 'login',
        component: LoginView,
      },
      {
        path: 'logout',
        component: LogoutView,
      },
    ],
  },
];

export const SecuredAppRoutes = AppRoutes.map(r => ({
  ...r,
  canActivateChild: [PermissionGuard],
}));
