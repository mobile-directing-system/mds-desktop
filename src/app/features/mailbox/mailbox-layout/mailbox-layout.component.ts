import { Component } from '@angular/core';
import {MessageService} from "../../../core/services/message/message.service";
import {OperationService} from "../../../core/services/operation.service";
import {ResourceService} from "../../../core/services/resource/resource.service";
import {GroupService, GroupSort} from "../../../core/services/group.service";
import {IncidentService} from "../../../core/services/incident/incident.service";
import {AddressBookService} from "../../../core/services/addressbook.service";
import {AuthService} from "../../../core/services/auth.service";
import {Router} from "@angular/router";
import {Message, MessageDirection, Participant} from "../../../core/model/message";
import {ChannelType} from "../../../core/model/channel";
import {PaginationParams} from "../../../core/util/store";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-mailbox-layout',
  templateUrl: './mailbox-layout.component.html',
  styleUrls: ['./mailbox-layout.component.scss'],
})
export class MailboxLayoutComponent {
  constructor(private messageService: MessageService, private operationService: OperationService, private resourceService: ResourceService,
              private groupService: GroupService, private incidentService: IncidentService, private addressBookService: AddressBookService, private authService: AuthService, private router: Router) {
  }

  getRole() {
    let loggedInUserId = this.authService.loggedInUser();
    let paginationParams: PaginationParams<GroupSort> = new PaginationParams<GroupSort>(1,0);
    return this.groupService.getGroups(paginationParams,{userId: loggedInUserId}).pipe(map(paginatedGroups=>{
      if(paginatedGroups.entries.length > 0){
        return paginatedGroups.entries[0];
      }else return undefined
    }));
  }
}

