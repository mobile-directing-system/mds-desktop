import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { concatMap, forkJoin, from, interval, map, mergeMap, Observable, of, Subscription, switchMap, toArray } from 'rxjs';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { MessageService } from "../../../core/services/message/message.service";
import { localizeChannelType } from "../../../core/model/channel";
import { Participant } from "../../../core/model/message";
import { ResourceService } from "../../../core/services/resource/resource.service";
import { AddressBookService } from "../../../core/services/addressbook.service";
import { GroupService } from "../../../core/services/group.service";
import { Group } from "../../../core/model/group";
import { MatDialog } from "@angular/material/dialog";
import { IncomingMessageComponent } from "./incoming-message/incoming-message.component";
import { getParticipantLabel } from 'src/app/core/util/service';
import { WorkspaceService } from 'src/app/core/services/workspace.service';

/**
 * Passed to the IncomingMessageComponent to show a detail view of the message
 */
export interface DialogData {
  messageRow: MessageRow;
  loggedInRole: Group;
  isRead: boolean;
}

/**
 * One row of incoming messages in the table
 */
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

/**
 * Table of incoming messages
 */
@Component({
  selector: 'app-incoming-messages-view',
  templateUrl: './incoming-messages-view.component.html',
  styleUrls: ['./incoming-messages-view.component.scss']
})
export class IncomingMessagesViewComponent implements AfterViewInit, OnInit, OnDestroy {

  currentOperationId: string | undefined;

  displayedColumns: string[] = ['id', 'priority', 'createdAt', 'incomingChannelType', 'sender', 'recipients', 'content', 'incident'];
  dataSource: MatTableDataSource<MessageRow> = new MatTableDataSource();

  readonly refreshIntervall: number = 10;
  refreshTimer!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * The role of the logged-in user
   */
  @Input() loggedInRole: Group | undefined;

  /**
   * Indicates if read or unread messages should be shown
   */
  filterRead = false;

  constructor(private messageService: MessageService, private resourceService: ResourceService,
    private groupService: GroupService, private incidentService: IncidentService,
    private addressBookService: AddressBookService, public dialog: MatDialog,
    private workspaceService: WorkspaceService) {
  }

  ngOnInit() {
    this.workspaceService.operationChange().subscribe(operationId => {
      this.currentOperationId = operationId;
      this.refreshDataSource();
    });
    this.refreshTimer = interval(this.refreshIntervall * 1000).subscribe(() => this.refreshDataSource());
  }

  ngOnDestroy(): void {
    this.refreshTimer.unsubscribe();
  }


  /**
   * Refreshes the data in the table.
   */
  refreshDataSource() {
    if (this.loggedInRole) {
      this.messageService.getMailboxMessages(this.loggedInRole.id, this.filterRead, this.currentOperationId)
        .pipe(
          concatMap(messages => from(messages)),
          mergeMap(message => {
            return forkJoin({
              message: of(message),
              senderLabel: this.getParticipantLabel(message.senderType, message.senderId),
              recipientLabels: from(message.recipients).pipe(concatMap(recipient => this.getParticipantLabel(recipient.recipientType, recipient.recipientId)), toArray()),
              incidentLabel: message.incidentId ? this.incidentService.getIncidentById(message.incidentId).pipe(map(incident => incident?.name)) : of("")
            })
          }),
          map(data => {
            return <MessageRow>({
              id: data.message.id,
              priority: data.message.priority,
              createdAt: data.message.createdAt,
              incomingChannelType: data.message.incomingChannelType ? localizeChannelType(data.message.incomingChannelType) : "",
              sender: data.senderLabel,
              recipients: data.recipientLabels.join(", "),
              content: data.message.content,
              incident: data.incidentLabel ? data.incidentLabel : "",
            });
          }),
          toArray())
        .subscribe((messageRows) => {
          if (this.dataSource) {
            this.dataSource.data = messageRows;
          } else {
            this.dataSource = new MatTableDataSource<MessageRow>(messageRows);
          }

          // Define custom sorting strategy
          this.dataSource.sortingDataAccessor = (data: any, property: string) => {
            switch (property) {
              case 'createdAt': return new Date(data.createdAt);
              default: return data[property];
            }
          };
        }
        );
    }
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
   * Filters the table data to the search term
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Filters the table data to read/unread messages
   * @param value: read | unread
   */
  public onFilterReadChange(value: String) {
    if (value === "unread") {
      this.filterRead = false;
      this.refreshDataSource();
    } else if (value === "read") {
      this.filterRead = true;
      this.refreshDataSource();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Opens dialog for detail view when clicking an entry in the table
   */
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
}
