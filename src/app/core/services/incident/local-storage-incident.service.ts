import { Injectable } from '@angular/core';
import { LocalStorageCRUDRepository } from '../../util/local-storage';
import { Incident } from '../../model/incident';
import { IncidentFilters, IncidentService } from './incident.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class LocalStorageIncidentService extends IncidentService {

  private repository: LocalStorageCRUDRepository<Incident> = new LocalStorageCRUDRepository<Incident>("mds-desktop__incidents");

  public override getIncidents(filters: IncidentFilters): Observable<Incident[]> {
    let incidents: Incident[] = this.repository.fetchAll();
    if(filters) {
      if(filters.byName !== undefined) incidents = incidents.filter(i => filters.byName === i.name);
      if(filters.byOperation !== undefined) incidents = incidents.filter(i => filters.byOperation === i.operation);
      if(filters.isCompleted !== undefined) incidents = incidents.filter(i => filters.isCompleted === i.isCompleted);
    }
    return of(incidents);
  }
  public override getIncidentById(id: string): Observable<Incident | undefined> {
    return of(this.repository.findById(id));
  }
  public override createIncident(incident: Incident): Observable<Incident> {
    return of(this.repository.save(incident));
  }
  public override deleteIncident(incident: Incident): Observable<boolean> {
    return of(this.repository.delete(incident));
  }
  public override updateIncident(incident: Incident): Observable<boolean> {
    return of(this.repository.replace(incident));
  }
}
