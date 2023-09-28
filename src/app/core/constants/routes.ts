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
import { ResourcesLayoutComponent } from '../../features/resources/resources-layout.component';
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
import {
  IntelDeliveryView,
} from '../../features/logistics/intel-delivery/intel-delivery-view/intel-delivery-view.component';
import {ManageIntelDelivery, RadioDeliveryPermission} from "../permissions/intel-delivery";
import {RadioDeliveryComponent} from "../../features/logistics/radio-delivery/radio-delivery.component";
import {
  RadioDeliveryItemComponent
} from "../../features/logistics/radio-delivery/radio-delivery-item/radio-delivery-item.component";
import { SignalerIncomingView } from '../../features/signaler/incoming/signaler-incoming-view.component';
import { SignalerOutgoingView } from '../../features/signaler/outgoing/signaler-outgoing-view.component';
import { ReviewerIncomingView } from '../../features/reviewer/incoming/reviewer-incoming-view.component';
import { ListResourcesComponent } from 'src/app/features/resources/list-resources/list-resources.component';
import { CreateResourceView } from 'src/app/features/resources/create-resource/create-resource.component';
import { OperationTableLayoutComponent } from 'src/app/features/operation-table/operation-table-layout.component';
import { OperationTableView } from 'src/app/features/operation-table/operation-table-view/operation-table-view.component';
import { CreateIncidentComponent } from 'src/app/features/operation-table/create-incident/create-incident.component';
import { EditResourceComponent } from 'src/app/features/resources/edit-resource/edit-resource.component';
import {CreateMessageComponent} from "../../features/mailbox/create-message/create-message.component";
import { ReviewerOutgoingLayoutComponent } from 'src/app/features/reviewer/outgoing/reviewer-outgoing-layout/reviewer-outgoing-layout.component';

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
            component: ReviewerIncomingView
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
        path: 'intelligence',
        component: IntelligenceLayoutComponent,
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
          },
          {
            path: 'radio-delivery',
            component: RadioDeliveryComponent,
            data: {
              requirePermissions: [
                RadioDeliveryPermission()
              ],
            },
          },
          {
            path: 'radio-delivery/:attemptId',
            component: RadioDeliveryItemComponent,
            data: {
              requirePermissions: [
                RadioDeliveryPermission()
              ],
            },
          },
        ],
      },
      {
        path: 'intel-delivery',
        component: IntelDeliveryView,
        data: {
          requirePermissions: [
            ManageIntelDelivery(),
          ],
        },
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
