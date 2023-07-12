import { Observable } from "rxjs";
import { CreateIncident, Incident } from "../../model/incident";
import { LocalStorageCRUDRepository } from "../../util/local-storage";

/**
 * This service manages all incidents
 */
export abstract class IncidentService {

    public abstract getAllIncidents(): Observable<Incident[]>;
    public abstract getIncidentById(id: string): Observable<Incident | undefined>;
    public abstract createIncident(incident: CreateIncident): Observable<Incident>;
    public abstract deleteIncident(incident: Incident): Observable<boolean>;
    public abstract updateIncident(incident: Incident): Observable<boolean>;
}