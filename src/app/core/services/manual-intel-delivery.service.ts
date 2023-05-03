import { Injectable, OnDestroy } from '@angular/core';
import { IntelDeliveryService } from './intel-delivery.service';
import { IntelDeliveryAttempt, OpenIntelDelivery } from '../model/intel-delivery';
import { SingletonSubscriber } from '../util/singleton-subscriber';
import { BehaviorSubject, forkJoin, interval, Observable, Subscription, tap } from 'rxjs';
import { IntelService } from './intel.service';
import { Importance } from '../model/importance';
import { AddressBookService } from './addressbook.service';
import { ChannelService } from './channel.service';
import { UserService } from './user.service';
import { Operation } from '../model/operation';
import { User } from '../model/user';
import { AddressBookEntry } from '../model/address-book-entry';
import { CachedRetriever, InMemoryCache } from '../util/cache';
import { OperationService } from './operation.service';
import { mapMDSForbiddenErrorTo, MDSError, MDSErrorCode } from '../util/errors';
import { map } from 'rxjs/operators';
import { Intel } from '../model/intel';
import * as moment from 'moment';
import { Channel } from '../model/channel';

const IntelCacheClearPeriod = moment.duration({ minute: 1 });
const IntelCacheClearMinAge = moment.duration({ minute: 10 });

/**
 * Detailed summary for {@link OpenIntelDelivery}. If fields are `undefined`, they are still pending. If they are
 * `null`, no information is available (or visible based on permissions).
 */
export interface DetailedOpenIntelDelivery {
  delivery: OpenIntelDelivery;
  operation?: Operation | null;
  intelCreator?: User | null;
  recipientEntry?: AddressBookEntry | null;
  intel?: Intel | null;
  attempts?: IntelDeliveryAttempt[] | null;
  recipientChannels?: Channel[] | null;
}

/**
 * Strategy to use with {@link AutoSelector}.
 */
enum Strategy {
  ByImportance,
  ByCreationAge,
}

/**
 * Provides {@link selectNext} that picks the next appropriate {@link OpenIntelDelivery} from the list of given ones.
 *
 * **Warning**: There is a potential issue where some intel deliveries might starve: An "old" intel is selected and a
 * delivery attempted over a channel that fails rather fast. If a delivery for a newer intel with low priority is open,
 * it might not get selected because of low priority and delivery for the older intel failing repeatedly and therefore
 * getting selected instead of the one with newer intel.
 */
class AutoSelector {
  /**
   * Selection history in descending order (newest first).
   * @private
   */
  private history: Strategy[] = [];
  /**
   * Minimum importance of intel in order to always pick the one with the highest priority.
   */
  readonly minPrio1Importance: Importance = Importance.Urgent;

  private logSelection(selection: Strategy): void {
    this.history.unshift(selection);
    const keep = 50;
    this.history.splice(keep);
  }

  /**
   * Selects the next {@link OpenIntelDelivery} from the given ones by applying an appropriate pick-strategy.
   * Deliveries with intel with minimum importance of {@link minPrio1Importance} are always prioritized.
   * @param openIntelDeliveries The list of deliveries to pick from.
   */
  selectNext(openIntelDeliveries: OpenIntelDelivery[]): OpenIntelDelivery | undefined {
    // Check if open ones available.
    if (openIntelDeliveries.length === 0) {
      return undefined;
    }
    // Check if we have a priority overwrite.
    const priorityOverwrite = openIntelDeliveries.some(d => d.intel.importance >= this.minPrio1Importance);
    if (priorityOverwrite) {
      this.logSelection(Strategy.ByImportance);
      return AutoSelector.pick(openIntelDeliveries, Strategy.ByImportance);
    }
    // Decide which pick-strategy to use. Choose importance with higher priority than age.
    let strategies: {
      strategy: Strategy;
      priority: number;
    }[] = [
      {
        strategy: Strategy.ByImportance,
        priority: 2,
      },
      {
        strategy: Strategy.ByCreationAge,
        priority: 1,
      },
    ];
    let strategy = Strategy.ByImportance;
    for (let selection of this.history) {
      strategies = strategies.map(s => {
        if (s.strategy !== selection) {
          return s;
        }
        return {
          ...s,
          priority: s.priority - 1,
        };
      });
      // Check if we have a final winner.
      let winners = strategies.filter(s => s.priority > 0);
      if (winners.length === 0) {
        // Should not happen.
        break;
      } else if (winners.length === 1) {
        strategy = winners[0].strategy;
        break;
      }
    }
    // Pick.
    const picked = AutoSelector.pick(openIntelDeliveries, strategy);
    if (picked) {
      this.logSelection(strategy);
    }
    return picked;
  }

