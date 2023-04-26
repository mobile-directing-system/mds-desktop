import { Injectable } from '@angular/core';
import { DetailedOpenIntelDelivery, ManualIntelDeliveryService } from './manual-intel-delivery.service';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Mocks {@link ManualIntelDeliveryService}.
 */
@Injectable({
  providedIn: 'root',
})
export class ManualIntelDeliveryMockService {
  openIntelDeliveriesByAge = new BehaviorSubject<DetailedOpenIntelDelivery[]>([]);
  openIntelDeliveriesByImportance = new BehaviorSubject<DetailedOpenIntelDelivery[]>([]);
  openIntelDeliveries = new BehaviorSubject<DetailedOpenIntelDelivery[]>([]);
  selected = new BehaviorSubject<DetailedOpenIntelDelivery | undefined>(undefined);

  openIntelDeliveriesByAgeChange(): Observable<DetailedOpenIntelDelivery[]> {
    return this.openIntelDeliveriesByAge.asObservable();
  }

  openIntelDeliveriesByImportanceChange(): Observable<DetailedOpenIntelDelivery[]> {
    return this.openIntelDeliveriesByImportance.asObservable();
  }

  openIntelDeliveriesChange(): Observable<DetailedOpenIntelDelivery[]> {
    return this.openIntelDeliveries.asObservable();
  }

  removeDeliveryAndSelectNext(deliveryId: string): void {
    // Not mocked.
  }

  select(deliveryId: string): void {
    // Not mocked.
  }

  selectedChange(): Observable<DetailedOpenIntelDelivery | undefined> {
    return this.selected.asObservable();
  }

  subscribeForOperation(operationId: string): void {
    // Not mocked.
  }

  unsubscribeForOperation(operationId: string): void {
    // Not mocked.
  }
}
