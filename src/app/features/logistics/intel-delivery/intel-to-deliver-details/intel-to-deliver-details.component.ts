import { Component } from '@angular/core';
import {
  DetailedOpenIntelDelivery,
  ManualIntelDeliveryService,
} from '../../../../core/services/manual-intel-delivery.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { User } from '../../../../core/model/user';

@Component({
  selector: 'app-intel-to-deliver-details',
  templateUrl: './intel-to-deliver-details.component.html',
  styleUrls: ['./intel-to-deliver-details.component.scss'],
})
export class IntelToDeliverDetailsComponent {
  constructor(private manualIntelDeliveryService: ManualIntelDeliveryService) {
  }

  getSelected(): Observable<DetailedOpenIntelDelivery | undefined> {
    return this.manualIntelDeliveryService.selectedChange();
  }

  fromNow(d : Date): string {
    return moment(d).fromNow()
  }

  formatIntelCreatorName(u: User): string {
    return `${u.firstName} ${u.lastName}`
  }
}
