import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, from, map, mergeAll, mergeMap, of, switchMap, toArray } from 'rxjs';
import { Channel } from 'src/app/core/model/channel';
import { MessageDirection, Participant } from 'src/app/core/model/message';
import { AddressBookService } from 'src/app/core/services/addressbook.service';
import { GroupService } from 'src/app/core/services/group.service';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { SelectChannelDialog } from '../select-channel-dialog/select-channel-dialog.component';
import { getParticipantLabel } from 'src/app/core/util/service';

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
    private incidentService: IncidentService, private dialog: MatDialog,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (data: any, property: string) => {
      switch (property) {
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
          // Do not display Resources and Roles because they do not have channels assigned
          if(recipient.recipientType === Participant.Resource || recipient.recipientType === Participant.Role) return;

          // Create new table entry when message has no outgoing channel yet
          if (!recipient.channelId) {
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
    return getParticipantLabel(this.resourceService, this.addressBookService, this.groupService, senderType, senderId);
  }

  /**
   * Is called when row in table was clicked
   * 
   * @param row that was clicked
   */
  rowClicked(row: MessageRow) {
    const dialogRef = this.dialog.open(SelectChannelDialog, {
      data: row
    });

    dialogRef.afterClosed().subscribe(channel => {
      if (!channel) return;
      this.setChannelForRecipient(row.messageId, row.recipientId, (channel as Channel).id ?? "").subscribe(successful => {
        if(successful) {
          this.dataSource.data = this.dataSource.data.filter(tableRow => tableRow !== row);
        }
        this.notificationService.notifyUninvasiveShort(successful ? $localize`Channel successfully selected` :
          $localize`Failed to select channel for message`);
      });
    });
  }

  /**
   * Set an outgoing channel for a recipient.
   * 
   * @param messageId of the message
   * @param recipientId of the recipient
   * @param channelId of the selected channel
   * 
   * @returns if update was successful
   * 
   */
  setChannelForRecipient(messageId: string, recipientId: string, channelId: string): Observable<boolean> {
    return this.messageService.getMessageById(messageId).pipe(switchMap(message => {
      let participant = message?.recipients.find((value, _, __) => value.recipientId === recipientId);

      if (!participant) return of(false);

      participant.channelId = channelId;
      return this.messageService.updateMessage(message!);
    }));
  }
}
