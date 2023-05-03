import { Component, Input } from '@angular/core';
import { AnalogRadioMessageIntelContent } from '../../../model/intel';

@Component({
  selector: 'app-analog-radio-message-summary',
  templateUrl: './analog-radio-message-summary.component.html',
  styleUrls: ['./analog-radio-message-summary.component.scss'],
})
export class AnalogRadioMessageSummaryComponent {
  @Input() content?: AnalogRadioMessageIntelContent;
}
