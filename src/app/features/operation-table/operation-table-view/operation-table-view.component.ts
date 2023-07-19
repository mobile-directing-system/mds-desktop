import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, concatMap, from, map, startWith, toArray } from 'rxjs';
import { Incident } from 'src/app/core/model/incident';
import { Resource } from 'src/app/core/model/resource';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { Loader } from 'src/app/core/util/loader';

export interface OperationTableEntry {
  incident: Incident;
  resources: Resource[];
  addResourceFormControl: FormControl;
  filteredResourceOptions: Observable<Resource[]>
}

@Component({
  selector: 'app-operation-table-view',
  templateUrl: './operation-table-view.component.html',
  styleUrls: ['./operation-table-view.component.scss']
})
export class OperationTableView implements OnInit {

  entries: OperationTableEntry[] = []
  loader: Loader = new Loader();
  operationId: string | null = null;
  resources: Resource[] = [];

  constructor(private resourceService: ResourceService, private incidentService: IncidentService, private notificationService: NotificationService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.operationId = this.localStorageService.getItem(LocalStorageService.TokenWorkspaceOperation);
    this.resourceService.getResources().subscribe(resources => {
      this.resources = resources.filter(r => r.operation === undefined || r.operation === this.operationId);
    });
    this.refreshOperationTable();
  }

  getResourceName(resource: Resource): string {
    return resource.label;
  }

  resourceOptionSelected(resource: Resource, entry: OperationTableEntry, input: HTMLInputElement) {
    if(!entry.resources.includes(resource)) entry.resources.push(resource);
    entry.addResourceFormControl.setValue("");
    setTimeout(() => input.blur(), 50);
  }

  deleteResourceFromIncident(resource: Resource, entry: OperationTableEntry) {
    entry.resources = entry.resources.filter(r => r.id !== resource.id);
  }

  refreshOperationTable() {
    let fetchEntries = this.incidentService.getIncidents({ byOperation: this.operationId ?? undefined }).pipe(
      concatMap(incidents => from(incidents)),
      map(incident => {
        let formControl = new FormControl<string | Resource>("");
        let resourceOptions = formControl.valueChanges.pipe(startWith(''), map(value => {
          const name = typeof value === "string" ? value : value?.label;
          return name ? this.filterResourcesByName(name as string) : this.resources.slice();
        }));

        let entry: OperationTableEntry = {
          incident: incident,
          resources: [],
          addResourceFormControl: formControl,
          filteredResourceOptions: resourceOptions
        }
        this.resourceService.getResources({ byIncident: incident.id }).subscribe(resources => entry.resources = resources);
        return entry;
      }),
      toArray()
      );
    this.loader.load(fetchEntries).subscribe(entries => this.entries = entries);
  }

  private filterResourcesByName(name: string): Resource[] {
    const filterValue = name.toLowerCase();
    return this.resources.filter(r => r.label.toLowerCase().includes(filterValue));
  }
}
