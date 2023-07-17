import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { map } from 'rxjs';
import { OperationService } from 'src/app/core/services/operation.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { UserService } from 'src/app/core/services/user.service';

interface ResourceRow {
  label: string;
  description: string;
  user: string;
  operation: string;
  incident: string;
  status: string;
}

@Component({
  selector: 'app-list-resources',
  templateUrl: './list-resources.component.html',
  styleUrls: ['./list-resources.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
})
export class ListResourcesComponent implements AfterViewInit {
  displayedColumns: string[] = ['label', 'description', 'user', 'operation', 'incident', 'status'];
  dataSource: MatTableDataSource<ResourceRow> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private resourceService: ResourceService, private operationService: OperationService, private userService: UserService) {
    this.refreshDataSource();
  }

  refreshDataSource() {
    let resourceRows = this.resourceService.getAllResources().pipe(map(resource => {

      return {

      };
    }));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



}
