import { Injectable } from '@angular/core';
import { NetService } from './net.service';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import {
  OpenIntelDeliveriesChannelMessage,
  OpenIntelDeliveriesMessage,
  SubscribeOpenIntelDeliveriesMessage,
  UnsubscribeOpenIntelDeliveriesMessage,
} from '../ws-message/open-intel-delivery-notifier';
import { IntelDeliveryAttempt, IntelDeliveryAttemptStatus, OpenIntelDelivery } from '../model/intel-delivery';
import { WebSocketService } from './web-socket.service';
import { Channel } from '../ws-message/ws-message';
import urlJoin from 'url-join';
import { map } from 'rxjs/operators';
import { Paginated, PaginationParams } from '../util/store';
import { NetPaginated, netPaginationParams, NetPaginationParams, paginatedFromNet } from '../util/net';

interface OpenIntelDeliveriesSubscription {
  subject: BehaviorSubject<OpenIntelDelivery[]>,
  subscribers: number,
}

/**
 * Filters for retrieving intel delivery attempts via {@link IntelDeliveryService.getIntelDeliveryAttempts}.
 */
export interface IntelDeliveryAttemptFilters {
  /**
   * Only includes attempts for deliveries for intel for the operation with the given id.
   */
  byOperation?: string;
  /**
   * Only includes attempts for the delivery with the given id.
   */
  byDelivery?: string;
  /**
   * Only includes attempts for the channel with the given id.
   */
  byChannel?: string;
  /**
   * Only includes attempts being (in)active.
   */
  byActive?: boolean;
}

/**
 * Net representation of {@link IntelDeliveryAttempt}.
 */
interface NetIntelDeliveryAttempt {
  id: string;
  delivery: string;
  channel: string;
  created_at: string;
  isActive: boolean;
  status: 'open' | 'awaiting-delivery' | 'delivering' | 'awaiting-ack' | 'delivered' | 'timeout' | 'canceled' | 'failed';
  status_ts: string;
  note?: string;
}

/**
 * Maps {@link NetIntelDeliveryAttempt} to {@link IntelDeliveryAttempt}.
 * @param net The attempt to map.
 */
function intelDeliveryAttemptFromNet(net: NetIntelDeliveryAttempt): IntelDeliveryAttempt {
  const a: IntelDeliveryAttempt = {
    id: net.id,
    delivery: net.delivery,
    channel: net.channel,
    createdAt: new Date(Date.parse(net.created_at)),
    isActive: net.isActive,
    status: IntelDeliveryAttemptStatus.Unknown,
    statusTS: new Date(Date.parse(net.status_ts)),
    note: net.note,
  };
  switch (net.status) {
    case 'open':
      a.status = IntelDeliveryAttemptStatus.Open;
      break;
    case 'awaiting-delivery':
      a.status = IntelDeliveryAttemptStatus.AwaitingDelivery;
      break;
    case 'delivering':
      a.status = IntelDeliveryAttemptStatus.Delivering;
      break;
    case 'awaiting-ack':
      a.status = IntelDeliveryAttemptStatus.AwaitingAck;
      break;
    case 'delivered':
      a.status = IntelDeliveryAttemptStatus.Delivered;
      break;
    case 'timeout':
      a.status = IntelDeliveryAttemptStatus.Timeout;
      break;
    case 'canceled':
      a.status = IntelDeliveryAttemptStatus.Canceled;
      break;
    case 'failed':
      a.status = IntelDeliveryAttemptStatus.Failed;
      break;
    default:
      console.error('unknown intel delivery attempt status: ' + a.status);
  }
  return a;
}

/**
 * Service for managing intel delivery.
 */
@Injectable({
  providedIn: 'root',
})
export class IntelDeliveryService {

  private _subscribedOpenIntelDeliveryOperationsChange = new BehaviorSubject<string[]>([]);

  private openIntelDeliverySubscriptionsByOperation: { [keys: string]: OpenIntelDeliveriesSubscription } = {};

