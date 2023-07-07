import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
import { Observable, of } from 'rxjs';
import { CreateResource, Resource } from '../../model/resource';
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
  public override createResource(resource: CreateResource): Observable<Resource> {
    return of(this.repository.save({id: "", ...resource}));
  }

  public override updateResource(resource: Resource): Observable<boolean> {
    return of(this.repository.replace(resource));
  }

  /**
   * Fetches all available resources
   */
  public override getAllResources(): Observable<Resource[]> {
    return of(this.repository.fetchAll());
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
}
