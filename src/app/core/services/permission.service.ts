import { Injectable } from '@angular/core';
import { NetService } from './net.service';
import { Permission } from '../permissions/permissions';
import { Observable } from 'rxjs';
import urlJoin from 'url-join';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  constructor(private netService: NetService) {
  }

  /**
   * Sets the given permissions for the given user.
   * @param userId Id of the user the permissions shall be set for.
   * @param permissionsToSet
   */
  setPermissionsForUser(userId: string, permissionsToSet: Permission[]): Observable<void> {
    return this.netService.putJSON(urlJoin('/permissions', 'user', userId), permissionsToSet, {});
  }

  /**
   * Retrieve permissions of the given user.
   * @param userId Id of the user to retrieve permissions for.
   */
  getPermissionsByUser(userId: string): Observable<Permission[]> {
    interface NetPermission {
      name: string,
      options?: object
    }

    return this.netService.get<NetPermission[]>(urlJoin('/permissions', 'user', userId), {}).pipe(
      map((res: NetPermission[]): Permission[] => {
          return res.map(resVal => {
            return {
              name: resVal.name,
              options: resVal.options,
            };
          });
        },
      ),
    );
  }
}
