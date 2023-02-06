import { Component, Input } from '@angular/core';
import { Importance } from '../../model/importance';

@Component({
  selector: 'app-importance-inline',
  templateUrl: './importance-inline.component.html',
  styleUrls: ['./importance-inline.component.scss'],
})
export class ImportanceInlineComponent {
  Importance = Importance;
  @Input() importance?: number;
  @Input() hideTooltip = false;
}
