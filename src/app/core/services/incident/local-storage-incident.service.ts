import { Injectable } from '@angular/core';
import { LocalStorageCRUDRepository } from '../../util/local-storage';
import { CreateIncident, Incident } from '../../model/incident';
import { IncidentService } from './incident.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class LocalStorageIncidentService extends IncidentService {

  private repository: LocalStorageCRUDRepository<Incident> = new LocalStorageCRUDRepository<Incident>("mds-desktop__incidents");

  public override getAllIncidents(): Observable<Incident[]> {
    return of(this.repository.fetchAll());
  }
  public override getIncidentById(id: string): Observable<Incident | undefined> {
    return of(this.repository.findById(id));
  }
  public override createIncident(incident: CreateIncident): Observable<Incident> {
    return of(this.repository.save({id: "", ...incident}));
  }
  public override deleteIncident(incident: Incident): Observable<boolean> {
    return of(this.repository.delete(incident));
  }
  public override updateIncident(incident: Incident): Observable<boolean> {
    return of(this.repository.replace(incident));
  }
}
