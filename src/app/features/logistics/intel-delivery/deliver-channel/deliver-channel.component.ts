import { Component, Input } from '@angular/core';
import {
  DeliverChannel,
  DeliverChannelChannelInactive,
  DeliverChannelFailedAttempt,
  DeliverChannelMinImportanceNotSatisfied,
  DeliverChannelNoRecommendReason,
  DeliverChannelRecommended,
} from '../../../../core/model/intel-delivery';

@Component({
  selector: 'app-deliver-channel',
  templateUrl: './deliver-channel.component.html',
  styleUrls: ['./deliver-channel.component.scss'],
})
export class DeliverChannelComponent {
  @Input() channel?: DeliverChannel;
  @Input() highlight = false;

  /**
   * Returns the set {@link DeliverChannelRecommended} if set. Otherwise, `undefined` is returned.
   */
  getRecommendedChannel(): DeliverChannelRecommended | undefined {
    if (this.channel === undefined) {
      return undefined;
    }
    if (this.channel.noRecommendReason === undefined) {
      return this.channel;
    }
    return undefined;
  }

  /**
   * Returns the set {@link DeliverChannelMinImportanceNotSatisfied} if set. Otherwise, `undefined` is returned.
   */
  getMinImportanceNotSatisfiedChannel(): DeliverChannelMinImportanceNotSatisfied | undefined {
    if (this.channel !== undefined && this.channel.noRecommendReason === DeliverChannelNoRecommendReason.MinImportanceNotSatisfied) {
      return this.channel;
    }
    return undefined;
  }

  /**
   * Returns the set {@link DeliverChannelFailedAttempt} if set. Otherwise, `undefined` is returned.
   */
  getFailedAttemptChannel(): DeliverChannelFailedAttempt | undefined {
    if (this.channel !== undefined && this.channel.noRecommendReason === DeliverChannelNoRecommendReason.FailedAttempt) {
      return this.channel;
    }
    return undefined;
  }

  /**
   * Returns the set {@link DeliverChannelChannelInactive} if set. Otherwise, `undefined` is returned.
   */
  getInactiveChannelChannel(): DeliverChannelChannelInactive | undefined {
    if (this.channel !== undefined && this.channel.noRecommendReason === DeliverChannelNoRecommendReason.ChannelInactive) {
      return this.channel;
    }
    return undefined;
  }
}