  constructor(private netService: NetService, private wsService: WebSocketService) {
    this.wsService.incomingMessages().subscribe(message => {
      if (message.channel !== Channel.OpenIntelDeliveryNotifier) {
        return;
      }
      this.handleIncomingMessage(message);
    });
  }

  private handleIncomingMessage(message: OpenIntelDeliveriesChannelMessage): void {
    switch (message.payload.type) {
      case 'subscribed-open-intel-deliveries':
        this._subscribedOpenIntelDeliveryOperationsChange.next(message.payload.payload.operations);
        break;
      case 'open-intel-deliveries':
        this.handleOpenIntelDeliveriesMessage(message.payload);
        break;
    }
  }

  /**
   * Handles in incoming {@link OpenIntelDeliveriesMessage} by notifying potential subscriptions in
   * {@link openIntelDeliverySubscriptionsByOperation}.
   * @param message The message to handle.
   * @private
   */
  private handleOpenIntelDeliveriesMessage(message: OpenIntelDeliveriesMessage): void {
    const subscription = this.openIntelDeliverySubscriptionsByOperation[message.payload.operation];
    subscription?.subject.next(message.payload.open_intel_deliveries.map((netDelivery): OpenIntelDelivery => {
      return {
        delivery: {
          id: netDelivery.delivery.id,
          intel: netDelivery.delivery.intel,
          to: netDelivery.delivery.to,
          note: netDelivery.delivery.note,
        },
        intel: {
          id: netDelivery.intel.id,
          createdAt: new Date(Date.parse(netDelivery.intel.created_at)),
          createdBy: netDelivery.intel.created_by,
          operation: netDelivery.intel.operation,
          importance: netDelivery.intel.importance,
          isValid: netDelivery.intel.is_valid,
        },
      };
    }));
  }

  /**
   * Subscribes to open intel deliveries for the given operation. Don't forget to unsubscribe when no more
   * notifications are desired.
   * @param operationId The id of the operation to subscribe to for open intel delivery updates.
   */
  getOpenIntelDeliveries(operationId: string): Observable<OpenIntelDelivery[]> {
    let s = this.openIntelDeliverySubscriptionsByOperation[operationId];
    if (!s) {
      s = {
        subject: new BehaviorSubject<OpenIntelDelivery[]>([]),
        subscribers: 0,
      };
      this.subscribeOpenIntelDeliveriesByOperation(operationId);
      this.openIntelDeliverySubscriptionsByOperation[operationId] = s;
    }
    s.subscribers++;
    return s.subject.asObservable().pipe(finalize(() => {
      const s = this.openIntelDeliverySubscriptionsByOperation[operationId];
      s.subscribers--;
      // Check whether there are still other subscribers.
      if (s.subscribers > 0) {
        return;
      }
      // Unsubscribe.
      this.unsubscribeOpenIntelDeliveriesByOperation(operationId);
      delete this.openIntelDeliverySubscriptionsByOperation[operationId];
    }));
  }

  /**
   * Subscribes to open intel deliveries for the given operation id. Don't forget to call
   * {@link unsubscribeOpenIntelDeliveriesByOperation} when listening for this operation should be stopped.
   * @param operationId The operation id to listen to for open intel deliveries.
   * @private
   */
  private subscribeOpenIntelDeliveriesByOperation(operationId: string): void {
    const m: SubscribeOpenIntelDeliveriesMessage = {
      type: 'subscribe-open-intel-deliveries',
      payload: {
        operation: operationId,
      },
    };
    this.wsService.send(Channel.OpenIntelDeliveryNotifier, m);
  }

  /**
   * Unsubscribes from open intel deliveries for the given operation id.
   * @param operationId The operation id to not listen to for open intel deliveries anymore.
   * @private
   */
  private unsubscribeOpenIntelDeliveriesByOperation(operationId: string): void {
    const m: UnsubscribeOpenIntelDeliveriesMessage = {
      type: 'unsubscribe-open-intel-deliveries',
      payload: {
        operation: operationId,
      },
    };
    this.wsService.send(Channel.OpenIntelDeliveryNotifier, m);
  }

