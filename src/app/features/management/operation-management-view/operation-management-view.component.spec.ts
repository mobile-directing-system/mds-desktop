import { OperationManagementView } from './operation-management-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { CoreModule } from '../../../core/core.module';
import { OperationService, OperationSort } from '../../../core/services/operation.service';
import { Operation } from '../../../core/model/operation';
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
import anything = jasmine.anything;

describe('OperationManagementView', () => {
  let spectator: SpectatorRouting<OperationManagementView>;
  let component: OperationManagementView;
  const createComponent = createRoutingFactory({
    component: OperationManagementView,
    imports: [
      CoreModule,
      ManagementModule,
    ],
    mocks: [
      OperationService,
    ],
    detectChanges: false,
  });
  const sampleOperations: Operation[] = [
    {
      id: 'ladder',
      title: 'satisfy',
      description: 'give',
      start: new Date('2001-01-01'),
      end: new Date('2001-01-02'),
      is_archived: true,
    },
    {
      id: 'music',
      title: 'diamond',
      description: '',
      start: new Date('2002-01-01'),
      end: undefined,
      is_archived: false,
    },
    {
      id: 'apply',
      title: 'saucer',
      description: 'urgent',
      start: new Date('2023-01-01'),
      end: new Date('2023-01-02'),
      is_archived: false,
    },
  ];
  const samplePaginatedOperations: Paginated<Operation> = new Paginated<Operation>(sampleOperations, {
    limit: 3,
    retrieved: 3,
    total: 42,
    offset: 0,
  });

  beforeEach(fakeAsync(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.inject(OperationService).getOperations.and.returnValue(of(samplePaginatedOperations));
    spectator.detectComponentChanges();
    tick();
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should load operations', () => {
    expect(component.loadedOperations).toEqual(samplePaginatedOperations);
  });

  it('should refresh correctly on page-event', fakeAsync(() => {
    const samplePaginationParams = new PaginationParams<string>(2, 4);

    component.page(samplePaginationParams);
    tick();

    expect(spectator.inject(OperationService).getOperations).toHaveBeenCalledWith(samplePaginationParams, anything());
  }));

  it('should refresh correctly on sort-event', fakeAsync(() => {
    if (!component.pagination) {
      fail('missing pagination');
      return;
    }
    const sampleSort: Sort = {
      active: 'title',
      direction: 'desc',
    };
    component.sortChange(sampleSort);
    tick();

    const expectParams: PaginationParams<OperationSort> = component.pagination.clone();
    expectParams.applyOrderBy(OperationSort.ByTitle, OrderDir.Desc);
    expect(spectator.inject(OperationService).getOperations).toHaveBeenCalledWith(expectParams, anything());
  }));

  it('should search operations correctly', fakeAsync(() => {
    if (!component.pagination) {
      fail('missing pagination');
      return;
    }
    const term = 'husband';
    const sampleOperation: Operation = {
      id: 'basket',
      title: 'whole',
      description: 'water',
      start: new Date('2023-01-02'),
      end: undefined,
      is_archived: false,
    };
    spectator.inject(OperationService).searchOperations.and.returnValue(of(new SearchResult([sampleOperation], {
      limit: 2,
      offset: 4,
      query: term,
      processingTime: 914,
      estimatedTotalHits: 270,
    })));

    component.searchChange(term);
    tick();

    const expectSearchParams: SearchParams = createSearchParams(component.pagination, term);
    expect(spectator.inject(OperationService).searchOperations).toHaveBeenCalledOnceWith(expectSearchParams, anything());
  }));

  describe('createOperation', () => {
    it('should navigate to create-operation-view', () => {
      spectator.router.navigate = createSpy().and.resolveTo();
      component.createOperation();
      expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['create'], { relativeTo: spectator.activatedRouteStub });
    });
  });

  describe('fixture', () => {
    beforeEach(fakeAsync(async () => {
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
    }));

    it('should have a descriptive heading', () => {
      expect(spectator.query(byTextContent('Operations', {
        exact: false,
        selector: 'h1',
      }))).toBeVisible();
    });

    it('should show a button for creating operations', () => {
      expect(spectator.query(byTextContent('Create Operation', {
        exact: false,
        selector: 'button',
      }))).toBeVisible();
    });

    it('should create operation on button click', () => {
      const createSpy = spyOn(component, 'createOperation');
      spectator.click(byTextContent('Create Operation', {
        exact: false,
        selector: 'button',
      }));
      expect(createSpy).toHaveBeenCalledOnceWith();
    });

    it('should show operation table', () => {
      expect(spectator.query('table')).toBeVisible();
    });

    it('should show operation attributes in table', () => {
      sampleOperations.forEach(expectOperation => {
        const attributes = [expectOperation.title, expectOperation.description];
        attributes.forEach(expectAttribute => {
          expect(spectator.query(byTextContent(expectAttribute, {
            exact: false,
            selector: 'td',
          }))).withContext(`should show operation attribute ${ expectAttribute } from operation ${ expectOperation.id }`).toBeVisible();
        });
      });
    });

    it('should display archived operations correctly in table', fakeAsync(async () => {
      const inactiveOperation: Operation = {
        id: 'basket',
        title: 'whole',
        description: 'water',
        start: new Date('2020-01-02'),
        end: undefined,
        is_archived: true,
      };
      spectator.inject(OperationService).getOperations.and.returnValue(of(samplePaginatedOperations.changeResultType([inactiveOperation])));
      component.refresh();
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      const row = spectator.query(byTextContent(inactiveOperation.title, {
        exact: false,
        selector: 'tr',
      }));
      expect(row).withContext('should show row').toBeVisible();
      if (!row) {
        return;
      }
      expect(row.querySelector('mat-icon')).withContext('should show icon for inactive operation').toBeVisible();
    }));

    it('should display planned operations correctly in table', fakeAsync(async () => {
      const startTS = new Date();
      startTS.setFullYear(new Date().getFullYear() + 1);
      const inactiveOperation: Operation = {
        id: 'basket',
        title: 'whole',
        description: 'water',
        start: startTS,
        end: undefined,
        is_archived: true,
      };
      spectator.inject(OperationService).getOperations.and.returnValue(of(samplePaginatedOperations.changeResultType([inactiveOperation])));
      component.refresh();
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      const row = spectator.query(byTextContent(inactiveOperation.title, {
        exact: false,
        selector: 'tr',
      }));
      expect(row).withContext('should show row').toBeVisible();
      if (!row) {
        return;
      }
      expect(row.querySelector('mat-icon')).withContext('should show icon for inactive operation').toBeVisible();
    }));

    it('should display regular operations correctly in table', fakeAsync(async () => {
      const startTS = new Date();
      startTS.setFullYear(startTS.getFullYear() - 2);
      const endTS = new Date();
      endTS.setFullYear(endTS.getFullYear() - 1);
      const regularOperation: Operation = {
        id: 'basket',
        title: 'whole',
        description: 'water',
        start: startTS,
        end: endTS,
        is_archived: false,
      };
      spectator.inject(OperationService).getOperations.and.returnValue(of(samplePaginatedOperations.changeResultType([regularOperation])));
      component.refresh();
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      const row = spectator.query(byTextContent(regularOperation.title, {
        exact: false,
        selector: 'tr',
      }));
      expect(row).withContext('should show row').toBeVisible();
      if (!row) {
        return;
      }
      expect(row.querySelector('mat-icon')).withContext('should not show icons for regular operation').not.toBeVisible();
    }));

    it('should edit operation on operation-row clicked', fakeAsync(async () => {
      const sampleOperation: Operation = {
        id: 'basket',
        title: 'whole',
        description: 'water',
        start: new Date('2023-01-02'),
        end: undefined,
        is_archived: false,
      };
      spectator.inject(OperationService).getOperations.and.returnValue(of(samplePaginatedOperations.changeResultType([sampleOperation])));
      component.refresh();
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      const navigateSpy = spyOn(component, 'navigateToOperation');
      spectator.click(byTextContent(sampleOperation.title, {
        exact: false,
        selector: 'tr',
      }));
      expect(navigateSpy).toHaveBeenCalledOnceWith(sampleOperation.id);
    }));

    it('should navigate to edit operation view when editing operations', fakeAsync(async () => {
      spectator.router.navigate = createSpy().and.resolveTo();
      const sampleOperation: Operation = {
        id: 'basket',
        title: 'whole',
        description: 'water',
        start: new Date('2023-01-02'),
        end: undefined,
        is_archived: false,
      };
      spectator.inject(OperationService).getOperations.and.returnValue(of(samplePaginatedOperations.changeResultType([sampleOperation])));
      component.refresh();
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      spectator.click(byTextContent(sampleOperation.title, {
        exact: false,
        selector: 'tr',
      }));
      expect(spectator.router.navigate).toHaveBeenCalledWith([sampleOperation.id], { relativeTo: spectator.activatedRouteStub });
    }));

    describe('order-by', () => {
      const tests: {
        column: string,
        orderBy: OperationSort,
      }[] = [
        {
          column: 'Title',
          orderBy: OperationSort.ByTitle,
        },
        {
          column: 'Description',
          orderBy: OperationSort.ByDescription,
        },
        {
          column: 'Start',
          orderBy: OperationSort.ByStart,
        },
        {
          column: 'End',
          orderBy: OperationSort.ByEnd,
        },
      ];
      tests.forEach(tt => {
        it(`should order by ${ tt.column } correctly`, () => {
          if (!component.pagination) {
            fail('missing pagination');
            return;
          }

          let expectParams: PaginationParams<OperationSort> = component.pagination.clone();
          expectParams.applyOrderBy(tt.orderBy, OrderDir.Asc);
          const columnHeader = byTextContent(tt.column, {
            exact: false,
            selector: 'tr th',
          });
          spectator.click(columnHeader);
          expect(spectator.inject(OperationService).getOperations).withContext('first').toHaveBeenCalledWith(expectParams, anything());
          expectParams.applyOrderBy(expectParams.orderBy, OrderDir.Desc);
          spectator.click(columnHeader);
          expect(spectator.inject(OperationService).getOperations).withContext('second').toHaveBeenCalledWith(expectParams, anything());
          expectParams.applyOrderBy(undefined, undefined);
          spectator.click(columnHeader);
          expect(spectator.inject(OperationService).getOperations).withContext('third').toHaveBeenCalledWith(expectParams, anything());
        });
      });
    });

    it('should navigate to create-operation-route when create button is clicked', () => {
      const createOperationSpy = spyOn(component, 'createOperation');
      spectator.click(byTextContent('Create operation', {
        exact: false,
        selector: 'button',
      }));
      expect(createOperationSpy).toHaveBeenCalledOnceWith();
    });
  });
});
