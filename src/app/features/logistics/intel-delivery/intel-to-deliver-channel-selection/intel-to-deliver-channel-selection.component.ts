import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  DetailedOpenIntelDelivery,
  ManualIntelDeliveryService,
} from '../../../../core/services/manual-intel-delivery.service';
import { ChannelService } from '../../../../core/services/channel.service';
import { IntelDeliveryService } from '../../../../core/services/intel-delivery.service';
import { Channel } from '../../../../core/model/channel';
import { forkJoin, of, Subscription, switchMap, tap } from 'rxjs';
import {
  DeliverChannel,
  DeliverChannelNoRecommendReason,
  IntelDeliveryAttempt,
} from '../../../../core/model/intel-delivery';
import { Loader } from '../../../../core/util/loader';

/**
 * Takes an array. Results of elements, that match the given function, are pushed to the provided {@link moveTo}-list.
 * Otherwise, they are being added the returned list.
 * @param from Elements to filter and move.
 * @param moveTo Results of elements that match the {@link move}-function are pushed to this array.
 * @param move The function to check elements of {@link from} against. If the function returns an element, it is
 *   pushed to {@link move}. Otherwise, the checked one is pushed to the returned list.
 * @return List of elements that did not match the given {@link move}-function.
 */
function moveTo<T>(from: T[], moveTo: T[], move: (t: T) => T | undefined): T[] {
  const without: T[] = [];
  from.forEach(t => {
    let toMove = move(t);
    if (toMove) {
      moveTo.push(toMove);
    } else {
      without.push(t);
    }
  });
  return without;
}

@Component({
  selector: 'app-intel-to-deliver-channel-selection',
  templateUrl: './intel-to-deliver-channel-selection.component.html',
  styleUrls: ['./intel-to-deliver-channel-selection.component.scss'],
})
export class IntelToDeliverChannelSelectionComponent implements OnInit, OnDestroy {
  loader = new Loader();
  /**
   * Id of the delivery that is currently selected.
   */
  deliveryId?: string;
  recommendedChannels?: DeliverChannel[];
  otherChannels?: DeliverChannel[];
  isFocused = false;
  /**
   * Channel id of the currently selected channel.
   */
  selected?: string;
  /**
   * List of all selectable channel ids in correct order. Build using {@link offerChannelSelection}.
   * @private
   */
  private selectionLinks: string[] = [];

  private s: Subscription[] = [];

  constructor(private manualIntelDeliveryService: ManualIntelDeliveryService, private channelService: ChannelService,
              private intelDeliveryService: IntelDeliveryService) {
  }

  ngOnInit(): void {
    this.s.push(this.manualIntelDeliveryService.selectedChange().pipe(
      tap(() => this.clear()),
      switchMap((selected: DetailedOpenIntelDelivery | undefined) => {
        if (!selected) {
          return of(undefined);
        }
        return this.loader.load(forkJoin({
          selected: of(selected),
          attempts: this.intelDeliveryService.getIntelDeliveryAttemptsByDelivery(selected.delivery.delivery.id),
          channels: this.channelService.getChannelsByAddressBookEntry(selected.delivery.delivery.to),
        }));
      }),
    ).subscribe(res => {
      if (!res) {
        return;
      }
      this.offerChannelSelection(res.selected, res.channels, res.attempts);
    }));
  }

  private clear(): void {
    this.deliveryId = undefined;
    this.selected = undefined;
    this.recommendedChannels = undefined;
    this.otherChannels = undefined;
  }

  private offerChannelSelection(selected: DetailedOpenIntelDelivery, channels: Channel[], attempts: IntelDeliveryAttempt[]): void {
    this.otherChannels = [];
    // On start, we treat all channels as recommended and only sort them by priority.
    this.recommendedChannels = channels.map((c: Channel): DeliverChannel => ({
      channel: c,
      noRecommendReason: undefined,
      details: undefined,
    }));
    this.recommendedChannels.sort((a, b) => b.channel.priority - a.channel.priority);
    // Move channels that do not meet minimum importance.
    this.recommendedChannels = moveTo(this.recommendedChannels.map(c => c), this.otherChannels, (c: DeliverChannel) => {
      if (selected.delivery.intel.importance >= c.channel.minImportance) {
        return undefined;
      }
      const noRecommend: DeliverChannel = {
        channel: c.channel,
        noRecommendReason: DeliverChannelNoRecommendReason.MinImportanceNotSatisfied,
        details: {
          intelImportance: selected.delivery.intel.importance,
          channelMinImportance: c.channel.minImportance,
        },
      };
      return noRecommend;
    });
    // Move channels that do already had failed attempts in the past.
    this.recommendedChannels = moveTo(this.recommendedChannels.map(c => c), this.otherChannels, (c: DeliverChannel) => {
      const failedAttempts = attempts.filter(a => a.channel === c.channel.id);
      if (failedAttempts.length === 0) {
        return undefined;
      }
      failedAttempts.sort((a, b) => b.statusTS.getTime() - a.statusTS.getTime());
      const noRecommend: DeliverChannel = {
        channel: c.channel,
        noRecommendReason: DeliverChannelNoRecommendReason.FailedAttempt,
        details: {
          attempt: failedAttempts[0],
        },
      };
      return noRecommend;
    });
    // Move inactive channels.
    this.recommendedChannels = moveTo(this.recommendedChannels.map(c => c), this.otherChannels, (c: DeliverChannel) => {
      if (c.channel.isActive) {
        return undefined;
      }
      const noRecommend: DeliverChannel = {
        channel: c.channel,
        noRecommendReason: DeliverChannelNoRecommendReason.ChannelInactive,
        details: {},
      };
      return noRecommend;
    });
    // Build selection links.
    this.selectionLinks = [];
    this.recommendedChannels.forEach(c => this.selectionLinks.push(c.channel.id!));
    this.otherChannels.forEach(c => this.selectionLinks.push(c.channel.id!));
    // Select.
    if (this.recommendedChannels.length > 0) {
      this.selected = this.recommendedChannels[0].channel.id;
    } else if (this.otherChannels.length > 0) {
      this.selected = this.otherChannels[0].channel.id;
    } else {
      this.selected = undefined;
    }
    this.deliveryId = selected.delivery.delivery.id;
  }

  select(channelId: string | undefined): void {
    this.selected = channelId;
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  selectNext(): void {
    if (this.selected === undefined) {
      return;
    }
    const index = this.selectionLinks.findIndex(c => c === this.selected);
    if (index === -1) {
      return;
    }
    if (index >= this.selectionLinks.length - 1) {
      // End reached.
      return;
    }
    this.selected = this.selectionLinks[index + 1];
  }

  selectPrev(): void {
    if (this.selected === undefined) {
      return;
    }
    const index = this.selectionLinks.findIndex(c => c === this.selected);
    if (index === -1) {
      return;
    }
    if (index == 0) {
      // Start reached.
      return;
    }
    this.selected = this.selectionLinks[index - 1];
  }

  /**
   * Schedules the actual delivery attempt for the currently selected delivery via the selected channel.
   */
  deliver(): void {
    if (!this.isFocused || this.selected === undefined || this.deliveryId === undefined) {
      return;
    }
    this.loader.take(this.intelDeliveryService.scheduleDeliveryAttempt(this.deliveryId, this.selected)
      .subscribe(() => this.clear()));
    this.manualIntelDeliveryService.removeDeliveryAndSelectNext(this.deliveryId);
  }

  selectFirst(): void {
    this.selected = this.selectionLinks.length > 0 ? this.selectionLinks[0] : undefined;
  }
}
