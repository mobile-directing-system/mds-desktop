import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {map, Observable, of} from 'rxjs';
import {IncidentService} from 'src/app/core/services/incident/incident.service';
import {getStatusCodeText} from 'src/app/core/model/resource';
import {MessageService} from "../../../core/services/message/message.service";
import {ChannelType, localizeChannelType} from "../../../core/model/channel";
import {Message, MessageDirection, Participant} from "../../../core/model/message";
import {ResourceService} from "../../../core/services/resource/resource.service";
import {AddressBookService} from "../../../core/services/addressbook.service";
import {GroupService} from "../../../core/services/group.service";
import {Group} from "../../../core/model/group";

interface MessageRow {
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
              private groupService: GroupService, private incidentService: IncidentService, private addressBookService: AddressBookService, private router: Router) {
    const exampleMessages: Message[] = [
      {
        id: "0",
        direction: MessageDirection.Incoming,
        incomingChannelType: ChannelType.Email,
        senderId: "123",
        senderType: Participant.AddressBookEntry,
        content: "Example content",
        createdAt: new Date(),
        priority: 1000,
        recipients: [
          {
            recipientType: Participant.Role,
            recipientId: "S1",
            read: false
          }
        ]
      },
      {
        id: "1",
        direction: MessageDirection.Incoming,
        incomingChannelType: ChannelType.Email,
        senderId: "1234",
        senderType: Participant.Resource,
        content: "Example content 123",
        createdAt: new Date(),
        needsReview: true,
        priority: 0,
        recipients: [
          {
            recipientType: Participant.Role,
            recipientId: "S1",
            read: false
          },
          {
            recipientType: Participant.Role,
            recipientId: "S3",
            read: false
          }
        ]
      },
      {
        id: "2",
        direction: MessageDirection.Outgoing,
        senderType: Participant.Role,
        senderId: "S1",
        content: "A message from S1",
        createdAt: new Date(),
        needsReview: true,
        recipients: [
          {
            recipientType: Participant.Role,
            recipientId: "S2",
            read: false
          },
          {
            recipientType: Participant.Role,
            recipientId: "S3",
            read: false
          }
        ]
      },
      {
        id: "3",
        direction: MessageDirection.Outgoing,
        senderType: Participant.Role,
        senderId: "S2",
        content: "A message from S2",
        createdAt: new Date(),
        recipients: [
          {
            recipientType: Participant.Role,
            recipientId: "S4",
            read: false
          },
          {
            recipientType: Participant.AddressBookEntry,
            recipientId: "12345",
            send: false
          },
        ]
      }
    ];
    // this.messageService.createMessage(exampleMessages[0]);
    // this.messageService.createMessage(exampleMessages[1]);
    // this.messageService.createMessage(exampleMessages[2]);
    // this.messageService.createMessage(exampleMessages[3]);

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
          this.dataSource = new MatTableDataSource<MessageRow>(messageRows);
        });


    // let messageRows = this.messageService.getMailboxMessages(this.loggedInRole.id, this.filterRead).pipe(
    //   concatMap(messages => from(messages)),
    //   map((message, _) => {
    //     let messageRow = <MessageRow>({
    //       id: message.id,
    //       priority: message.priority,
    //       createdAt: message.createdAt,
    //       incomingChannelType: message.incomingChannelType ? localizeChannelType(message.incomingChannelType) : "",
    //       sender: message.senderId,
    //       recipients:"",
    //       content: message.content,
    //       incident: message.incidentId,
    //      });
    //
    //     // get sender label
    //     this.getParticipantLabel(message.senderType, message.senderId).subscribe((label => {
    //       if(label) messageRow.sender = label;
    //     }));
    //
    //     // get recipients label
    //     message.recipients.forEach((recipient => {
    //       this.getParticipantLabel(recipient.recipientType, recipient.recipientId).subscribe((label => {
    //         if(!messageRow.recipients){ // first entry
    //           if(label) messageRow.recipients = label;
    //         }else{ // not first entry
    //           if(label) messageRow.recipients += (", " + label);
    //         }
    //
    //       }))
    //     }))
    //
    //     //get incident label
    //     if(message.incidentId) this.incidentService.getIncidentById(message.incidentId).subscribe((incident => {
    //       if(incident) messageRow.incident = incident.name;
    //     }));
    //     console.log("hello");
    //
    //     return messageRow;
    //   }),
    //   toArray());
    //   console.log("hello123");
    //   messageRows.subscribe(rows => {
    //     this.dataSource = new MatTableDataSource<MessageRow>(rows);
    //     console.log("MMV");
    //   });

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

  public onFilterReadChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue === "unread"){
      this.filterRead = false;
      this.refreshDataSource();
    }else if (filterValue === "read"){
      this.filterRead = true;
      this.refreshDataSource();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  entryClicked(row: MessageRow) {
    this.router.navigate(["/resources", row.id]);
  }

  getStatusCodeText(statusCode: number): string {
    return getStatusCodeText(statusCode);
  }


}
