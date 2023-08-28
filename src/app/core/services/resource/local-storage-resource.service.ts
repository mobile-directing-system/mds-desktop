import { Injectable } from '@angular/core';
import { ResourceFilters, ResourceService } from './resource.service';
import { Observable, of } from 'rxjs';
import { Resource } from '../../model/resource';
import { LocalStorageCRUDRepository } from '../../util/local-storage';

/**
 * Manages all resources of the application using
 * {@link localStorage} to mock the behaviour of the backend
 */
@Injectable()
export class LocalStorageResourceService extends ResourceService {

  private repository: LocalStorageCRUDRepository<Resource> = new LocalStorageCRUDRepository<Resource>("mds-desktop__resources");

  /**
   * Creates a new resource
   * 
   * @param resource to create
   */
  public override createResource(resource: Resource): Observable<Resource> {
    return of(this.repository.save(resource));
  }

  public override updateResource(resource: Resource): Observable<boolean> {
    return of(this.repository.replace(resource));
  }

  /**
   * Fetches resources
   */
  public override getResources(filters?: ResourceFilters): Observable<Resource[]> {
    let resources: Resource[] = this.repository.fetchAll();
    if(filters) {
      if(filters.byLabel) resources = resources.filter(r => r.label.includes(filters.byLabel!));
      if(filters.byIncident) resources = resources.filter(r => r.incident === filters.byIncident);
      if(filters.byOperation) resources = resources.filter(r => r.operation === filters.byOperation);
      if(filters.byUser) resources = resources.filter(r => r.user === filters.byUser);
      if(filters.byStatusCode) resources = resources.filter(r => r.statusCode === filters.byStatusCode);
    }
    return of(resources);
  }

  /**
   * Get resource by id
   */
  public override getResourceById(id: string): Observable<Resource | undefined> {
    return of(this.repository.findById(id));
  }

  /**
   * Deletes a resource
   * 
   * @param resource to delete
   * @returns if deletion was successful
   */
  public override deleteResource(resource: Resource): Observable<boolean> {
    return of(this.repository.delete(resource));
  }

  public override deleteResourceById(id: string): Observable<boolean> {
    return of(this.repository.deleteById(id));
  }
}