  /**
   * List of operations that open intel deliveries are subscribed for.
   */
  subscribedOpenIntelDeliveryOperationsChange(): Observable<string[]> {
    return this._subscribedOpenIntelDeliveryOperationsChange.asObservable();
  }

  /**
   * Retrieves the intel delivery attempts for the delivery with the given id.
   * @param deliveryId Id of the delivery to retrieve attempts for.
   */
  getIntelDeliveryAttemptsByDelivery(deliveryId: string): Observable<IntelDeliveryAttempt[]> {
    return this.netService.get<NetIntelDeliveryAttempt[]>(urlJoin('/intel-deliveries', deliveryId, 'attempts'), {}).pipe(
      map((res: NetIntelDeliveryAttempt[]): IntelDeliveryAttempt[] => res.map(intelDeliveryAttemptFromNet)),
    );
  }

  /**
   * Schedules a delivery attempt using the given channel.
   * @param deliveryId The id of the delivery to schedule a delivery attempt for.
   * @param channelId The id of the channel to use for delivery.
   */
  scheduleDeliveryAttempt(deliveryId: string, channelId: string): Observable<void> {
    return this.netService.post(urlJoin('/intel-deliveries', deliveryId, 'deliver', 'channel', channelId), {})
      .pipe(map(_ => void 0));
  }

  /**
   * Marks the intel delivery with the given id as delivered. If you know the attempt, use
   * {@link markDeliveryAttemptAsDelivered} for providing more useful information than this method.
   * @param deliveryId The id of the intel delivery to mark as delivered.
   */
  markDeliveryAsDelivered(deliveryId: string): Observable<void> {
    return this.netService.post(urlJoin('/intel-deliveries', deliveryId, 'delivered'), {});
  }

  /**
   * Marks the intel delivery attempt with the given id as delivered.
   * @param attemptId The id of the intel delivery attempt to mark as delivered.
   */
  markDeliveryAttemptAsDelivered(attemptId: string): Observable<void> {
    return this.netService.post(urlJoin('/intel-delivery-attempts', attemptId, 'delivered'), {});
  }

  /**
   * Cancels the intel delivery with the given id as well as all active related delivery attempts.
   * @param deliveryId The id of the delivery to cancel.
   * @param success Whether the delivery should be marked as successful.
   * @param note Optional note. It's best practise to set a descriptive node, explaining why the delivery was cancelled.
   */
  cancelIntelDeliveryById(deliveryId: string, success: boolean, note: string | undefined): Observable<void> {
    interface NetDeliveryCancellation {
      success: boolean;
      note?: string;
    }

    const body: NetDeliveryCancellation = {
      success: success,
      note: note,
    };
    return this.netService.postJSON(urlJoin('/intel-deliveries', deliveryId, 'cancel'), body, {});
  }

  /**
   * Retrieves a paginated list of intel delivery attempts with the given filters and page.
   * @param filters Attempt filters.
   * @param page Page for pagination.
   */
  getIntelDeliveryAttempts(filters: IntelDeliveryAttemptFilters, page: PaginationParams<any>): Observable<Paginated<IntelDeliveryAttempt>> {
    interface Query extends NetPaginationParams {
      by_operation?: string;
      by_delivery?: string;
      by_channel?: string;
      by_active?: boolean;
    }

    const query: Query = {
      ...netPaginationParams(page, () => undefined),
      by_operation: filters.byOperation,
      by_delivery: filters.byDelivery,
      by_channel: filters.byChannel,
      by_active: filters.byActive,
    };
    return this.netService.get<NetPaginated<NetIntelDeliveryAttempt>>('/intel-delivery-attempts', query)
      .pipe(map(net => paginatedFromNet(net, intelDeliveryAttemptFromNet)));
  }
}
