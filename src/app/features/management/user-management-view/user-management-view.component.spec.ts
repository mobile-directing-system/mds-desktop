import { UserManagementView } from './user-management-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { CoreModule } from '../../../core/core.module';
import { UserService, UserSort } from '../../../core/services/user.service';
import { User } from '../../../core/model/user';
import {
  createSearchParams,
  OrderDir,
  Paginated,
  PaginationParams,
  SearchParams,
  SearchResult,
} from '../../../core/util/store';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { ManagementModule } from '../management.module';
import { Sort } from '@angular/material/sort';
import createSpy = jasmine.createSpy;

describe('UserManagementView', () => {
  let spectator: SpectatorRouting<UserManagementView>;
  let component: UserManagementView;
  const createComponent = createRoutingFactory({
    component: UserManagementView,
    imports: [
      CoreModule,
      ManagementModule,
    ],
    mocks: [
      UserService,
    ],
    detectChanges: false,
  });
  const sampleUsers: User[] = [
    {
      id: 'ladder',
      firstName: 'proposal',
      lastName: 'fail',
      username: 'bundle',
      isActive: true,
      isAdmin: true,
    },
    {
      id: 'corner',
      firstName: 'home',
      lastName: 'bright',
      username: 'prove',
      isActive: true,
      isAdmin: false,
    },
    {
      id: 'pour',
      firstName: 'sugar',
      lastName: 'pure',
      username: 'busy',
      isActive: false,
      isAdmin: false,
    },
  ];
  const samplePaginatedUsers: Paginated<User> = new Paginated<User>(sampleUsers, {
    limit: 3,
    retrieved: 3,
    total: 42,
    offset: 0,
  });

  beforeEach(fakeAsync(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.inject(UserService).getUsers.and.returnValue(of(samplePaginatedUsers));
    spectator.detectComponentChanges();
    tick();
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should load users', () => {
    expect(component.loadedUsers).toEqual(samplePaginatedUsers);
  });

  it('should refresh correctly on page-event', fakeAsync(() => {
    const samplePaginationParams = new PaginationParams<string>(2, 4);

    component.page(samplePaginationParams);
    tick();

    expect(spectator.inject(UserService).getUsers).toHaveBeenCalledWith(samplePaginationParams);
  }));

  it('should refresh correctly on sort-event', fakeAsync(() => {
    if (!component.pagination) {
      fail('missing pagination');
      return;
    }
    const sampleSort: Sort = {
      active: 'lastName',
      direction: 'desc',
    };
    component.sortChange(sampleSort);
    tick();

    const expectParams: PaginationParams<UserSort> = component.pagination.clone();
    expectParams.applyOrderBy(UserSort.ByLastName, OrderDir.Desc);
    expect(spectator.inject(UserService).getUsers).toHaveBeenCalledWith(expectParams);
  }));

  it('should search users correctly', fakeAsync(() => {
    if (!component.pagination) {
      fail('missing pagination');
      return;
    }
    const term = 'husband';
    const sampleUser: User = {
      id: 'basket',
      firstName: 'blow',
      lastName: 'opinion',
      isAdmin: false,
      isActive: true,
      username: 'breathe',
    };
    spectator.inject(UserService).searchUsers.and.returnValue(of(new SearchResult([sampleUser], {
      limit: 2,
      offset: 4,
      query: term,
      processingTime: 914,
      estimatedTotalHits: 270,
    })));

    component.searchChange(term);
    tick();

    const expectSearchParams: SearchParams = createSearchParams(component.pagination, term);
    expect(spectator.inject(UserService).searchUsers).toHaveBeenCalledOnceWith(expectSearchParams, true);
  }));

  describe('createUser', () => {
    it('should navigate to create-user-view', () => {
      spectator.router.navigate = createSpy().and.resolveTo();
      component.createUser();
      expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['create'], { relativeTo: spectator.activatedRouteStub });
    });
  });

  describe('fixture', () => {
    beforeEach(fakeAsync(async () => {
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
    }));

    it('should have a descriptive heading', () => {
      expect(spectator.query(byTextContent('Users', {
        exact: false,
        selector: 'h1',
      }))).toBeVisible();
    });

    it('should show a button for creating users', () => {
      expect(spectator.query(byTextContent('Create User', {
        exact: false,
        selector: 'button',
      }))).toBeVisible();
    });

    it('should create user on button click', () => {
      const createSpy = spyOn(component, 'createUser');
      spectator.click(byTextContent('Create User', {
        exact: false,
        selector: 'button',
      }));
      expect(createSpy).toHaveBeenCalledOnceWith();
    });

    it('should show user table', () => {
      expect(spectator.query('table')).toBeVisible();
    });

    it('should show user attributes in table', () => {
      sampleUsers.forEach(expectUser => {
        const attributes = [expectUser.firstName, expectUser.lastName];
        attributes.forEach(expectAttribute => {
          expect(spectator.query(byTextContent(expectAttribute, {
            exact: false,
            selector: 'td',
          }))).withContext(`should show user attribute ${ expectAttribute } from user ${ expectUser.id }`).toBeVisible();
        });
      });
    });

    it('should display inactive users correctly in table', fakeAsync(async () => {
      const inactiveUser: User = {
        id: 'pour',
        firstName: 'sugar',
        lastName: 'pure',
        username: 'busy',
        isActive: false,
        isAdmin: false,
      };
      spectator.inject(UserService).getUsers.and.returnValue(of(samplePaginatedUsers.changeResultType([inactiveUser])));
      component.refresh();
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      const row = spectator.query(byTextContent(inactiveUser.lastName, {
        exact: false,
        selector: 'tr',
      }));
      expect(row).withContext('should show row').toBeVisible();
      if (!row) {
        return;
      }
      expect(row.querySelector('mat-icon')).withContext('should show icon for inactive user').toBeVisible();
    }));

    it('should display admin users correctly in table', fakeAsync(async () => {
      const adminUser: User = {
        id: 'pour',
        firstName: 'sugar',
        lastName: 'pure',
        username: 'busy',
        isActive: true,
        isAdmin: true,
      };
      spectator.inject(UserService).getUsers.and.returnValue(of(samplePaginatedUsers.changeResultType([adminUser])));
      component.refresh();
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      const row = spectator.query(byTextContent(adminUser.lastName, {
        exact: false,
        selector: 'tr',
      }));
      expect(row).withContext('should show row').toBeVisible();
      if (!row) {
        return;
      }
      expect(row.querySelector('mat-icon')).withContext('should show icon for admin user').toBeVisible();
    }));

    it('should display regular users correctly in table', fakeAsync(async () => {
      const regularUser: User = {
        id: 'pour',
        firstName: 'sugar',
        lastName: 'pure',
        username: 'busy',
        isActive: true,
        isAdmin: false,
      };
      spectator.inject(UserService).getUsers.and.returnValue(of(samplePaginatedUsers.changeResultType([regularUser])));
      component.refresh();
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      const row = spectator.query(byTextContent(regularUser.lastName, {
        exact: false,
        selector: 'tr',
      }));
      expect(row).withContext('should show row').toBeVisible();
      if (!row) {
        return;
      }
      expect(row.querySelector('mat-icon')).withContext('should not show icons for regular user').not.toBeVisible();
    }));

    it('should edit user on user-row clicked', fakeAsync(async () => {
      const sampleUser: User = {
        id: 'pour',
        firstName: 'sugar',
        lastName: 'pure',
        username: 'busy',
        isActive: true,
        isAdmin: false,
      };
      spectator.inject(UserService).getUsers.and.returnValue(of(samplePaginatedUsers.changeResultType([sampleUser])));
      component.refresh();
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      const navigateSpy = spyOn(component, 'navigateToUser');
      spectator.click(byTextContent(sampleUser.lastName, {
        exact: false,
        selector: 'tr',
      }));
      expect(navigateSpy).toHaveBeenCalledOnceWith(sampleUser.id);
    }));

    it('should navigate to edit user view when clicking row', fakeAsync(async () => {
      spectator.router.navigate = createSpy().and.resolveTo();
      const sampleUser: User = {
        id: 'draw',
        firstName: 'term',
        lastName: 'valuable',
        username: 'busy',
        isActive: true,
        isAdmin: false,
      };
      spectator.inject(UserService).getUsers.and.returnValue(of(samplePaginatedUsers.changeResultType([sampleUser])));
      component.refresh();
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      spectator.click(byTextContent(sampleUser.username, {
        exact: false,
        selector: 'tr',
      }));
      expect(spectator.router.navigate).toHaveBeenCalledWith([sampleUser.id], { relativeTo: spectator.activatedRouteStub });
    }));

    describe('order-by', () => {
      const tests: {
        column: string,
        orderBy: UserSort,
      }[] = [
        {
          column: 'First name',
          orderBy: UserSort.ByFirstName,
        },
        {
          column: 'Last name',
          orderBy: UserSort.ByLastName,
        },
        {
          column: 'Username',
          orderBy: UserSort.ByUsername,
        },
      ];
      tests.forEach(tt => {
        it(`should order by ${ tt.column } correctly`, () => {
          if (!component.pagination) {
            fail('missing pagination');
            return;
          }

          let expectParams: PaginationParams<UserSort> = component.pagination.clone();
          expectParams.applyOrderBy(tt.orderBy, OrderDir.Asc);
          const columnHeader = byTextContent(tt.column, {
            exact: false,
            selector: 'tr th',
          });
          spectator.click(columnHeader);
          expect(spectator.inject(UserService).getUsers).withContext('first').toHaveBeenCalledWith(expectParams);
          expectParams.applyOrderBy(expectParams.orderBy, OrderDir.Desc);
          spectator.click(columnHeader);
          expect(spectator.inject(UserService).getUsers).withContext('second').toHaveBeenCalledWith(expectParams);
          expectParams.applyOrderBy(undefined, undefined);
          spectator.click(columnHeader);
          expect(spectator.inject(UserService).getUsers).withContext('third').toHaveBeenCalledWith(expectParams);
        });
      });
    });

    it('should navigate to create-user-route when create button is clicked', () => {
      const createUserSpy = spyOn(component, 'createUser');
      spectator.click(byTextContent('Create user', {
        exact: false,
        selector: 'button',
      }));
      expect(createUserSpy).toHaveBeenCalledOnceWith();
    });
  });
});
