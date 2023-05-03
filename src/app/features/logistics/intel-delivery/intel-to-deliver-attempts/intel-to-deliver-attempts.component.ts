import { Component } from '@angular/core';
import {
  DetailedOpenIntelDelivery,
  ManualIntelDeliveryService,
} from '../../../../core/services/manual-intel-delivery.service';
import { from, Observable } from 'rxjs';
import * as moment from 'moment';
import { Channel } from '../../../../core/model/channel';

@Component({
  selector: 'app-intel-to-deliver-attempts',
  templateUrl: './intel-to-deliver-attempts.component.html',
  styleUrls: ['./intel-to-deliver-attempts.component.scss'],
})
export class IntelToDeliverAttemptsComponent {
  constructor(private manualIntelDeliveryService: ManualIntelDeliveryService) {
  }

  getSelected(): Observable<DetailedOpenIntelDelivery | undefined> {
    return this.manualIntelDeliveryService.selectedChange();
  }

  attemptFailedAfter(createdAt: Date, statusTS: Date): moment.Duration {
    return moment.duration({ ms: moment(statusTS).diff(moment(createdAt)) });
  }

  fromNow(d: Date): string {
    return moment(d).fromNow();
  }

  getChannelOfSelected(selected: DetailedOpenIntelDelivery, channelId: string): Channel | undefined {
    return selected.recipientChannels?.find(c => c.id === channelId);
  }

  protected readonly from = from;
}