  static pick(openIntelDeliveries: OpenIntelDelivery[], strategy: Strategy): OpenIntelDelivery | undefined {
    if (openIntelDeliveries.length === 0) {
      return undefined;
    }
    const orderPriorities: {
      strategy: Strategy,
      sortFn: (a: OpenIntelDelivery, b: OpenIntelDelivery) => number
    }[] = [
      {
        strategy: Strategy.ByImportance,
        sortFn: (a, b) => b.intel.importance - a.intel.importance,
      },
      {
        strategy: Strategy.ByCreationAge,
        sortFn: (a, b) => b.intel.createdAt.getTime() - a.intel.createdAt.getTime(),
      },
    ];
    // Add given strategy as prio 1.
    const priority = orderPriorities.find(s => s.strategy === strategy);
    if (!priority) {
      throw new MDSError(MDSErrorCode.AppError, `could not find order function for strategy '${ strategy }'`);
    }
    orderPriorities.unshift(priority);
    // Select.
    const ordered = openIntelDeliveries.map(d => d).sort((a, b): number => {
      for (let orderPriority of orderPriorities) {
        const cmp = orderPriority.sortFn(a, b);
        if (cmp !== 0) {
          return cmp;
        }
      }
      return 0;
    });
    return ordered[0];
  }
}

/**
 * Service for centralized management of manual intel delivery.
 */
@Injectable({
  providedIn: 'root',
})
export class ManualIntelDeliveryService implements OnDestroy {
  /**
   * Currently open intel deliveries from {@link _subscribeForOperation}.
   */
  private openIntelDeliveries = new BehaviorSubject<DetailedOpenIntelDelivery[]>([]);
  private openIntelDeliveriesByImportance = new BehaviorSubject<DetailedOpenIntelDelivery[]>([]);
  private openIntelDeliveriesByAge = new BehaviorSubject<DetailedOpenIntelDelivery[]>([]);
  /**
   * A {@link SingletonSubscriber} for subscribing to {@link IntelDeliveryService}.
   * @private
   */
  private operationSubscriptions = new SingletonSubscriber(operation => this._subscribeForOperation(operation));
  /**
   * Selector for auto selecting the next delivery.
   * @private
   */
  private autoSelector: AutoSelector = new AutoSelector();
  private selected = new BehaviorSubject<DetailedOpenIntelDelivery | undefined>(undefined);

  /**
   * Cache for {@link Operation} using operation id as key.
   * @private
   */
  private operationCache = new CachedRetriever(new InMemoryCache(),
    (operationId: string) => this.operationService.getOperationById(operationId)
      .pipe(mapMDSForbiddenErrorTo(null)));
  /**
   * Cache for {@link User} using user id as key.
   * @private
   */
  private userCache = new CachedRetriever(new InMemoryCache(),
    (userId: string) => this.userService.getUserById(userId)
      .pipe(mapMDSForbiddenErrorTo(null)));
  /**
   * Cache for {@link AddressBookEntry} using entry id as key.
   * @private
   */
  private addressBookEntryCache = new CachedRetriever(new InMemoryCache(),
    (entryId: string) => this.addressBookService.getAddressBookEntryById(entryId)
      .pipe(mapMDSForbiddenErrorTo(null)));
  /**
   * Cache for {@link Intel} using intel id as key.
   * @private
   */
  private intelCache = new CachedRetriever(new InMemoryCache(),
    (intelId: string) => this.intelService.getIntelById(intelId)
      .pipe(mapMDSForbiddenErrorTo(null)));

