import { CreateGroupView } from './create-group-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { ManagementModule } from '../../management.module';
import { NotificationService } from '../../../../core/services/notification.service';
import { GroupService } from '../../../../core/services/group.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { OperationService } from '../../../../core/services/operation.service';
import { User } from '../../../../core/model/user';
import { Operation } from '../../../../core/model/operation';
import { SearchResult } from '../../../../core/util/store';

function genFactoryOptions(): SpectatorRoutingOptions<CreateGroupView> {
  return {
    component: CreateGroupView,
    imports: [
      ManagementModule,
    ],
    mocks: [
      NotificationService,
      GroupService,
      UserService,
      OperationService,
    ],
    detectChanges: false,
  };
}


describe('CreateGroupView', () => {
  let component: CreateGroupView;
  let spectator: SpectatorRouting<CreateGroupView>;
  const createComponent = createRoutingFactory(genFactoryOptions());

  const title = 'straw';
  const description = 'egg';
  const operationId = 'skirt';
  const members = ['fly', 'glass', 'combine'];
  const sampleUserData: User[] = [
    {
      id: 'fly',
      username: 'marry',
      firstName: 'well',
      lastName: 'forgive',
      isActive: true,
      isAdmin: false,
    },
    {
      id: 'glass',
      username: 'everyday',
      firstName: 'robbery',
      lastName: 'beak',
      isActive: true,
      isAdmin: false,
    },
    {
      id: 'combine',
      username: 'greet',
      firstName: 'swear',
      lastName: 'real',
      isActive: true,
      isAdmin: false,
    },
  ];
  const sampleOperation: Operation = {
    id: 'skirt',
    title: 'roof',
    description: 'temple',
    start: new Date(),
    is_archived: false,
  };

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.inject(UserService).getUserById.withArgs('fly').and.returnValue(of(sampleUserData[0]));
    spectator.inject(UserService).getUserById.withArgs('glass').and.returnValue(of(sampleUserData[1]));
    spectator.inject(UserService).getUserById.withArgs('combine').and.returnValue(of(sampleUserData[2]));
    spectator.inject(UserService).searchUsers.and.returnValue(of(new SearchResult(sampleUserData, {
      estimatedTotalHits: 3,
      offset: 0,
      limit: 5,
      query: '',
      processingTime: 10,
    })));
    spectator.inject(OperationService).getOperationById.and.returnValue(of(sampleOperation));
    spectator.inject(OperationService).searchOperations.and.returnValue(of(new SearchResult([sampleOperation], {
      estimatedTotalHits: 1,
      offset: 0,
      limit: 5,
      query: '',
      processingTime: 10,
    })));
    spectator.inject(OperationService).getOperationMembers.withArgs('skirt').and.returnValue(of(sampleUserData));
    spectator.inject(OperationService).getOperationMembers.withArgs('drop').and.returnValue(of([sampleUserData[0]]));
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable group creation without values', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should disable group creation without title', fakeAsync(() => {
    component.form.setValue({
      title: '',
      description: description,
      operation: operationId,
      members: members,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should allow group creation without description', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: '',
      operation: operationId,
      members: members,
    });
    tick();
    expect(component.form.valid).not.toBeFalse();
  }));

  it('should allow creation with all values set', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: description,
      operation: operationId,
      members: members,
    });
    tick();
    expect(component.form.valid).toBeTrue();
  }));

  describe('create group', () => {
    it('should fail  without title', fakeAsync(() => {
      component.form.setValue({
        title: '',
        description: description,
        operation: operationId,
        members: members,
      });
      tick();
      expect(component.createGroup).toThrowError();
    }));

    it('should fail  without description', fakeAsync(() => {
      component.form.setValue({
        title: title,
        description: '',
        operation: operationId,
        members: members,
      });
      tick();
      expect(component.createGroup).toThrowError();
    }));

    it('should create group correctly', fakeAsync(() => {
      component.form.setValue({
        title: title,
        description: description,
        operation: operationId,
        members: members,
      });
      tick();
      spectator.inject(GroupService).createGroup.and.returnValue(of({
        id: 'progress',
        title: title,
        description: description,
        operation: operationId,
        members: members,
      }));

      component.createGroup();
      tick();

      expect(spectator.inject(GroupService).createGroup).toHaveBeenCalledOnceWith({
        title: title,
        description: description,
        operation: operationId,
        members: members,
      });
    }));

    it('should show an error message if group creation failed', fakeAsync(() => {
      component.form.setValue(({
        title: title,
        description: description,
        operation: operationId,
        members: members,
      }));
      tick();
      spectator.inject(GroupService).createGroup.and.returnValue(throwError(() => ({})));

      component.createGroup();
      tick();
      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));
  });

  describe('searchUsers', () => {
    it('should call UserService and return correct value', fakeAsync(async () => {
      const result = await firstValueFrom(component.searchUsers(''));
      expect(result).toEqual(sampleUserData);

      expect(spectator.inject(UserService).searchUsers).toHaveBeenCalledWith({
        query: '',
        limit: 5,
        offset: 0,
      }, false);
    }));
  });
  describe('searchOperations', () => {
    it('should call OperationService and return correct value', fakeAsync(async () => {
      let searchOperationsResult = await firstValueFrom(component.searchOperations(''));
      expect(searchOperationsResult).toEqual([sampleOperation]);
      expect(spectator.inject(OperationService).searchOperations).toHaveBeenCalledWith({
        query: '',
        limit: 5,
        offset: 0,
      }, {});
    }));
  });

  it('should disable create group button when creation is not allowed', fakeAsync(async () => {
    component.form.setValue({
      title: '',
      description: '',
      operation: null,
      members: [],
    });
    spectator.detectComponentChanges();
    tick();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Create', {
      exact: false,
      selector: 'button',
    }))).toBeDisabled();
  }));

  it('should enable create group button when creation is allowed', fakeAsync(async () => {
    component.form.setValue({
      title: title,
      description: description,
      operation: operationId,
      members: members,
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Create', { selector: 'button' }))).not.toBeDisabled();
  }));

  it('should create Group when create user button is clicked', fakeAsync(async () => {
    component.form.setValue(({
      title: title,
      description: description,
      operation: operationId,
      members: members,
    }));
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    spyOn(component, 'createGroup');

    spectator.click(byTextContent('Create', { selector: 'button' }));

    expect(component.createGroup).toHaveBeenCalledOnceWith();
  }));
});
