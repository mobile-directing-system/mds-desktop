import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { concatMap, from, map, toArray } from 'rxjs';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { OperationService } from 'src/app/core/services/operation.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { UserService } from 'src/app/core/services/user.service';
import { getStatusCodeText } from 'src/app/core/model/resource';
import {MessageService} from "../../../core/services/message/message.service";
import {localizeChannelType} from "../../../core/model/channel";

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
export class IncomingMessagesViewComponent implements AfterViewInit {
  displayedColumns: string[] = ['label', 'description', 'user', 'operation', 'incident', 'status'];
  dataSource: MatTableDataSource<MessageRow> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private messageService: MessageService, private operationService: OperationService,
              private userService: UserService, private incidentService: IncidentService, private router: Router) {
    this.refreshDataSource();
  }

  refreshDataSource() {
    let messageRows = this.messageService.getMailboxMessages("roleID", false).pipe(
      concatMap(messages => from(messages)),
      map((message, _) => {
        let messageRow = <MessageRow>({
          id: message.id,
          priority: message.priority,
          createdAt: message.createdAt,
          incomingChannelType: message.incomingChannelType ? localizeChannelType(message.incomingChannelType) : "",
          sender: message.senderId,
          recipients:message.recipients.toString(),
          content: message.content,
          incident: message.incidentId,
         });
        // if (resource.operation) this.operationService.getOperationById(resource.operation).subscribe(operation => resourceRow.operation = operation.title);
        // if (resource.user) this.userService.getUserById(resource.user).subscribe(user => resourceRow.user = user.username);
        // if(resource.incident) this.incidentService.getIncidentById(resource.incident).subscribe(incident => resourceRow.incident = incident?.name ?? "");
         return messageRow;
      }),
      toArray());

    messageRows.subscribe(rows => this.dataSource = new MatTableDataSource<MessageRow>(rows));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
