import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DetailedRadioDelivery, RadioDelivery} from "../../../../core/model/radio-delivery";
import * as moment from "moment/moment";
import {IntelType} from "../../../../core/model/intel";

/**
 * Component for visualising one {@link RadioDelivery}
 * 
 * @deprecated because requirements of application changed. Is replaced by {@link DeliveryItemComponent }
 */
@Component({
  selector: 'app-radio-delivery-item',
  templateUrl: './radio-delivery-item.component.html',
  styleUrls: ['./radio-delivery-item.component.scss']
})
export class RadioDeliveryItemComponent {

  /**
   * The {@link RadioDelivery} to show
   */
  @Input()
  detailedRadioDelivery!: DetailedRadioDelivery

  /**
   * Event if the user releases the {@link RadioDelivery}
   */
  @Output()
  release = new EventEmitter<void>();

  /**
   * Event if the user finishes the {@link RadioDelivery}
   */
  @Output()
  finish = new EventEmitter<boolean>();

  fromNow(d : Date): string {
    return moment(d).fromNow()
  }

  protected readonly IntelType = IntelType;
}
