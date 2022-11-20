import {Injectable} from '@angular/core';
import {NetService} from './net.service';
import {CreateGroup, Group} from "../model/group";
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Paginated, PaginationParams} from '../util/store';
import {NetPaginated, netPaginationParams, paginatedFromNet,} from '../util/net';
import {MDSError, MDSErrorCode} from '../util/errors';
import urlJoin from 'url-join';

/**
 * Fields for sorting Groups.
 */
export enum GroupSort{
  ByTitle,
  ByDescription,
}

export interface GroupParams{
  orderBy?: GroupSort,
  userId?: string,
  forOperation?: string,
  excludeGlobal?:boolean,
}
/**
 * Service for group management. Allows creation, manipulation and retrieval of groups.
 */
@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private netService: NetService) {
  }

  /**
   * Creates a new Instance of a group and returns the newly created.
   * @param create Details for group creation.
   */
  createGroup(create: CreateGroup): Observable<Group> {
    interface NetCreate {
      title: string;
      description: string;
      operation?: string;
      members: [string];
    }

    interface NetCreated {
      id: string;
      title: string;
      description: string;
      operation?: string;
      members: [string];
    }

    const body: NetCreate = {
      title: create.title,
      description: create.description,
      operation: create.operation,
      members: create.members,
    };
    return this.netService.postJSON<NetCreated>('/groups', body, {}).pipe(
      map((res:NetCreated): Group => ({
        id: res.id,
        title: res.title,
        description: res.description,
        operation: res.operation,
        members: res.members,
      })),
    );
  }

  /**
   * Updates the given group, identified by its {@link Group.id}.
   * @param update The updated Group.
   */
  updateGroup(update: Group): Observable<void> {
    interface NetUpdate {
      id: string;
      title: string;
      description: string;
      operation?: string;
      members: [string];
    }

    const body: NetUpdate = {
      id: update.id,
      title: update.title,
      description: update.description,
      operation: update.operation,
      members: update.members,
    };
    return this.netService.putJSON(urlJoin('/groups', update.id), body, {});
  }

  /**
   * Deletes the given group.
   * @param groupId Id of the group to be deleted.
   */
  deleteGroup(groupId: string): Observable<void>{
    return this.netService.delete(urlJoin('/groups', groupId),{});
  }

  /**
   * Retrieves a Group with the given id.
   * @param groupId The id of the group to be retrieved.
   */
  getGroupById(groupId: string): Observable<Group>{
    interface NetGroup {
      id: string;
      title: string;
      description: string;
      operation?: string;
      members: [string];
    }

    return this.netService.get<NetGroup>(urlJoin('/groups', groupId), {}).pipe(
      map((res:NetGroup):Group => ({
        id: res.id,
        title: res.title,
        description: res.description,
        operation: res.operation,
        members: res.members,
      })),
    );
  }

  /**
   * Retrieves paginated groups fitting the given params.
   * @param params Params for pagination.
   */
  getGroups(params: PaginationParams<GroupParams>): Observable<Paginated<Group>> {
    interface NetEntry {
      id: string;
      title: string;
      description: string;
      operation?: string;
      members: [string];
    }

    const nParams = netPaginationParams(params,(by:GroupParams)=> {
      switch (by) {
        case by.orderBy == GroupSort.ByTitle:
          return 'title';
        case by.orderBy == GroupSort.ByDescription:
          return  'description';
        case by.userId:
          return 'by_user=' + by.userId;
        case by.excludeGlobal:
            return by.excludeGlobal? 'exclude_global=true' : 'exclude_global=false';
        case  by.forOperation:
          return 'for_operation=' + by.forOperation;
        default:
          throw new MDSError(MDSErrorCode.AppError, 'unknown group sort', {by: by})
      }
    });
    return this.netService.get<NetPaginated<NetEntry>>('/groups',nParams).pipe(
      map((res: NetPaginated<NetEntry>): Paginated<Group> => {
        return paginatedFromNet(res, (nEntry: NetEntry): Group => ({
          id: nEntry.id,
          title: nEntry.title,
          description: nEntry.description,
          operation: nEntry.operation,
          members: nEntry.members,
        }));
      }),
    );
  }
}
