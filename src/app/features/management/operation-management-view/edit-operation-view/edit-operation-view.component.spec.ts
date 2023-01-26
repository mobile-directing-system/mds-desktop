import { EditOperationViewComponent } from './edit-operation-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { ManagementModule } from '../../management.module';
import { CoreModule } from '../../../../core/core.module';
import { NotificationService } from '../../../../core/services/notification.service';
import { OperationService } from '../../../../core/services/operation.service';
import { User } from '../../../../core/model/user';
import { Operation } from '../../../../core/model/operation';
import { firstValueFrom, of } from 'rxjs';
import { UserService, UserSort } from '../../../../core/services/user.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { SearchResult } from '../../../../core/util/store';

function genFactoryOptions(): SpectatorRoutingOptions<EditOperationViewComponent> {
  return {
    component: EditOperationViewComponent,
    imports: [
      ManagementModule,
      CoreModule,
    ],
    mocks: [
      NotificationService,
      UserService,
      OperationService,
    ],
    params: {
      operationId: 'defend',
    },
    detectChanges: false,
  };
}

describe('EditOperationViewComponent', () => {
  let spectator: SpectatorRouting<EditOperationViewComponent>;
  let component: EditOperationViewComponent;
  const createComponent = createRoutingFactory(genFactoryOptions());

  const sampleOp: Operation = {
    id: 'defend',
    title: 'delivery',
    description: 'wage',
    start: new Date(2023, 9, 9, 12, 0, 0, 0),
    end: new Date(2023, 10, 10, 12, 0, 0, 0),
    is_archived: false,
  };

  const title = 'spring';
  const description = 'step';
  const startDate = new Date(2024, 9, 9, 12, 0, 0, 0);
  const endDateSmallerThanStartDate = new Date(2024, 8, 8, 12, 0, 0, 0);
  const endDateGreaterThanStartDate = new Date(2024, 10, 10, 12, 0, 0, 0);
  const endDateExactlyEqualToStartDate = new Date(2024, 9, 9, 12, 0, 0, 0);
  const endDateWithEqualDateButSmallerTime = new Date(2024, 9, 9, 11, 0, 0, 0);
  const endDateWithEqualDateButGreaterTime = new Date(2024, 9, 9, 14, 0, 0, 0);
  const isArchived = false;

  const originalOperationMembers = [
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
  ];

  const members = ['fly', 'glass', 'combine'];
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

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.inject(OperationService).getOperationById.and.returnValue(of(sampleOp));
    spectator.inject(OperationService).getOperationMembers.and.returnValue(of(originalOperationMembers));
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
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to /operations/ when click on close', fakeAsync(() => {
    spectator.click(byTextContent('Cancel', { selector: 'button' }));
    tick();
    expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['..'], { relativeTo: spectator.activatedRouteStub });
  }));

  it('should disable operation update without title', fakeAsync(() => {
    component.form.setValue({
      title: '',
      description: description,
      start: startDate,
      end: endDateGreaterThanStartDate,
      isArchived: isArchived,
      members: members,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should allow operation update with empty description', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: '',
      start: startDate,
      end: endDateGreaterThanStartDate,
      isArchived: isArchived,
      members: members,
    });
    tick();
    expect(component.form.valid).toBeTrue();
  }));

  it('should disable operation update without valid end date 1', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: description,
      start: startDate,
      end: endDateSmallerThanStartDate,
      isArchived: isArchived,
      members: members,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should disable operation update without valid end date 2', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: description,
      start: startDate,
      end: endDateWithEqualDateButSmallerTime,
      isArchived: isArchived,
      members: members,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should disable operation update without valid end date 2', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: description,
      start: startDate,
      end: endDateExactlyEqualToStartDate,
      isArchived: isArchived,
      members: members,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should allow operation update with all valid values 1', fakeAsync(() => {
    component.form.patchValue({
      title: title,
      description: description,
      start: startDate,
      end: undefined,
      isArchived: isArchived,
      members: members,
    });
    tick();
    expect(component.form.valid).toBeTrue();
  }));

  it('should allow operation update with all valid values 2', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: description,
      start: startDate,
      end: endDateGreaterThanStartDate,
      isArchived: isArchived,
      members: members,
    });
    tick();
    expect(component.form.valid).toBeTrue();
  }));

  it('should allow operation update with all valid values 3', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: description,
      start: startDate,
      end: endDateWithEqualDateButGreaterTime,
      isArchived: isArchived,
      members: members,
    });
    tick();
    expect(component.form.valid).toBeTrue();
  }));

  describe('searchUsers', () => {
    it('should call UserService and return correct value that does not contain users, that are not already members of the group', fakeAsync(async () => {
      const result = await firstValueFrom(component.searchUsers(''));
      expect(result).toEqual([sampleUserData[2]]);

      expect(spectator.inject(UserService).searchUsers).toHaveBeenCalledWith({
        query: '',
        limit: 7,
        offset: 0,
      }, false);
    }));

    it('should call UserService and return correct value', fakeAsync(async () => {
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

  describe('addMembers', () => {
    it('should only add members that are not already a member of the operation', fakeAsync(() => {
      component.form.controls.members.patchValue(['glass', 'fly']);
      component.membersToAddForm.patchValue(['combine', 'fly']);
      tick();
      component.addMembers();
      tick();

      expect(component.form.controls.members.value).toEqual(['combine', 'glass', 'fly']);
    }));
  });

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

  describe('removeMember', () => {
    it('should remove the member from member-list correctly', fakeAsync(() => {
      component.removeMember('glass');
      tick();
      expect(component.operationMembers.map(x => x.id).includes('glass')).toBeFalse();
      expect(component.form.controls.members.value.includes('glass')).toBeFalse();
    }));
  });

  it('should load data of members when form value changes', fakeAsync(async () => {
    component.form.setValue({
      title: title,
      description: description,
      start: startDate,
      end: endDateWithEqualDateButGreaterTime,
      isArchived: isArchived,
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
      start: startDate,
      end: endDateWithEqualDateButGreaterTime,
      isArchived: isArchived,
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

  describe('updateOperation', () => {
    it('should fail without title', fakeAsync(() => {
      component.form.setValue({
        title: title,
        description: description,
        start: startDate,
        end: endDateWithEqualDateButGreaterTime,
        isArchived: isArchived,
        members: members,
      });
      tick();
      expect(component.updateOperation).toThrowError();
    }));

    it('should fail without description', fakeAsync(() => {
      component.form.setValue({
        title: title,
        description: description,
        start: startDate,
        end: endDateWithEqualDateButGreaterTime,
        isArchived: isArchived,
        members: members,
      });
      tick();
      expect(component.updateOperation).toThrowError();
    }));

    it('should update operation correctly and update members 1', fakeAsync(() => {
      component.form.patchValue({
        title: title,
        description: description,
        start: startDate,
        end: endDateWithEqualDateButGreaterTime,
        isArchived: isArchived,
        members: members,
      });
      tick();
      spectator.inject(OperationService).updateOperation.and.returnValue(of(void 0));
      spectator.inject(OperationService).updateOperationMembers.and.returnValue(of(void 0));

      component.updateOperation();
      tick();

      expect(spectator.inject(OperationService).updateOperation).toHaveBeenCalledOnceWith({
        id: sampleOp.id,
        title: title,
        description: description,
        start: startDate,
        end: endDateWithEqualDateButGreaterTime,
        is_archived: isArchived,
      });

      expect(spectator.inject(OperationService).updateOperationMembers).toHaveBeenCalledOnceWith(sampleOp.id, members);
    }));
  });

  describe('order-by', () => {
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
          start: startDate,
          end: endDateWithEqualDateButGreaterTime,
          isArchived: isArchived,
          members: members,
        });
        tick();
        await spectator.fixture.whenStable();
        const columnHeader = byTextContent(tt.column, {
          exact: false,
          selector: 'tr th',
        });
        spectator.click(columnHeader);
        await spectator.fixture.whenStable();
        expect(component.operationMembers[0].id === 'combine').toBeTrue();
        spectator.click(columnHeader);
        await spectator.fixture.whenStable();
        expect(component.operationMembers[0].id === 'glass').toBeTrue();
      }));
    });
  });
});
