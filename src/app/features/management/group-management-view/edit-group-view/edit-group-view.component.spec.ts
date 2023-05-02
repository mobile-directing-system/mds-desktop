import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { ManagementModule } from '../../management.module';
import { NotificationService } from '../../../../core/services/notification.service';
import { GroupService } from '../../../../core/services/group.service';
import { firstValueFrom, of, throwError } from 'rxjs';
import { UserService, UserSort } from '../../../../core/services/user.service';
import { OperationService } from '../../../../core/services/operation.service';
import { User } from '../../../../core/model/user';
import { Operation } from '../../../../core/model/operation';
import { EditGroupView } from './edit-group-view.component';
import { Group } from '../../../../core/model/group';
import { fakeAsync, flush, tick } from '@angular/core/testing';
import { SearchResult } from '../../../../core/util/store';
import { AccessControlService } from '../../../../core/services/access-control.service';
import { AccessControlMockService } from '../../../../core/services/access-control-mock.service';
import { PermissionName } from '../../../../core/permissions/permissions';

function genFactoryOptions(): SpectatorRoutingOptions<EditGroupView> {
  return {
    component: EditGroupView,
    imports: [
      ManagementModule,
    ],
    providers: [
      {
        provide: AccessControlService,
        useExisting: AccessControlMockService,
      },
    ],
    mocks: [
      NotificationService,
      GroupService,
      UserService,
      OperationService,
    ],
    params: {
      groupId: 'defend',
    },
    detectChanges: false,
  };
}


