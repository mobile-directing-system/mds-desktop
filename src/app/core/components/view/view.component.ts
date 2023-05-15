import { Component, Input, TemplateRef } from '@angular/core';

/**
 * General component for views with optional navigation menu and optional key info bar.
 */
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  @Input() sideNav?: TemplateRef<any>;

  /**
   * Set true to show key info bar.
   */
  @Input() showKeyInfos?: boolean = false;
}
