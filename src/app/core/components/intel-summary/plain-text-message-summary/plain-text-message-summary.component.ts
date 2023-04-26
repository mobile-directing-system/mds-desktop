import { Component, Input } from '@angular/core';
import { PlaintextMessageIntelContent } from '../../../model/intel';

@Component({
  selector: 'app-plain-text-message-summary',
  templateUrl: './plain-text-message-summary.component.html',
  styleUrls: ['./plain-text-message-summary.component.scss']
})
export class PlainTextMessageSummaryComponent {
  @Input() content?: PlaintextMessageIntelContent;
}
