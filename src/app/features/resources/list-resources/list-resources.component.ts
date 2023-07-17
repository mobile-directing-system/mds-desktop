import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { concatMap, from, map, mergeMap, of, toArray } from 'rxjs';
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
    let resourceRows = this.resourceService.getAllResources().pipe(
      concatMap(resources => from(resources)),
      map((resource, _) => {
        let resourceRow = <ResourceRow>({
          label: resource.label,
          description: resource.description,
          user: resource.user,
          operation: resource.operation,
          incident: "",
          status: resource.statusCode?.toString()
        });
        if(resource.operation) this.operationService.getOperationById(resource.operation).subscribe(operation => resourceRow.operation = operation.title);
        if(resource.user) this.userService.getUserById(resource.user).subscribe(user => resourceRow.user = user.username);
        return resourceRow;
      }),
      toArray());

    resourceRows.subscribe(rows => {
      this.dataSource = new MatTableDataSource<ResourceRow>(rows);
      console.log(rows);
    });
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
}
