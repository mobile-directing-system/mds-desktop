import { Component } from '@angular/core';
import { AccessControlService } from '../../../core/services/access-control.service';
import { Observable } from 'rxjs';
import { ViewUserPermission } from '../../../core/permissions/users';
import { ManageIntelDelivery } from '../../../core/permissions/intel-delivery';

/**
 * Layout for logistics.
 */
@Component({
  selector: 'app-logistics-layout',
  templateUrl: './logistics-layout.component.html',
  styleUrls: ['./logistics-layout.component.scss'],
})
export class LogisticsLayoutComponent {
  constructor(private acService: AccessControlService) {
  }

  isViewAddressBookEntriesGranted(): Observable<boolean> {
    return this.acService.isGranted([ViewUserPermission()]);
  }

  isManageIntelDeliveryGranted(): Observable<boolean> {
    return this.acService.isGranted([ManageIntelDelivery()]);
  }
}
