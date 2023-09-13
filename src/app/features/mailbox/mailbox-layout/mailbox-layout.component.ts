import { Component } from '@angular/core';
import {AuthService} from "../../../core/services/auth.service";
import {Group} from "../../../core/model/group";

@Component({
  selector: 'app-mailbox-layout',
  templateUrl: './mailbox-layout.component.html',
  styleUrls: ['./mailbox-layout.component.scss'],
})
export class MailboxLayoutComponent {
  constructor(private authService: AuthService) {
    this.getRole()
  }

  loggedInRole: (Group | undefined | null) = undefined;

  getRole() {
    this.authService.loggedInRole().subscribe(next => this.loggedInRole = next)
  }
}