  private s: Subscription[] = [];

  constructor(private intelDeliveryService: IntelDeliveryService, private intelService: IntelService,
              private addressBookService: AddressBookService, private channelService: ChannelService,
              private userService: UserService, private operationService: OperationService) {
    this.s.push(interval(IntelCacheClearPeriod.asMilliseconds())
      .subscribe(() => this.intelCache.invalidateAllOlderThan(IntelCacheClearMinAge)));
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  /**
   * Performs the actual subscription for open intel deliveries for the given operation as well as handling retrieved
   * data using {@link handleNewOpenIntelDeliveriesForOperation}. This is separated from {@link subscribeForOperation}
   * in order to avoid multiple subscriptions for the same operation. Therefore, this is only used in
   * {@link operationSubscriptions}.
   * @param operationId The operation to subscribe to open intel deliveries for.
   * @private
   */
  private _subscribeForOperation(operationId: string): Subscription {
    return this.intelDeliveryService.getOpenIntelDeliveries(operationId)
      .subscribe(openIntelDeliveriesForOperation => {
        this.handleNewOpenIntelDeliveriesForOperation(openIntelDeliveriesForOperation, operationId);
      });
  }

  /**
   * Handles new open intel deliveries for the given operation id. This includes replacing outdated ones, sorting,
   * emitting updated values and potentially selecting the next open intel delivery.
   * @param openIntelDeliveriesForOperation The updated open intel deliveries for the given operation.
   * @param operationId The id of the operation, the updated open intel deliveries are for. This is required in order
   *   to not touch any open intel deliveries for other operations.
   * @private
   */
  private handleNewOpenIntelDeliveriesForOperation(openIntelDeliveriesForOperation: OpenIntelDelivery[], operationId: string): void {
    // Clear open intel deliveries for this operation.
    const updatedOpenIntelDeliveries = [
      // Add old ones but exclude deliveries for this operation id.
      ...this.openIntelDeliveries.getValue().filter(d => d.delivery.intel.operation !== operationId),
      // Add new ones and begin details-retrieval.
      ...openIntelDeliveriesForOperation.map(d => {
        const detailed: DetailedOpenIntelDelivery = {
          delivery: d,
        };
        this.fillDetailedOpenIntelDelivery(detailed).subscribe();
        return detailed;
      }),
    ];
    this.openIntelDeliveries.next(updatedOpenIntelDeliveries);
    // Add new ones and publish sorted.
    this.openIntelDeliveriesByImportance.next(updatedOpenIntelDeliveries.map(d => d)
      .sort((a, b) => {
        return b.delivery.intel.importance - a.delivery.intel.importance;
      }));
    this.openIntelDeliveriesByAge.next(updatedOpenIntelDeliveries.map(d => d)
      .sort((a, b) => {
        return a.delivery.intel.createdAt.getTime() - b.delivery.intel.createdAt.getTime();
      }));
    this.assureSelectedDeliveryValidOrAutoSelect();
  }

  /**
   * Returns an {@link Observable} that, if subscribed, fills the given {@link DetailedOpenIntelDelivery} with details.
   * @param delivery The delivery to fill with details.
   * @private
   */
  private fillDetailedOpenIntelDelivery(delivery: DetailedOpenIntelDelivery): Observable<void> {
    return forkJoin([
      this.operationCache.get(delivery.delivery.intel.operation)
        .pipe(tap(operation => delivery.operation = operation)),
      this.userCache.get(delivery.delivery.intel.createdBy)
        .pipe(tap(intelCreator => delivery.intelCreator = intelCreator)),
      this.addressBookEntryCache.get(delivery.delivery.delivery.to)
        .pipe(tap(recipientEntry => delivery.recipientEntry = recipientEntry)),
      this.intelCache.get(delivery.delivery.intel.id)
        .pipe(tap(intel => delivery.intel = intel)),
    ]).pipe(map(_ => void 0));
  }

  /**
   * Checks if there is currently a selection and if so, if it's still open for delivery. Otherwise, the next one is
   * auto selected.
   * @private
   */
  private assureSelectedDeliveryValidOrAutoSelect(): void {
    const selected = this.selected.getValue();
    if (!selected || !this.openIntelDeliveries.getValue().some(d => d.delivery.delivery.id == selected.delivery.delivery.id)) {
      this.autoSelect();
    }
  }

  /**
   * Auto selects the next open intel delivery from {@link openIntelDeliveries} using {@link autoSelector}.
   * @private
   */
  private autoSelect(): void {
    const selected = this.autoSelector.selectNext(this.openIntelDeliveries.getValue().map(d => d.delivery));
    if (!selected) {
      this.clearSelection();
      return;
    }
    this.select(selected.delivery.id);
  }

  private clearSelection(): void {
    this.selected.next(undefined);
  }

  /**
   * Selects the delivery with the given id. Ignored if the one is not found in open ones.
   * @param deliveryId The id of the open delivery to select.
   */
  select(deliveryId: string): void {
    const openIntelDelivery = this.openIntelDeliveries.getValue().find(d => d.delivery.delivery.id === deliveryId);
    if (!openIntelDelivery) {
      return;
    }
    this.intelDeliveryService.getIntelDeliveryAttemptsByDelivery(openIntelDelivery.delivery.delivery.id)
      .subscribe(attempts => {
        attempts.sort((a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime());
        openIntelDelivery.attempts = attempts;
      });
    this.channelService.getChannelsByAddressBookEntry(openIntelDelivery.delivery.delivery.to)
      .subscribe(channels => openIntelDelivery.recipientChannels = channels);
    this.selected.next(openIntelDelivery);
  }

  /**
   * Selects the next intel delivery. This is meant for when the currently selected one is expected to be unvavailable
   * for delivery in the near future as a result of a new scheduled attempt, being cancelled, etc.
   */
  removeDeliveryAndSelectNext(deliveryId: string): void {
    const deliveryToRemove = this.openIntelDeliveries.getValue().find(d => d.delivery.delivery.id === deliveryId);
    if (!deliveryToRemove) {
      return;
    }
    const deliveriesWithoutOneToRemove = this.openIntelDeliveries.getValue()
      .filter(d => d.delivery.delivery.id !== deliveryId)
      .map(d => d.delivery);
    this.handleNewOpenIntelDeliveriesForOperation(deliveriesWithoutOneToRemove, deliveryToRemove.delivery.intel.operation);
  }

  /**
   * Begins subscribing to open intel deliveries for the operation with the given id. Remember calling
   * {@link unsubscribeForOperation}, if you no longer want updates.
   * @param operationId The id of the operation to subscribe to open intel deliveries for.
   */
  subscribeForOperation(operationId: string): void {
    this.operationSubscriptions.subscribe(operationId);
  }

  /**
   * Unsubscribes from open intel deliveries if all calls to {@link subscribeForOperation} resulted in a call to this
   * method.
   * @param operationId The id of the operation to unsubscribe from.
   */
  unsubscribeForOperation(operationId: string): void {
    this.operationSubscriptions.unsubscribe(operationId);
  }

  /**
   * Receives updates about open intel deliveries. If you want them sorted by importance or age, see
   * {@link openIntelDeliveriesByImportance} and {@link openIntelDeliveriesByAge}.
   */
  openIntelDeliveriesChange(): Observable<DetailedOpenIntelDelivery[]> {
    return this.openIntelDeliveries.asObservable();
  }

  /**
   * Receives updates about available open intel deliveries, sorted by importance.
   */
  openIntelDeliveriesByImportanceChange(): Observable<DetailedOpenIntelDelivery[]> {
    return this.openIntelDeliveriesByImportance.asObservable();
  }

  /**
   * Receives updates about available open intel deliveries, sorted by intel age.
   */
  openIntelDeliveriesByAgeChange(): Observable<DetailedOpenIntelDelivery[]> {
    return this.openIntelDeliveriesByAge.asObservable();
  }

  /**
   * Emits the currently selected delivery.
   */
  selectedChange(): Observable<DetailedOpenIntelDelivery | undefined> {
    return this.selected.asObservable();
  }
}
