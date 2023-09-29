import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, mergeAll, mergeMap, toArray } from 'rxjs';
import { ChannelType } from 'src/app/core/model/channel';
import { Incident } from 'src/app/core/model/incident';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { MessageService } from 'src/app/core/services/message/message.service';

/**
 * Data of table row that represents an incoming message
 */
export interface ReviewerIncomingMessageRow {
  id: string;
  createdAt: Date;
  channelType: ChannelType;
  content: string;
  incident?: Incident;
}

@Component({
  selector: 'app-incoming-messages-view',
  templateUrl: './incoming-messages-view.component.html',
  styleUrls: ['./incoming-messages-view.component.scss']
})
export class IncomingMessagesViewComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['id', 'created_at', 'channel', 'content', 'incident'];
  dataSource: MatTableDataSource<ReviewerIncomingMessageRow> = new MatTableDataSource<ReviewerIncomingMessageRow>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private messageService: MessageService, private incidentService: IncidentService) {}

  ngOnInit() {
    this.refreshDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'created_at': return new Date(item.createdAt);
        default: return item[property];
      }
    };
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Refreshes data source of table
   */
  refreshDataSource() {
    let tableRows = this.messageService.getMessages({
      byNeedsReview: true
    }).pipe(
      mergeAll(),
      map(msg => {
        let row: ReviewerIncomingMessageRow = {
          id: msg.id,
          createdAt: msg.createdAt,
          channelType: msg.incomingChannelType!,
          content: msg.content
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
    
  }
}
