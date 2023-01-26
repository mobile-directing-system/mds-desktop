import { Component } from '@angular/core';
import { Location } from '@angular/common';

/**
 * View that the user is redirected to when accessing a resource with insufficient permissions.
 */
@Component({
  selector: 'app-missing-permissions-view',
  templateUrl: './missing-permissions-view.component.html',
  styleUrls: ['./missing-permissions-view.component.scss'],
})
export class MissingPermissionsView {
  constructor(private location: Location) {
  }

  /**
   * Navigates to the previous page.
   */
  navigateBack(): void {
    this.location.back();
  }
}
