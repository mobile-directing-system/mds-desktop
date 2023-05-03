import { Component, Input } from '@angular/core';
import { IntelType } from '../../model/intel';

/**
 * Displays an {@link IntelType} inline.
 */
@Component({
  selector: 'app-intel-type-inline',
  templateUrl: './intel-type-inline.component.html',
  styleUrls: ['./intel-type-inline.component.scss'],
})
export class IntelTypeInlineComponent {
  IntelType = IntelType;
  @Input() intelType?: IntelType;
  @Input() hideTooltip = false;
}
