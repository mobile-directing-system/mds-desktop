import { Component } from '@angular/core';
import {GroupService} from "../../../core/services/group.service";
import {AuthService} from "../../../core/services/auth.service";
import {Router} from "@angular/router";
import {Group} from "../../../core/model/group";

@Component({
  selector: 'app-mailbox-layout',
  templateUrl: './mailbox-layout.component.html',
  styleUrls: ['./mailbox-layout.component.scss'],
})
export class MailboxLayoutComponent {
  constructor(
              private groupService: GroupService, private authService: AuthService) {
    this.getRole()
  }

  loggedInRole: (Group | undefined | null) = undefined;

  getRole() {
    this.authService.loggedInRole().subscribe(next => this.loggedInRole = next)
  }
}

