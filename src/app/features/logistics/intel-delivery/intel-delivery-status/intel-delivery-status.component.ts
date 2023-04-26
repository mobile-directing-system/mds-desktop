import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../../../core/services/web-socket.service';
import { IntelDeliveryService } from '../../../../core/services/intel-delivery.service';
import { ManualIntelDeliveryService } from '../../../../core/services/manual-intel-delivery.service';

/**
 * Brief summary of current intel delivery realtime update status.
 */
@Component({
  selector: 'app-intel-delivery-status',
  templateUrl: './intel-delivery-status.component.html',
  styleUrls: ['./intel-delivery-status.component.scss'],
})
export class IntelDeliveryStatusComponent implements OnInit, OnDestroy {
  isWebSocketConnected = false;
  subscribedOperations: string[] = [];
  openIntelDeliveriesCount?: number;

  private s: Subscription[] = [];

  constructor(private wsService: WebSocketService, private intelDeliveryService: IntelDeliveryService,
              private manualIntelDeliveryService: ManualIntelDeliveryService) {
  }

  ngOnInit(): void {
    this.s.push(this.wsService.connectedChange().subscribe(isConnected => this.isWebSocketConnected = isConnected));
    this.s.push(this.intelDeliveryService.subscribedOpenIntelDeliveryOperationsChange()
      .subscribe(subscribed => this.subscribedOperations = subscribed));
    this.s.push(this.manualIntelDeliveryService.openIntelDeliveriesChange()
      .subscribe(openIntelDeliveries => this.openIntelDeliveriesCount = openIntelDeliveries.length));
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }
}
