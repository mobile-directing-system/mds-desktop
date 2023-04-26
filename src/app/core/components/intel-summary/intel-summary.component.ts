import { Component, Input } from '@angular/core';
import { AnalogRadioMessageIntel, Intel, IntelType, PlaintextMessageIntel } from '../../model/intel';

@Component({
  selector: 'app-intel-summary',
  templateUrl: './intel-summary.component.html',
  styleUrls: ['./intel-summary.component.scss'],
})
export class IntelSummaryComponent {
  @Input() intel?: Intel;
  protected readonly IntelType = IntelType;

  plainTextMessage(): PlaintextMessageIntel | undefined {
    if (!this.intel || this.intel.type !== IntelType.PlainTextMessage) {
      return undefined;
    }
    return this.intel;
  }

  analogRadioMessage(): AnalogRadioMessageIntel | undefined {
    if (!this.intel || this.intel.type !== IntelType.AnalogRadioMessage) {
      return undefined;
    }
    return this.intel;
  }
}
