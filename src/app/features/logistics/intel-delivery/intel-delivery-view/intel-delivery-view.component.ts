import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  DetailedOpenIntelDelivery,
  ManualIntelDeliveryService,
} from '../../../../core/services/manual-intel-delivery.service';
import { Observable, Subscription } from 'rxjs';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { Loader } from '../../../../core/util/loader';
import { IntelDeliveryService } from '../../../../core/services/intel-delivery.service';
import { MatDialog } from '@angular/material/dialog';
import { CancelIntelDeliveryDialog } from '../cancel-intel-delivery-dialog/cancel-intel-delivery-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Overview for (manual) intel delivery.
 */
@Component({
  selector: 'app-intel-delivery-view',
  templateUrl: './intel-delivery-view.component.html',
  styleUrls: ['./intel-delivery-view.component.scss'],
})
export class IntelDeliveryView implements OnInit, OnDestroy {
  loader = new Loader();

  private subscribedOperation?: string;
  private s: Subscription[] = [];
  selected?: DetailedOpenIntelDelivery;

  constructor(private manualIntelDeliveryService: ManualIntelDeliveryService, private workspaceService: WorkspaceService,
              private intelDeliveryService: IntelDeliveryService, private dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.s.push(this.workspaceService.operationChange().subscribe(operationId => {
      if (this.subscribedOperation !== undefined) {
        this.manualIntelDeliveryService.unsubscribeForOperation(this.subscribedOperation);
      }
      if (operationId === undefined) {
        return;
      }
      this.manualIntelDeliveryService.subscribeForOperation(operationId);
    }));
    this.s.push(this.manualIntelDeliveryService.selectedChange().subscribe(selected => this.selected = selected));
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  openIntelDeliveriesByImportance(): Observable<DetailedOpenIntelDelivery[]> {
    return this.manualIntelDeliveryService.openIntelDeliveriesByImportanceChange();
  }

  openIntelDeliveriesByAge(): Observable<DetailedOpenIntelDelivery[]> {
    return this.manualIntelDeliveryService.openIntelDeliveriesByAgeChange();
  }

  /**
   * Selects the open intel delivery with the given id.
   * @param deliveryId The id of the delivery to select.
   */
  selectOpenIntelDelivery(deliveryId: string): void {
    this.manualIntelDeliveryService.select(deliveryId);
  }

  /**
   * Shows the {@link CancelIntelDeliveryDialog} for obtaining user confirmation and additional information and cancels
   * the selected delivery, if confirmed.
   */
  cancelSelectedDelivery(): void {
    if (!this.selected) {
      return;
    }
    const dialogRef = CancelIntelDeliveryDialog.open(this.dialog, {
      deliveryId: this.selected.delivery.delivery.id,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result || result.action !== 'submit') {
        return;
      }
      // Submit.
      this.manualIntelDeliveryService.removeDeliveryAndSelectNext(result.deliveryToCancel);
      this.loader.take(this.intelDeliveryService.cancelIntelDeliveryById(result.deliveryToCancel, result.success, result.note)
        .subscribe(() => this.notificationService.notifyUninvasiveShort($localize`Intel delivery cancelled.`)));
    });
  }
}
