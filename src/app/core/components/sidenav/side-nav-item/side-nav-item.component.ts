import { Component, Input } from '@angular/core';

/**
 * Item for usage in side nav.
 */
@Component({
  selector: 'app-side-nav-item',
  templateUrl: './side-nav-item.component.html',
  styleUrls: ['./side-nav-item.component.scss'],
})
export class SideNavItemComponent {
  @Input() icon?: string;
  @Input() link?: string[];
}
