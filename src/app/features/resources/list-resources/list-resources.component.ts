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

interface ResourceRow {
  id: string,
  label: string;
  description: string;
  user: string;
  operation: string;
  incident: string;
  statusCode: number;
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

  constructor(private resourceService: ResourceService, private operationService: OperationService,
    private userService: UserService, private incidentService: IncidentService, private router: Router) {
    this.refreshDataSource();
  }

  refreshDataSource() {
    let resourceRows = this.resourceService.getResources().pipe(
      concatMap(resources => from(resources)),
      map((resource, _) => {
        let resourceRow = <ResourceRow>({
          id: resource.id,
          label: resource.label,
          description: resource.description,
          user: resource.user,
          operation: resource.operation,
          incident: "",
          statusCode: resource.statusCode
        });
        if (resource.operation) this.operationService.getOperationById(resource.operation).subscribe(operation => resourceRow.operation = operation.title);
        if (resource.user) this.userService.getUserById(resource.user).subscribe(user => resourceRow.user = user.username);
        if(resource.incident) this.incidentService.getIncidentById(resource.incident).subscribe(incident => resourceRow.incident = incident?.name ?? "");
        return resourceRow;
      }),
      toArray());

    resourceRows.subscribe(rows => this.dataSource = new MatTableDataSource<ResourceRow>(rows));
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

  entryClicked(row: ResourceRow) {
    this.router.navigate(["/resources", row.id]);
  }

  getStatusCodeText(statusCode: number): string {
    return getStatusCodeText(statusCode);
  }
}
