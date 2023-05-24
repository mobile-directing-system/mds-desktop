import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DetailedRadioDelivery} from "../../../../core/model/radio-delivery";
import * as moment from "moment/moment";
import {IntelType} from "../../../../core/model/intel";

@Component({
  selector: 'app-radio-delivery-item',
  templateUrl: './radio-delivery-item.component.html',
  styleUrls: ['./radio-delivery-item.component.scss']
})
export class RadioDeliveryItemComponent {

  @Input()
  detailedRadioDelivery!: DetailedRadioDelivery

  @Output()
  release = new EventEmitter<void>();

  @Output()
  finish = new EventEmitter<boolean>();

  fromNow(d : Date): string {
    return moment(d).fromNow()
  }

  protected readonly IntelType = IntelType;
}
