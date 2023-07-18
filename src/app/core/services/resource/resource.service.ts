import { Observable } from "rxjs";
import { CreateResource, Resource } from "../../model/resource";

/**
 * The resource service allows to fetch and manipulate resources
 */
export abstract class ResourceService {

    public abstract getAllResources(): Observable<Resource[]>;
    public abstract getResourceById(id: string): Observable<Resource | undefined>;
    public abstract createResource(resource: CreateResource): Observable<Resource>;
    public abstract deleteResource(resource: Resource): Observable<boolean>;
    public abstract deleteResourceById(id: string): Observable<boolean>;
    public abstract updateResource(resource: Resource): Observable<boolean>;
}