import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, interval, map, mergeAll, toArray } from 'rxjs';
import { Incident } from 'src/app/core/model/incident';
import { Message, MessageDirection } from 'src/app/core/model/message';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ReviewDialog } from '../review-dialog/review-dialog.component';
import { WorkspaceService } from 'src/app/core/services/workspace.service';

/**
 * Data of table row that represents an incoming message
 */
export interface ReviewerIncomingMessageRow {
  message: Message;
  incident?: Incident;
}

@Component({
  selector: 'app-incoming-messages-view',
  templateUrl: './incoming-messages-view.component.html',
  styleUrls: ['./incoming-messages-view.component.scss']
})
export class IncomingMessagesViewComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns: string[] = ['id', 'created_at', 'channel', 'content', 'incident'];
  dataSource: MatTableDataSource<ReviewerIncomingMessageRow> = new MatTableDataSource<ReviewerIncomingMessageRow>();

  readonly refreshIntervall: number = 10;
  refreshTimer!: Subscription;

  currentOperationId: string | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private messageService: MessageService, private incidentService: IncidentService, private dialog: MatDialog,
    private notificationService: NotificationService, private workspaceService: WorkspaceService) {}

  ngOnInit() {
    this.workspaceService.operationChange().subscribe(operationId => {
      this.currentOperationId = operationId;
      this.refreshDataSource();
      this.refreshTimer = interval(this.refreshIntervall * 1000).subscribe(() => this.refreshDataSource());
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data: any, property: string) => {
      switch(property) {
          case 'created_at': return new Date(data.message.createdAt);
          case 'id': return data.message.id;
          case 'channel': return data.message.incomingChannelType;
          case 'content': return data.message.content;
          default: return data[property];
      }
    };
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.refreshTimer.unsubscribe();
  }

  /**
   * Refreshes data source of table
   */
  refreshDataSource() {
    let tableRows = this.messageService.getMessages({
      byNeedsReview: true,
      byDirection: MessageDirection.Incoming,
      byOperationId: this.currentOperationId
    }).pipe(
      mergeAll(),
      map(msg => {
        let row: ReviewerIncomingMessageRow = {
          message: msg
        }

        if(msg.incidentId) {
          this.incidentService.getIncidentById(msg.incidentId).subscribe(incident => {
            row.incident = incident;
          })
        }
        
        return row;
      }),
      toArray()
    );
    tableRows.subscribe(rows => {
      this.dataSource.data = rows;
    });
  }

  /**
   * Called when row on table was clicked
   * 
   * @param row that was clicked
   */
  rowClicked(row: ReviewerIncomingMessageRow) {
    let dialogRef = this.dialog.open(ReviewDialog, {
      data: row
    });

    dialogRef.afterClosed().subscribe(successful => {
      if(successful !== undefined) {
        if(successful) this.refreshDataSource();
        this.notificationService.notifyUninvasiveShort(successful ? 
          $localize`Message as successfully reviewed` : $localize`Error: Message could not be forwarded`);
      }
    });
  }
}
