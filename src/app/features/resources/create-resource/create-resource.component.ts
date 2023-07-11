import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Operation } from 'src/app/core/model/operation';
import { CreateResource } from 'src/app/core/model/resource';
import { User } from 'src/app/core/model/user';
import { NotificationService } from 'src/app/core/services/notification.service';
import { OperationService } from 'src/app/core/services/operation.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { UserService } from 'src/app/core/services/user.service';
import { Loader } from 'src/app/core/util/loader';
import { SearchResult } from 'src/app/core/util/store';

@Component({
  selector: 'app-create-resource',
  templateUrl: './create-resource.component.html',
  styleUrls: ['./create-resource.component.scss']
})
export class CreateResourceView {

  constructor(private resourceService: ResourceService, private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute, private notificationService: NotificationService,
    private userService: UserService, private operationService: OperationService) {
}

  loader = new Loader();

  form = this.fb.nonNullable.group({
    label: this.fb.nonNullable.control<string>('', Validators.required),
    description: this.fb.nonNullable.control<string>(''),
    operation: this.fb.nonNullable.control<string | null>(null),
    user: this.fb.nonNullable.control<string | null>(null),
  });

  createEntry(): void {
    const fv = this.form.getRawValue();
    const create: CreateResource = {
      label: fv.label,
      description: fv.description,
      operation: fv.operation ?? undefined,
      user: fv.user ?? undefined,
      statusCode: undefined
    };
    this.loader.load(this.resourceService.createResource(create)).subscribe({
      next: _ => {
        this.cancel();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Creation of resource failed.`);
      },
    });
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
    ).pipe(map((res: SearchResult<Operation>): Operation[] => {
      return res.hits;
    }));
  }

  cancel() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }

}
