import { Component } from '@angular/core';
import { AccessControlService } from '../../../core/services/access-control.service';
import { Observable } from 'rxjs';
import { ViewUserPermission } from '../../../core/permissions/users';
import { ViewGroupPermission } from '../../../core/permissions/groups';
import { ViewAnyOperationPermission, ViewOperationMembersPermission } from '../../../core/permissions/operations';

/**
 * Layout for management.
 */
@Component({
  selector: 'app-management-layout',
  templateUrl: './manage-layout.component.html',
  styleUrls: ['./manage-layout.component.scss'],
})
export class ManageLayoutComponent {

  constructor(private acService: AccessControlService) {
  }

  isViewUsersGranted(): Observable<boolean> {
    return this.acService.isGranted([ViewUserPermission()]);
  }

  isViewGroupsGranted(): Observable<boolean> {
    return this.acService.isGranted([ViewGroupPermission()]);
  }

  isViewOperationsGranted(): Observable<boolean> {
    return this.acService.isGranted([ViewUserPermission(), ViewAnyOperationPermission(), ViewOperationMembersPermission()]);
  }
}
