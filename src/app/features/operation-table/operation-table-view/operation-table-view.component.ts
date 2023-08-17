import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, concatMap, from, map, startWith, toArray } from 'rxjs';
import { DeleteConfirmDialog } from 'src/app/core/components/delete-confirm-dialog/delete-confirm-dialog.component';
import { Incident } from 'src/app/core/model/incident';
import { Resource, getStatusCodeText } from 'src/app/core/model/resource';
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
  styleUrls: ['./operation-table-view.component.scss'],
})
export class OperationTableView implements OnInit {

  entries: OperationTableEntry[] = []
  loader: Loader = new Loader();
  operationId: string | null = null;
  resources: Resource[] = [];

  constructor(private resourceService: ResourceService, private incidentService: IncidentService,
    private notificationService: NotificationService, private localStorageService: LocalStorageService, private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.operationId = this.localStorageService.getItem(LocalStorageService.TokenWorkspaceOperation);
    this.resourceService.getResources().subscribe(resources => {
      this.resources = resources.filter(r => r.operation === undefined || r.operation === this.operationId);
    });
    this.loadOperationTableEntries();
  }

  getResourceName(resource: Resource): string {
    return resource.label;
  }

  resourceOptionSelected(resource: Resource, entry: OperationTableEntry, input: HTMLInputElement) {
    entry.addResourceFormControl.setValue("");
    setTimeout(() => input.blur(), 50);

    resource.incident = entry.incident.id;
    this.resourceService.updateResource(resource).subscribe(successful => {
      if (successful) this.refreshResourcesOfEntries();
    });
  }

  deleteResourceFromIncident(resource: Resource, entry: OperationTableEntry) {
    resource.incident = undefined;
    this.resourceService.updateResource(resource).subscribe(successful => {
      if (successful) this.refreshResourcesOfEntries();
    });
  }

  resourceClicked(resource: Resource) {
    this.router.navigate(["/resources", resource.id]);
  }

  getStatusText(statusCode: number | undefined) {
    if (statusCode === undefined) return $localize`:@@no-status:No Status`;
    return `${statusCode} -  ${getStatusCodeText(statusCode)}`;
  }

  refreshResourcesOfEntries() {
    for (let entry of this.entries) {
      this.resourceService.getResources({ byIncident: entry.incident.id }).subscribe(resources => entry.resources = resources);
    }
  }

  loadOperationTableEntries() {
    let fetchEntries = this.incidentService.getIncidents({ byOperation: this.operationId ?? undefined, isCompleted: false }).pipe(
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

  /**
   * Completes an incident and unassignes all resources from the incident
   */
  completeIncident(event: Event, entry: OperationTableEntry) {
    event.stopPropagation();

    this.showCompleteIncidentDialog().subscribe(result => {
      if(result === true) {
        entry.incident.isCompleted = true;
        this.incidentService.updateIncident(entry.incident).subscribe(successful => {
          this.entries = this.entries.filter(e => e.incident.id !== entry.incident.id);
        });
        entry.resources.forEach(resource => {
          resource.incident = undefined;
          this.resourceService.updateResource(resource);
        })
      }
    })
  }

  /***
   * Shows a dialog to complete an incident
   * 
   * @returns result of dialog
   */
  showCompleteIncidentDialog(): Observable<boolean> {
    let dialog = this.dialog.open(DeleteConfirmDialog);
    dialog.componentInstance.message = $localize`:@@delete-incident-question:Should the incident be completed?`;
    dialog.componentInstance.deleteLabel = $localize`Confirm`;
    return dialog.afterClosed();
  }

  private filterResourcesByName(name: string): Resource[] {
    const filterValue = name.toLowerCase();
    return this.resources.filter(r => r.label.toLowerCase().includes(filterValue));
  }
}
