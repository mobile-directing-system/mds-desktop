import { Component } from '@angular/core';
import { Incident } from 'src/app/core/model/incident';
import { Resource } from 'src/app/core/model/resource';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { Loader } from 'src/app/core/util/loader';


export interface OperationTableEntry {
  incident: Incident;
  resources: Resource[]; 
}

@Component({
  selector: 'app-operation-table-view',
  templateUrl: './operation-table-view.component.html',
  styleUrls: ['./operation-table-view.component.scss']
})
export class OperationTableView {

  entries: OperationTableEntry[] = []
  loader: Loader = new Loader();

  constructor(private resourceService: ResourceService, private incidentService: IncidentService, private notificationService: NotificationService) {}

  refreshOperationTable() {
    
  }

}
