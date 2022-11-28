import { Injectable } from '@angular/core';
import {NetService} from "./net.service";
import {Permission} from "../model/permissions";
import {Observable} from "rxjs";
import urlJoin from "url-join";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private netService: NetService) {
  }

  /**
   * Sets the given permissions for the given user.
   * @param userId Id of the user the permissions shall be set for.
   * @param permissionsToSet
   */
  setPermissionsFor(userId: string, permissionsToSet: Permission[]): Observable<void> {
    return this.netService.putJSON(urlJoin('/permissions', 'user', userId), permissionsToSet, {});
  }

  /**
   * Retrieves the previously or by standard set permission of the given user.
   * @param userId Id of the User the permissions are to be retrieved.
   */
  retrievePermissions(userId: string):Observable<Permission[]>{
    interface NetPermission {
      name: string,
      option?: object
    }
    return this.netService.get<NetPermission[]>(urlJoin('/permissions', 'user', userId), {}).pipe(
      map((res: NetPermission[]): Permission[] => {
        return res.map(resVal => {
          return {
            name: resVal.name,
            option: resVal.option
          }
        })
        }
      )
    )
  }
}
