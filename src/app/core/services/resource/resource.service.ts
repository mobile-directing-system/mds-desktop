import { Observable } from "rxjs";
import { Resource } from "../../model/resource";

/**
 * Filters to retrieve resources
 */
export interface ResourceFilters {
    byLabel?: string;
    byOperation?: string;
    byUser?: string;
    byIncident?: string;
    byStatusCode?: number;
}

/**
 * The resource service allows to fetch and manipulate resources
 */
export abstract class ResourceService {

    public abstract getResources(filters?: ResourceFilters): Observable<Resource[]>;
    public abstract getResourceById(id: string): Observable<Resource | undefined>;
    public abstract createResource(resource: Resource): Observable<Resource>;
    public abstract deleteResource(resource: Resource): Observable<boolean>;
    public abstract deleteResourceById(id: string): Observable<boolean>;
    public abstract updateResource(resource: Resource): Observable<boolean>;
}