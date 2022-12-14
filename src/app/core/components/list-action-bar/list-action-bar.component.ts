import { Component, Input, TemplateRef } from '@angular/core';

/**
 * Action bar for displaying above lists.
 */
@Component({
  selector: 'app-list-action-bar',
  templateUrl: './list-action-bar.component.html',
  styleUrls: ['./list-action-bar.component.scss'],
})
export class ListActionBarComponent {
  /**
   * Optional template to display at end (left) of the bar.
   */
  @Input() end?: TemplateRef<any>;
}
