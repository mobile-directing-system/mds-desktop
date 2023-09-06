import { Component } from '@angular/core';
import {GroupService, GroupSort} from "../../../core/services/group.service";
import {AuthService} from "../../../core/services/auth.service";
import {Router} from "@angular/router";
import {PaginationParams} from "../../../core/util/store";
import {Group} from "../../../core/model/group";

@Component({
  selector: 'app-mailbox-layout',
  templateUrl: './mailbox-layout.component.html',
  styleUrls: ['./mailbox-layout.component.scss'],
})
export class MailboxLayoutComponent {
  constructor(
              private groupService: GroupService, private authService: AuthService, private router: Router) {
    this.getRole()
  }

  loggedInRole: (Group | undefined | null) = undefined;

  getRole() {
    let loggedInUserId = this.authService.loggedInUser();
    let paginationParams: PaginationParams<GroupSort> = new PaginationParams<GroupSort>(1,0);
    this.groupService.getGroups(paginationParams,{userId: loggedInUserId}).subscribe(paginatedGroups=> {
      if(paginatedGroups.entries.length > 0){
            this.loggedInRole = paginatedGroups.entries[0];
      }else{
        this.loggedInRole = null;
      }
    });
  }
}

