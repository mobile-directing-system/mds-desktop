import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Message } from 'src/app/core/model/message';
import { MessageService } from 'src/app/core/services/message/message.service';

@Component({
  selector: 'app-incoming-messages-view',
  templateUrl: './incoming-messages-view.component.html',
  styleUrls: ['./incoming-messages-view.component.scss']
})
export class IncomingMessagesViewComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['id', 'created_at', 'channel', 'content', 'incident'];
  dataSource: MatTableDataSource<Message> = new MatTableDataSource<Message>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messageService.getMessages({
      byNeedsReview: true
    }).subscribe(messages => this.dataSource = new MatTableDataSource<Message>(messages));
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
}
