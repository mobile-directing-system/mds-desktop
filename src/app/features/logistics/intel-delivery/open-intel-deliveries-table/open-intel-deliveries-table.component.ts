import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DetailedOpenIntelDelivery } from '../../../../core/services/manual-intel-delivery.service';

/**
 * Table for displaying open intel deliveries in manual intel delivery view.
 */
@Component({
  selector: 'app-open-intel-deliveries-table',
  templateUrl: './open-intel-deliveries-table.component.html',
  styleUrls: ['./open-intel-deliveries-table.component.scss'],
})
export class OpenIntelDeliveriesTableComponent {
  _openIntelDeliveries: DetailedOpenIntelDelivery[] = [];
  @Input() set openIntelDeliveries(openIntelDeliveries: DetailedOpenIntelDelivery[] | null) {
    if (openIntelDeliveries === null) {
      this._openIntelDeliveries = [];
    } else {
      this._openIntelDeliveries = openIntelDeliveries;
    }
  }

  @Input()
  selected?: DetailedOpenIntelDelivery;

  /**
   * Emits when an open delivery is selected. The emitted value is the delivery id.
   */
  @Output() deliverySelected = new EventEmitter<string>();
  deliverSelectedId? : string;

  readonly columns = ['intelCreatedAt', 'intelCreatedBy', 'deliveryTo', 'intelType', 'intelImportance'];

  asDetailedOpenIntelDelivery(d: DetailedOpenIntelDelivery): DetailedOpenIntelDelivery {
    return d;
  }

  /**
   * Selects the open intel delivery with the given id by emitting the selection via {@link deliverySelected}.
   * @param deliveryId The id of the delivery to select.
   */
  selectOpenIntelDelivery(deliveryId: string): void {
    this.deliverSelectedId = deliveryId;
    this.deliverySelected.next(deliveryId);
  }
}
