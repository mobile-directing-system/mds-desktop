import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, forkJoin, map, switchMap } from 'rxjs';
import { Operation } from 'src/app/core/model/operation';
import { Resource, getStatusCodeText } from 'src/app/core/model/resource';
import { User } from 'src/app/core/model/user';
import { NotificationService } from 'src/app/core/services/notification.service';
import { OperationService } from 'src/app/core/services/operation.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { UserService } from 'src/app/core/services/user.service';
import { Loader } from 'src/app/core/util/loader';
import { SearchResult } from 'src/app/core/util/store';
import { statusCodes } from 'src/app/core/model/resource';
import { Channel } from 'src/app/core/model/channel';
import { ChannelService } from 'src/app/core/services/channel.service';

@Component({
  selector: 'app-edit-resource',
  templateUrl: './edit-resource.component.html',
  styleUrls: ['./edit-resource.component.scss']
})
export class EditResourceComponent implements OnInit, OnDestroy {

  entryId = '';
  loader: Loader = new Loader();
  s: Subscription[] = [];

  form = this.fb.nonNullable.group({
    label: this.fb.nonNullable.control<string>('', Validators.required),
    description: this.fb.nonNullable.control<string>(''),
    operation: this.fb.nonNullable.control<string | null>(null),
    user: this.fb.nonNullable.control<string | null>(null),
    statusCode: this.fb.nonNullable.control<number | null>(null),
    channels: this.fb.nonNullable.control<Channel[]>([])
  });

  constructor(private operationService: OperationService, private userService: UserService,
    private notificationService: NotificationService, private resourceService: ResourceService,
    private route: ActivatedRoute, private fb: FormBuilder, private location: Location,
    private channelService: ChannelService) { }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.route.params.pipe(
      switchMap(params => {
        this.entryId = params['id'];
        return forkJoin({
          entry: this.loader.load(this.resourceService.getResourceById(this.entryId)),
          channels: this.loader.load(this.channelService.getChannelsByResource(this.entryId))
        });
      }),
    ).subscribe(result => {
      this.form.patchValue({
        label: result.entry?.label,
        description: result.entry?.description,
        operation: result.entry?.operation,
        user: result.entry?.user,
        statusCode: result.entry?.statusCode,
        channels: result.channels
      });
    }));
  }

  updateEntry() {
    let fd = this.form.getRawValue();
    this.resourceService.getResourceById(this.entryId).pipe(map(resource => {
      if(!resource) return undefined;
      let updatedResource: Resource = {
        id: resource.id,
        label: fd.label,
        description: fd.description,
        operation: fd.operation ?? undefined,
        user: fd.user ?? undefined,
        incident: resource.incident,
        statusCode: fd.statusCode ?? -1
      };
      return updatedResource;
    })).subscribe(updatedResource => {
      if(!updatedResource) {
        this.notificationService.notifyUninvasiveShort($localize`:@@update-resource-failed:Updating resource failed.`);
        return;
      }

      forkJoin({
        updateResource: this.resourceService.updateResource(updatedResource),
        updateChannels: this.channelService.updateChannelByResource(this.entryId, fd.channels),
      }).subscribe(results => {
        if(results.updateResource) {
          this.close();
          this.notificationService.notifyUninvasiveShort($localize`:@@update-resource-successful:Resource updated.`);
        }else{
          this.notificationService.notifyUninvasiveShort($localize`:@@update-resource-failed:Updating resource failed.`);
        }
      });
    });
  }

  delete() {
    this.resourceService.deleteResourceById(this.entryId).subscribe(successful => {
      if(successful) {
        this.close();
        this.notificationService.notifyUninvasiveShort($localize`:@@delete-resource-successful:Resource deleted.`);
      }else{
        this.notificationService.notifyUninvasiveShort($localize`:@@delete-resource-failed:Resource deletion failed.`);
      }
    });
  }

  getStatusCodes() {
    return statusCodes;
  }

  getUserById(id: string): Observable<User> {
    return this.userService.getUserById(id);
  }

  getOperationById(id: string): Observable<Operation> {
    return this.operationService.getOperationById(id);
  }

  asUser(entity: User): User {
    return entity;
  }

  asOperation(entity: Operation): Operation {
    return entity;
  }

  searchUsers(query: string): Observable<User[]> {
    return this.userService.searchUsers({
      query: query,
      limit: 5,
      offset: 0,
    }, false).pipe(
      map((res: SearchResult<User>): User[] => {
        return res.hits;
      }));
  }

  searchOperations(query: string): Observable<Operation[]> {
    return this.operationService.searchOperations({
        query: query,
        limit: 5,
        offset: 0,
      }, {},
    ).pipe(
      map((res: SearchResult<Operation>): Operation[] => {
        return res.hits;
      }));
  }

  close() {
    this.location.back();
  }
}