describe('EditGroupView', () => {
  let component: EditGroupView;
  let spectator: SpectatorRouting<EditGroupView>;
  const createComponent = createRoutingFactory(genFactoryOptions());

  const sampleGroup: Group = {
    id: 'defend',
    title: 'open',
    description: 'match',
    operation: 'skirt',
    members: ['fly', 'glass'],
  };
  const title = 'straw';
  const description = 'egg';
  const operationId = 'skirt';
  let members: string[];
  const sampleUserData: User[] = [
    {
      id: 'fly',
      username: 'b marry',
      firstName: 'b well',
      lastName: 'b forgive',
      isActive: true,
      isAdmin: false,
    },
    {
      id: 'glass',
      username: 'c everyday',
      firstName: 'c robbery',
      lastName: 'c beak',
      isActive: true,
      isAdmin: false,
    },
    {
      id: 'combine',
      username: 'a greet',
      firstName: 'a swear',
      lastName: 'areal',
      isActive: true,
      isAdmin: false,
    },
  ];
  const sampleOperations: Operation[] = [
    {
      id: 'skirt',
      title: 'roof',
      description: 'temple',
      start: new Date(),
      is_archived: false,
    },
    {
      id: 'drop',
      title: 'garden',
      description: 'excite',
      start: new Date(),
      is_archived: false,
    },
  ];
  const allPermissions = [
    { name: PermissionName.ViewUser },
    { name: PermissionName.ViewGroup },
    { name: PermissionName.UpdateGroup },
  ];

  beforeEach(async () => {
    members = ['fly', 'glass', 'combine'];
    spectator = createComponent();
    component = spectator.component;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.inject(GroupService).getGroupById.and.returnValue(of(sampleGroup));
    spectator.inject(UserService).getUserById.withArgs('fly').and.returnValue(of(sampleUserData[0]));
    spectator.inject(UserService).getUserById.withArgs('glass').and.returnValue(of(sampleUserData[1]));
    spectator.inject(UserService).getUserById.withArgs('combine').and.returnValue(of(sampleUserData[2]));
    spectator.inject(UserService).searchUsers.and.returnValue(of(new SearchResult(sampleUserData, {
      estimatedTotalHits: 3,
      offset: 0,
      limit: 7,
      query: '',
      processingTime: 10,
    })));
    spectator.inject(OperationService).getOperationById.withArgs('skirt').and.returnValue(of(sampleOperations[0]));
    spectator.inject(OperationService).getOperationById.withArgs('drop').and.returnValue(of(sampleOperations[1]));
    spectator.inject(OperationService).searchOperations.and.returnValue(of(new SearchResult(sampleOperations, {
      estimatedTotalHits: 2,
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

  it('should disable form without update-permissions', fakeAsync(() => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions.filter(p => p.name != PermissionName.UpdateGroup));
    spectator.setRouteParam('', '');
    tick();
    expect(component.form.disabled).toBeTrue();
  }));

  it('should show member-adding', async () => {
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('.member-adding')).toBeVisible();
  });

  it('should hide member-adding without update-permissions', async () => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions.filter(p => p.name != PermissionName.UpdateGroup));
    spectator.setRouteParam('', '');
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('.member-adding')).not.toBeVisible();
  });

  it('should hide member-adding without update-permissions', async () => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions.filter(p => p.name != PermissionName.UpdateGroup));
    spectator.setRouteParam('', '');
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('.member-adding')).not.toBeVisible();
  });

  it('should go to /groups/ when click close', fakeAsync(() => {
    spectator.click(byTextContent('Cancel', { selector: 'button' }));
    tick();
    expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['..'], { relativeTo: spectator.activatedRouteStub });
  }));

  it('should disable group update without title', fakeAsync(() => {
    component.form.setValue({
      title: '',
      description: description,
      operation: operationId,
      members: members,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should allow group update with empty description', async () => {
    await spectator.fixture.whenStable();
    component.form.setValue({
      title: title,
      description: '',
      operation: null,
      members: members,
    });
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    expect(component.form.valid).toBeTrue();
  });

  describe('updateGroup', () => {
    it('should fail without title', fakeAsync(() => {
      component.form.setValue({
        title: '',
        description: description,
        operation: operationId,
        members: members,
      });
      tick();
      expect(component.updateGroup).toThrowError();
    }));


    it('should update group correctly', fakeAsync(() => {
      component.form.setValue({
        title: title,
        description: description,
        operation: operationId,
        members: members,
      });
      tick();
      spectator.inject(GroupService).updateGroup.and.returnValue(of(void 0));

      component.updateGroup();
      tick();
      expect(spectator.inject(GroupService).updateGroup).toHaveBeenCalledOnceWith({
        id: sampleGroup.id,
        title: title,
        description: description,
        operation: operationId,
        members: members,
      });
    }));

    it('should show an error message if group update failed', fakeAsync(() => {
      component.form.setValue({
        title: title,
        description: description,
        operation: operationId,
        members: members,
      });
      tick();
      spectator.inject(GroupService).updateGroup.and.returnValue(throwError(() => ({})));

      component.updateGroup();
      tick();
      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));
  });

  describe('searchUsers', () => {
    it('should call user-service and return user-list including only users, not being members of the group', fakeAsync(async () => {
      component.form.setValue({
        title: title,
        description: description,
        operation: null,
        members: ['fly', 'glass'],
      });
      tick();
      const result = await firstValueFrom(component.searchUsers(''));
      expect(result).toEqual([sampleUserData[2]]);

      expect(spectator.inject(UserService).searchUsers).toHaveBeenCalledWith({
        query: '',
        limit: 7,
        offset: 0,
      }, false);
    }));

    it('should call user-service and return correct value', fakeAsync(async () => {
      component.form.controls.members.patchValue([]);
      tick();
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
      expect(searchOperationsResult).toEqual(sampleOperations);
      expect(spectator.inject(OperationService).searchOperations).toHaveBeenCalledWith({
        query: '',
        limit: 5,
        offset: 0,
      }, {});
    }));
  });

  describe('addMembers', () => {
    it('should only add members that are not already a member of the group', fakeAsync(() => {
      component.form.setValue({
        title: title,
        description: description,
        operation: null,
        members: ['combine', 'glass'],
      });
      component.membersToAddForm.patchValue(['combine', 'fly']);
      tick();
      component.addMembers();
      tick();

      expect(component.form.controls.members.value).toEqual(['fly', 'combine', 'glass']);
    }));
  });

  describe('removeMember', () => {
    it('should remove the member from member-list correctly', fakeAsync(() => {
      component.removeMember('glass');
      tick();
      expect(component.groupMembers.map(x => x.id).includes('glass')).toBeFalse();
      expect(component.form.controls.members.value.includes('glass')).toBeFalse();
    }));
  });

  describe('memberValidation for group with operation to only include members of operation', () => {
    it('should disable form if group contains members that are not member of the selected operation', fakeAsync(async () => {
      await spectator.fixture.whenStable();
      component.form.setValue({
        title: title,
        description: description,
        operation: 'drop',
        members: members,
      });
      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(spectator.inject(OperationService).getOperationMembers).toHaveBeenCalledWith('drop');
      expect(component.form.valid).toBeFalse();
    }));

    it('should allow group update with any members if no operation was set', fakeAsync(async () => {
      await spectator.fixture.whenStable();
      component.form.setValue({
        title: title,
        description: description,
        operation: null,
        members: members,
      });
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      expect(component.form.valid).toBeTrue();
    }));

    it('should allow group update if all members are also members of the selected operation', fakeAsync(async () => {
      await spectator.fixture.whenStable();
      component.form.setValue({
        title: title,
        description: description,
        operation: 'skirt',
        members: members,
      });
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      expect(spectator.inject(OperationService).getOperationMembers).toHaveBeenCalledWith('skirt');
      expect(component.form.valid).toBeTrue();
    }));
  });

  it('should disable update group button when update is not allowed', fakeAsync(async () => {
    component.form.setValue({
      title: '',
      description: '',
      operation: null,
      members: [],
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Update', { selector: 'button' }))).toBeDisabled();
  }));

  it('should load data of members when members form value changes', fakeAsync(async () => {
    component.form.setValue({
      title: title,
      description: description,
      operation: operationId,
      members: members,
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.inject(UserService).getUserById).toHaveBeenCalled();
  }));

  it('should show data of members in table', fakeAsync(async () => {
    component.form.setValue({
      title: title,
      description: description,
      operation: operationId,
      members: members,
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    sampleUserData.forEach(expectMember => {
      const attributes = [expectMember.username, expectMember.firstName, expectMember.lastName];
      attributes.forEach(expectAttribute => {
        expect(spectator.query(byTextContent(expectAttribute, {
          exact: false,
          selector: 'td',
        }))).withContext(`should show group attribute ${ expectAttribute } from group ${ expectMember.id }`).toBeVisible();
      });
    });
  }));

  it('should show remove-icons in member list', async () => {
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    component.form.patchValue({
      members: members,
    });
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('close', {
      exact: false,
      selector: 'mat-icon',
    }))).toBeVisible();
  });

  it('should hide remove-icons in member list without update permissions', fakeAsync(async () => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions.filter(p => p.name != PermissionName.UpdateGroup));
    component.form.patchValue({
      members: members,
    });
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('close', {
      exact: false,
      selector: 'mat-icon',
    }))).not.toBeVisible();
  }));

  describe('addMembers button', () => {
    it('should be visible if membersToAddForm contains values', fakeAsync(async () => {
      component.membersToAddForm.patchValue(['combine', 'fly']);
      tick();
      await spectator.fixture.whenStable();
      expect(byTextContent('Add Members', {
        exact: false,
        selector: 'button',
      })).toBeVisible();
    }));

    it('should not be visible if membersToAddForm contains no values', fakeAsync(async () => {
      component.membersToAddForm.patchValue([]);
      await spectator.fixture.whenStable();
      expect(spectator.query(byTextContent('Add Members', {
        exact: false,
        selector: 'button',
      }))).not.toBeVisible();
    }));
  });

  describe('member order-by', () => {
    const tests: {
      column: string,
      orderBy: UserSort,
    }[] = [
      {
        column: 'Last name',
        orderBy: UserSort.ByLastName,
      },
      {
        column: 'First name',
        orderBy: UserSort.ByFirstName,
      },
      {
        column: 'Username',
        orderBy: UserSort.ByUsername,
      },
    ];
    tests.forEach(tt => {
      it(`should order by ${ tt.column } correctly`, fakeAsync(async () => {
        component.form.setValue({
          title: title,
          description: description,
          operation: operationId,
          members: members,
        });
        spectator.detectComponentChanges();
        tick();
        const columnHeader = byTextContent(tt.column, {
          exact: false,
          selector: 'tr th',
        });
        spectator.click(columnHeader);
        expect(component.groupMembers[0].id === 'combine').toBeTrue();
        spectator.click(columnHeader);
        expect(component.groupMembers[0].id === 'glass').toBeTrue();
      }));
    });
  });

  it('should enable update group button when update is allowed', fakeAsync(async () => {
    component.form.setValue({
      title: title,
      description: description,
      operation: operationId,
      members: members,
    });
    tick();
    flush();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Update', { selector: 'button' }))).not.toBeDisabled();
  }));

  it('should update group when update group button is clicked', fakeAsync(async () => {
    component.form.setValue(({
      title: title,
      description: description,
      operation: operationId,
      members: members,
    }));

    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    spyOn(component, 'updateGroup');

    spectator.click(byTextContent('Update', { selector: 'button' }));

    expect(component.updateGroup).toHaveBeenCalledOnceWith();
  }));

  it('should disable delete button without delete-permissions', fakeAsync(() => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted(allPermissions.filter(p => p.name != PermissionName.DeleteGroup));
    spectator.setRouteParam('', '');
    tick();
    expect(spectator.query(byTextContent('Delete', { selector: 'app-delete-confirm-button' }))).not.toBeVisible();
  }));
});
