import { Component, Input, TemplateRef } from '@angular/core';
import {KeyInfoEntry} from "../key-info-bar/key-info-bar.component";

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
  @Input() keyInfos?: (KeyInfoEntry | null)[];
}
