import { Component, Input, TemplateRef } from '@angular/core';

/**
 * General component for views with optional navigation menu.
 */
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  @Input() sideNav?: TemplateRef<any>;
}
