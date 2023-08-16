import { Observable } from "rxjs";
import { Incident } from "../../model/incident";

/**
 * Filters to retrieve incidents
 */
export interface IncidentFilters {
    byOperation?: string;
    byName?: string;
    isComplated?: boolean;
}

/**
 * This service manages all incidents
 */
export abstract class IncidentService {

    public abstract getIncidents(filters?: IncidentFilters): Observable<Incident[]>;
    public abstract getIncidentById(id: string): Observable<Incident | undefined>;
    public abstract createIncident(incident: Incident): Observable<Incident>;
    public abstract deleteIncident(incident: Incident): Observable<boolean>;
    public abstract updateIncident(incident: Incident): Observable<boolean>;
}