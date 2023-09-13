import { Component } from '@angular/core';
import {AuthService} from "../../../core/services/auth.service";
import {Group} from "../../../core/model/group";

/**
 * Layout for the mailbox. Loads other components.
 */
@Component({
  selector: 'app-mailbox-layout',
  templateUrl: './mailbox-layout.component.html',
  styleUrls: ['./mailbox-layout.component.scss'],
})
export class MailboxLayoutComponent {
  constructor(private authService: AuthService) {
    this.getRole()
  }

  /**
   * Role of the logged-in user. Undefined or null when the user has no role assigned yet
   */
  loggedInRole: (Group | undefined | null) = undefined;


  /**
   * Loads the role of the logged-in user and sets the loggedInRole filed accordingly
   */
  getRole() {
    this.authService.loggedInRole().subscribe(next => this.loggedInRole = next)
  }
}

