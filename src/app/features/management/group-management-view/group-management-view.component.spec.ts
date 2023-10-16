import { byTextContent, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { CoreModule } from '../../../core/core.module';
import { UserService } from '../../../core/services/user.service';
import { ManagementModule } from '../management.module';
import { GroupManagementView, GroupTableRowContent } from './group-management-view.component';
import { GroupService, GroupSort } from '../../../core/services/group.service';
import { OperationService } from '../../../core/services/operation.service';
import { Group } from '../../../core/model/group';
import { Operation } from '../../../core/model/operation';
import { OrderDir, Paginated, PaginationParams } from '../../../core/util/store';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { AccessControlService } from '../../../core/services/access-control.service';
import { AccessControlMockService } from '../../../core/services/access-control-mock.service';

describe('GroupManagementView', () => {
  let spectator: SpectatorRouting<GroupManagementView>;
  let component: GroupManagementView;
  const createComponent = createRoutingFactory({
    component: GroupManagementView,
    imports: [
      CoreModule,
      ManagementModule,
    ],
    providers: [
      {
        provide: AccessControlService,
        useExisting: AccessControlMockService,
      },
    ],
    mocks: [
      UserService,
      GroupService,
      OperationService,
    ],
    detectChanges: false,
  });

  const sampleGroups: Group[] = [
    {
      id: 'form',
      title: 'obedient',
      description: 'zero',
      operation: 'anyhow',
      members: [
        'mine',
        'mud',
        'sympathy',
      ],
    },
    {
      id: 'flour',
      title: 'priest',
      description: 'being',
      members: [
        'mine',
        'mud',
        'sympathy',
      ],
    },
    {
      id: 'angry',
      title: 'universe',
      description: 'plain',
      operation: 'anyhow',
      members: [
        'mine',
        'sympathy',
      ],
    },
  ];

  const sampleOperation: Operation = {
    id: 'anyhow',
    title: 'person',
    description: 'belong',
    start: new Date(2022, 9, 9),
    isArchived: false,
  };

  const sampleIGroupTableContents: GroupTableRowContent[] = [
    {
      group: sampleGroups[0],
      operation: sampleOperation,
    },
    {
      group: sampleGroups[1],
      operation: null,
    },
    {
      group: sampleGroups[2],
      operation: sampleOperation,
    },
  ];

  const samplePaginatedGroups: Paginated<Group> = new Paginated<Group>(sampleGroups, {
    limit: 3,
    retrieved: 3,
    total: 44,
    offset: 0,
  });

  const samplePaginatedGroupsTableContents: Paginated<GroupTableRowContent> = new Paginated<GroupTableRowContent>(sampleIGroupTableContents, {
    limit: 3,
    retrieved: 3,
    total: 44,
    offset: 0,
  });

  beforeEach(fakeAsync(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.inject(GroupService).getGroups.and.returnValue(of(samplePaginatedGroups));
    spectator.inject(OperationService).getOperationById.and.returnValue(of(sampleOperation));
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.detectComponentChanges();
    tick();
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should load groups', () => {
    expect(component.loadedGroupTableData).toEqual(samplePaginatedGroupsTableContents);
  });

  it('should refresh correctly on page-event', fakeAsync(() => {
    const samplePaginationParams = new PaginationParams<string>(2, 4);

    component.page(samplePaginationParams);
    tick();

    expect(spectator.inject(GroupService).getGroups).toHaveBeenCalledWith(samplePaginationParams, {});
  }));

  it('should refresh correctly on sort-event', fakeAsync(() => {
    if (!component.pagination) {
      fail('missing pagination');
      return;
    }
    const sampleSort: Sort = {
      active: 'byTitle',
      direction: 'desc',
    };
    component.sortChange(sampleSort);
    tick();

    const expectParams: PaginationParams<GroupSort> = component.pagination.clone();
    expectParams.applyOrderBy(GroupSort.ByTitle, OrderDir.Desc);
    expect(spectator.inject(GroupService).getGroups).toHaveBeenCalledWith(expectParams, {});
  }));

  describe('fixture', () => {
    beforeEach(fakeAsync(async () => {
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
    }));

    it('should have a descriptive heading', () => {
      expect(spectator.query(byTextContent('Roles', {
        exact: false,
        selector: 'h1',
      }))).toBeVisible();
    });

    it('should show a button for creating groups', () => {
      expect(spectator.query(byTextContent('Create Role', {
        exact: false,
        selector: 'button',
      }))).toBeVisible();
    });

    it('should call createGroup on button click', () => {
      const createSpy = spyOn(component, 'createGroup');
      spectator.click(byTextContent('Create Role', {
        exact: false,
        selector: 'button',
      }));
      expect(createSpy).toHaveBeenCalledOnceWith();
    });

    it('should navigate to Group/Create on button click', () => {
      spectator.click(byTextContent('Create Role', {
        exact: false,
        selector: 'button',
      }));
      expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['create'], { relativeTo: spectator.activatedRouteStub });
    });

    it('should show group table', () => {
      expect(spectator.query('table')).toBeVisible();
    });

    it('should show group attributes in table', () => {
      sampleGroups.forEach(expectGroup => {
        const attributes = !expectGroup.operation ? [expectGroup.title, expectGroup.description] : [expectGroup.title, expectGroup.description, sampleOperation.title];
        attributes.forEach(expectAttribute => {
          expect(spectator.query(byTextContent(expectAttribute, {
            exact: false,
            selector: 'td',
          }))).withContext(`should show role attribute ${ expectAttribute } from role ${ expectGroup.id }`).toBeVisible();
        });
      });
    });

    it('should call navigateToGroup on group-row clicked', fakeAsync(async () => {
      const sampleGroup: Group = {
        id: 'pour',
        title: 'adopt',
        description: 'enter',
        members: [],
      };

      spectator.inject(GroupService).getGroups.and.returnValue(of(samplePaginatedGroups.changeResultType([sampleGroup])));
      component.refresh();
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      const editSpy = spyOn(component, 'navigateToGroup');
      spectator.click(byTextContent(sampleGroup.title, {
        exact: false,
        selector: 'tr',
      }));
      expect(editSpy).toHaveBeenCalledOnceWith(sampleGroup.id);
    }));

    describe('editGroup', () => {
      it('should navigate to edit group view', fakeAsync(async () => {
        const sampleGroup: Group = {
          id: 'pour',
          title: 'holy',
          description: 'enter',
          members: [],
        };
        spectator.inject(GroupService).getGroups.and.returnValue(of(samplePaginatedGroups.changeResultType([sampleGroup])));
        component.refresh();
        tick();
        spectator.detectComponentChanges();
        await spectator.fixture.whenStable();

        spectator.click(byTextContent(sampleGroup.title, {
          exact: false,
          selector: 'tr',
        }));
        expect(spectator.router.navigate).toHaveBeenCalledWith([sampleGroup.id], { relativeTo: spectator.activatedRouteStub });
      }));
    });

    describe('order-by', () => {
      const tests: {
        column: string,
        orderBy: GroupSort,
      }[] = [
        {
          column: 'title',
          orderBy: GroupSort.ByTitle,
        },
        {
          column: 'description',
          orderBy: GroupSort.ByDescription,
        },
      ];
      tests.forEach(tt => {
        it(`should order by ${ tt.column } correctly`, () => {
          if (!component.pagination) {
            fail('missing pagination');
            return;
          }

          let expectParams: PaginationParams<GroupSort> = component.pagination.clone();
          expectParams.applyOrderBy(tt.orderBy, OrderDir.Asc);
          const columnHeader = byTextContent(tt.column, {
            exact: false,
            selector: 'tr th',
          });
          spectator.click(columnHeader);
          expect(spectator.inject(GroupService).getGroups).withContext('first').toHaveBeenCalledWith(expectParams, {});
          expectParams.applyOrderBy(expectParams.orderBy, OrderDir.Desc);
          spectator.click(columnHeader);
          expect(spectator.inject(GroupService).getGroups).withContext('second').toHaveBeenCalledWith(expectParams, {});
          expectParams.applyOrderBy(undefined, undefined);
        });
      });
    });
  });

  it('should hide create button when missing appropriate permissions', async () => {
    spectator.inject(AccessControlMockService).setNoAdminAndGranted([]);
    await spectator.fixture.whenStable();
    expect(spectator.query(byTextContent('Create role', {
      exact: false,
      selector: 'button',
    }))).toBeVisible();
  });
});
