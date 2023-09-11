import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {map, Observable, of} from 'rxjs';
import {IncidentService} from 'src/app/core/services/incident/incident.service';
import {getStatusCodeText} from 'src/app/core/model/resource';
import {MessageService} from "../../../core/services/message/message.service";
import {localizeChannelType} from "../../../core/model/channel";
import {Participant} from "../../../core/model/message";
import {ResourceService} from "../../../core/services/resource/resource.service";
import {AddressBookService} from "../../../core/services/addressbook.service";
import {GroupService} from "../../../core/services/group.service";
import {Group} from "../../../core/model/group";
import {MatDialog} from "@angular/material/dialog";
import {IncomingMessageComponent} from "./incoming-message/incoming-message.component";

export interface DialogData {
  messageRow: MessageRow;
  loggedInRole: Group;
  isRead: boolean;
}

export interface MessageRow {
  id: string;
  priority: number;
  createdAt: Date;
  incomingChannelType: string;
  sender: string;
  recipients: string;
  content: string;
  incident: string;
}

@Component({
  selector: 'app-incoming-messages-view',
  templateUrl: './incoming-messages-view.component.html',
  styleUrls: ['./incoming-messages-view.component.scss']
})
export class IncomingMessagesViewComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'priority', 'createdAt', 'incomingChannelType', 'sender', 'recipients', 'content', 'incident'];
  dataSource: MatTableDataSource<MessageRow> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() loggedInRole: Group | undefined;

  filterRead = false;

  constructor(private messageService: MessageService, private resourceService: ResourceService,
              private groupService: GroupService, private incidentService: IncidentService, private addressBookService: AddressBookService, private router: Router, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.refreshDataSource();
  }



  refreshDataSource() {
    if(this.loggedInRole){
      this.messageService.getMailboxMessages(this.loggedInRole.id, this.filterRead)
        .pipe(map (messages => messages.map(message => {
            let messageRow = <MessageRow>({
              id: message.id,
              priority: message.priority,
              createdAt: message.createdAt,
              incomingChannelType: message.incomingChannelType ? localizeChannelType(message.incomingChannelType) : "",
              sender: message.senderId,
              recipients:"",
              content: message.content,
              incident: message.incidentId,
            });

            // get sender label
            this.getParticipantLabel(message.senderType, message.senderId).subscribe((label => {
              if(label) messageRow.sender = label;
            }));

            // get recipients label
            message.recipients.forEach((recipient => {
              this.getParticipantLabel(recipient.recipientType, recipient.recipientId).subscribe((label => {
                if(!messageRow.recipients){ // first entry
                  if(label) messageRow.recipients = label;
                }else{ // not first entry
                  if(label) messageRow.recipients += (", " + label);
                }
              }))
            }))

            //get incident label
            if(message.incidentId) this.incidentService.getIncidentById(message.incidentId).subscribe((incident => {
              if(incident) messageRow.incident = incident.name;
            }));

            return messageRow;
          })
        ))
        .subscribe((messageRows)=>{
          if(this.dataSource) this.dataSource.data = messageRows;
          else this.dataSource = new MatTableDataSource<MessageRow>(messageRows);
        });
    }
  }

  getParticipantLabel(senderType?: Participant, senderId?: string): Observable<string | undefined>{
    if (senderId && senderType != undefined) {
      if (senderType === Participant.Resource) {
        return this.resourceService.getResourceById(senderId).pipe(
          map(resource => resource?.label)
        )
      }
      if (senderType === Participant.AddressBookEntry) {
        return this.addressBookService.getAddressBookEntryById(senderId).pipe(
          map(entry => entry.label)
        )
      }
      if (senderType === Participant.Role) {
        return this.groupService.getGroupById(senderId).pipe(
          map(group => group.title)
        )
      }
    }
    return of(undefined);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public onFilterReadChange(value: String) {
    if(value === "unread"){
      this.filterRead = false;
      this.refreshDataSource();
    }else if (value === "read"){
      this.filterRead = true;
      this.refreshDataSource();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  entryClicked(row: MessageRow) {
    const dialogRef = this.dialog.open(IncomingMessageComponent, {
      data: {
        messageRow: row,
        loggedInRole: this.loggedInRole,
        isRead: this.filterRead
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.refreshDataSource();
    });
  }

  getStatusCodeText(statusCode: number): string {
    return getStatusCodeText(statusCode);
  }


}
