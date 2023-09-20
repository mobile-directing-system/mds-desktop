import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, from, map, mergeAll, mergeMap, of, toArray } from 'rxjs';
import { MessageDirection, Participant } from 'src/app/core/model/message';
import { AddressBookService } from 'src/app/core/services/addressbook.service';
import { GroupService } from 'src/app/core/services/group.service';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { SelectChannelDialog } from '../select-channel-dialog/select-channel-dialog.component';

/**
 * One row of incoming messages in the table
 */
export interface MessageRow {
  messageId: string;
  priority: number;
  createdAt: Date;
  senderLabel: string;
  recipientType: Participant;
  recipientId: string;
  recipientLabel: string;
  content: string;
  incidentLabel: string;
}

@Component({
  selector: 'app-outgoing-messages-view',
  templateUrl: './outgoing-messages-view.component.html',
  styleUrls: ['./outgoing-messages-view.component.scss']
})
export class OutgoingMessagesViewComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'priority', 'createdAt', 'sender', 'recipient', 'content', 'incident'];
  dataSource: MatTableDataSource<MessageRow> = new MatTableDataSource<MessageRow>();

  constructor(private messageService: MessageService, private resourceService: ResourceService,
    private addressBookService: AddressBookService, private groupService: GroupService,
    private incidentService: IncidentService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (data: any, property: string) => {
      switch(property) {
          case 'createdAt': return new Date(data.createdAt);
          default: return data[property];
      }
    };
    this.refreshDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Refreshes the data in the table
   */
  refreshDataSource() {
    this.messageService.getMessages({ byDirection: MessageDirection.Outgoing }).pipe(
      mergeAll(),
      mergeMap(msg => {
        let rows: MessageRow[] = [];

        msg.recipients.forEach(recipient => {
          // Create new table entry when message was not already sent to recipient
          if (!recipient.send) {
            let row: MessageRow = {
              messageId: msg.id,
              priority: msg.priority ?? -1,
              createdAt: msg.createdAt,
              content: msg.content,
              senderLabel: "",
              recipientType: recipient.recipientType,
              recipientId: recipient.recipientId,
              recipientLabel: "",
              incidentLabel: ""
            }

            // Fetch sender label
            this.getParticipantLabel(msg.senderType, msg.senderId).subscribe((label => {
              if (label) row.senderLabel = label;
            }));

            // Fetch recipient label
            this.getParticipantLabel(recipient.recipientType, recipient.recipientId).subscribe(label => {
              if (label) row.recipientLabel = label;
            });

            // Fetch incident label
            if (msg.incidentId) {
              this.incidentService.getIncidentById(msg.incidentId).subscribe((incident => {
                if (incident) row.incidentLabel = incident.name;
              }));
            }

            rows.push(row);
          }
        })
        return from(rows);
      }),
      toArray()
    ).subscribe((rows: MessageRow[]) => {
      this.dataSource.data = rows;
    });
  }

  /**
 * Returns label of the participant
 *
 * @param senderType: type of the participant
 * @param senderId: id of the participant
 * @returns observableLabel
 */
  getParticipantLabel(senderType?: Participant, senderId?: string): Observable<string | undefined> {
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

  /**
   * Is called when row in table was clicked
   * 
   * @param row that was clicked
   */
  rowClicked(row: MessageRow) {
    this.dialog.open(SelectChannelDialog, {
      data: row
    });
  }
}
