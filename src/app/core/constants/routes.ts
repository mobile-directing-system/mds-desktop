import { CreateIncidentComponent } from 'src/app/features/operation-table/create-incident/create-incident.component';
import { OperationTableLayoutComponent } from 'src/app/features/operation-table/operation-table-layout.component';
import { OperationTableView } from 'src/app/features/operation-table/operation-table-view/operation-table-view.component';
import { CreateResourceView } from 'src/app/features/resources/create-resource/create-resource.component';
import { EditResourceComponent } from 'src/app/features/resources/edit-resource/edit-resource.component';
import { ListResourcesComponent } from 'src/app/features/resources/list-resources/list-resources.component';
import { ReviewerIncomingLayoutComponent } from 'src/app/features/reviewer/incoming/reviewer-incoming-layout/reviewer-incoming-layout.component';
import { ReviewerOutgoingLayoutComponent } from 'src/app/features/reviewer/outgoing/reviewer-outgoing-layout/reviewer-outgoing-layout.component';
import { LoginView } from '../../features/auth/login-view/login-view.component';
import { LogoutView } from '../../features/auth/logout-view/logout-view.component';
import { SetServerURLView } from '../../features/auth/set-server-url-view/set-server-url-view.component';
import {
  AddressBookEntryListView,
} from '../../features/logistics/address-book-entry-list-view/address-book-entry-list-view.component';
import {
  CreateAddressBookEntryView,
} from '../../features/logistics/address-book-entry-list-view/create-address-book-entry-view/create-address-book-entry-view.component';
import {
  EditAddressBookEntryView,
} from '../../features/logistics/address-book-entry-list-view/edit-address-book-entry-view/edit-address-book-entry-view.component';
import { CreateMessageComponent } from "../../features/mailbox/create-message/create-message.component";
import { MailboxLayoutComponent } from '../../features/mailbox/mailbox-layout/mailbox-layout.component';
import {
  CreateGroupView,
} from '../../features/management/group-management-view/create-group-view/create-group-view.component';
import {
  EditGroupView,
} from '../../features/management/group-management-view/edit-group-view/edit-group-view.component';
import { GroupManagementView } from '../../features/management/group-management-view/group-management-view.component';
import { ManageLayoutComponent } from '../../features/management/manage-layout/manage-layout.component';
import {
  CreateOperationView,
} from '../../features/management/operation-management-view/create-operation-view/create-operation-view.component';
import {
  EditOperationViewComponent,
} from '../../features/management/operation-management-view/edit-operation-view/edit-operation-view.component';
import {
  OperationManagementView,
} from '../../features/management/operation-management-view/operation-management-view.component';
import {
  CreateUserView,
} from '../../features/management/user-management-view/create-user-view/create-user-view.component';
import {
  EditUserPermissionsView,
} from '../../features/management/user-management-view/edit-user-permissions-view/edit-user-permissions-view.component';
import { EditUserView } from '../../features/management/user-management-view/edit-user-view/edit-user-view.component';
import {
  UpdateUserPasswordView,
} from '../../features/management/user-management-view/update-user-password-view/update-user-password-view.component';
import { UserManagementView } from '../../features/management/user-management-view/user-management-view.component';
import { ResourcesLayoutComponent } from '../../features/resources/resources-layout.component';
import { SignalerIncomingView } from '../../features/signaler/incoming/signaler-incoming-view.component';
import { SignalerOutgoingView } from '../../features/signaler/outgoing/signaler-outgoing-view.component';
import { HomeLayoutComponent } from '../components/home-layout/home-layout.component';
import { LandingLayoutComponent } from '../components/landing-layout/landing-layout.component';
import { MissingPermissionsView } from '../components/missing-permissions-view/missing-permissions-view.component';
import { PermissionGuard, PermissionGuardedRoute } from '../guards/permission.guard';
import {
  CreateAddressBookEntryPermission,
  UpdateAddressBookEntryPermission,
  ViewAddressBookEntryPermission
} from '../permissions/address-book-entries';
import { CreateGroupPermission, ViewGroupPermission } from '../permissions/groups';
import {
  CreateOperationPermission,
  ViewAnyOperationPermission,
  ViewOperationMembersPermission,
} from '../permissions/operations';
import { ViewPermissionsPermission } from '../permissions/permissions';
import { CreateUserPermission, UpdateUserPassPermission, ViewUserPermission } from '../permissions/users';
import { AddressBookLayoutComponent } from 'src/app/features/logistics/address-book-layout/address-book-layout.component';

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
            path: 'roles',
            component: GroupManagementView,
            data: {
              requirePermissions: [ViewGroupPermission()],
            },
          },
          {
            path: 'roles/create',
            component: CreateGroupView,
            data: {
              requirePermissions: [CreateGroupPermission(), ViewUserPermission()],
            },
          },
          {
            path: 'roles/:roleId',
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
        path: 'signaler',
        children: [
          {
            path: 'incoming',
            component: SignalerIncomingView
          },
          {
            path: 'outgoing',
            component: SignalerOutgoingView
          }
        ]
      },
      {
        path: 'reviewer',
        children: [
          {
            path: 'incoming',
            component: ReviewerIncomingLayoutComponent
          },
          {
            path: 'outgoing',
            component: ReviewerOutgoingLayoutComponent
          }
        ]
      },
      {
        path: 'incidents/create',
        component: CreateIncidentComponent
      },
      {
        path: 'operation-table',
        component: OperationTableLayoutComponent,
        children: [
          {
            path: '',
            component: OperationTableView
          }
        ]
      },
      {
        path: 'mailbox',
        children: [
          {
            path: '',
            component: MailboxLayoutComponent
          },
          {
            path: 'create',
            children: [
              {
                path: '',
                component: CreateMessageComponent
              },
              {
                path: ':referencedMessageId',
                component: CreateMessageComponent
              },
            ]
          },
        ]
      },
      {
        path: 'resources',
        component: ResourcesLayoutComponent,
        children: [
          {
            path: '',
            component: ListResourcesComponent
          },
          {
            path: 'create',
            component: CreateResourceView
          },
          {
            'path': ':id',
            component: EditResourceComponent
          }
        ]
      },
      {
        path: 'address-book',
        component: AddressBookLayoutComponent,
        children: [
          {
            path: '',
            component: AddressBookEntryListView,
            data: {
              requirePermissions: [
                ViewAddressBookEntryPermission(),
                ViewUserPermission(),
                ViewAnyOperationPermission(),
              ]
            }
          },
          {
            path: 'create',
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
            path: ':entryId',
            component: EditAddressBookEntryView,
            data: {
              requirePermissions: [
                UpdateAddressBookEntryPermission(),
                ViewUserPermission(),
                ViewAnyOperationPermission(),
              ],
            },
          },
        ],
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
