import {
  PaginatedListComponent,
  queryParamLimit,
  queryParamOffset,
  queryParamOrderBy,
  queryParamOrderDir,
} from './paginated-list.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { OrderDir, Paginated, PaginationParams } from '../../util/store';
import { fakeAsync, tick } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

interface SampleEntry {
  a: number;
}

function genFactoryOptions(): SpectatorRoutingOptions<PaginatedListComponent<any>> {
  return {
    component: PaginatedListComponent,
    imports: [CoreModule],
    queryParams: {
      'limit': 20,
      'offset': 5,
      'orderBy': 'a',
      'orderDir': 'desc',
    },
  };
}

describe('PaginatedListComponent', () => {
  let spectator: SpectatorRouting<PaginatedListComponent<SampleEntry>>;
  let component: PaginatedListComponent<SampleEntry>;
  const createComponent = createRoutingFactory<PaginatedListComponent<SampleEntry>>({
    ...genFactoryOptions(),
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply initial pagination from query params', () => {
    const expectPagination = new PaginationParams<string>(20, 5, 'a', OrderDir.Desc);
    expect(component.pagination).toEqual(expectPagination);
  });

  it('should apply limit from query params', fakeAsync(() => {
    spectator.setRouteQueryParam('limit', '335');
    tick();
    expect(component.pagination.limit).toEqual(335);
  }));

  it('should apply offset from query params', fakeAsync(() => {
    spectator.setRouteQueryParam('offset', '614');
    tick();
    expect(component.pagination.offset).toEqual(614);
  }));

  it('should apply order-by from query params', fakeAsync(() => {
    spectator.setRouteQueryParam('orderBy', 'b');
    tick();
    expect(component.pagination.orderBy).toEqual('b');
  }));

  it('should apply order-dir from query params', fakeAsync(() => {
    spectator.setRouteQueryParam('orderDir', 'asc');
    tick();
    expect(component.pagination.orderDir).toEqual(OrderDir.Asc);
  }));

  it('should apply limit from query params with list id', fakeAsync(() => {
    component.listId = 'wolf';
    spectator.setRouteQueryParam('wolf_limit', '335');
    tick();
    expect(component.pagination.limit).toEqual(335);
  }));

  it('should apply offset from query params with list id', fakeAsync(() => {
    component.listId = 'wolf';
    spectator.setRouteQueryParam('wolf_offset', '614');
    tick();
    expect(component.pagination.offset).toEqual(614);
  }));

  it('should apply order-by from query params with list id', fakeAsync(() => {
    component.listId = 'wolf';
    spectator.setRouteQueryParam('wolf_orderBy', 'b');
    spectator.setRouteQueryParam('wolf_orderDir', 'desc');
    tick();
    expect(component.pagination.orderBy).toEqual('b');
  }));

  it('should apply order-dir from query params with list id', fakeAsync(() => {
    component.listId = 'wolf';
    spectator.setRouteQueryParam('wolf_orderDir', 'asc');
    tick();
    expect(component.pagination.orderDir).toEqual(OrderDir.Asc);
  }));

  it('set pagination params from page-change event', () => {
    spectator.router.navigate = jasmine.createSpy().and.resolveTo();
    const e = new PageEvent();
    e.pageSize = 302;
    e.pageIndex = 516;
    component.onPageChange(e);

    expect(component.pagination.limit).withContext('should set limit correctly').toEqual(e.pageSize);
    expect(component.pagination.offset).withContext('should set offset correctly').toEqual(e.pageSize * e.pageIndex);
  });

  it('should trigger navigation for query params on page change', fakeAsync(() => {
    spectator.router.navigate = jasmine.createSpy().and.resolveTo();
    const e = new PageEvent();
    e.pageSize = 170;
    e.pageIndex = 963;
    component.onPageChange(e);
    tick();

    const queryParams: { [key: string]: any } = {};
    queryParams[component.buildParamKey(queryParamLimit)] = e.pageSize;
    queryParams[component.buildParamKey(queryParamOffset)] = e.pageSize * e.pageIndex;
    queryParams[component.buildParamKey(queryParamOrderBy)] = component.pagination.orderBy;
    queryParams[component.buildParamKey(queryParamOrderDir)] = component.pagination.orderDir;
    expect(spectator.router.navigate).toHaveBeenCalledOnceWith([], {
      relativeTo: spectator.activatedRouteStub,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }));

  describe('buildPaginationParamsFromParamMap', () => {
    const defaultPageSize = 573;

    const tests: {
      name: string,
      paramMap: {
        limit?: string,
        offset?: string,
        orderBy?: string,
        orderDir?: string,
      },
      wantPaginationParams: PaginationParams<any>
    }[] = [
      {
        name: 'none',
        paramMap: {},
        wantPaginationParams: new PaginationParams(defaultPageSize, 0),
      },
      {
        name: 'only limit',
        paramMap: {
          limit: '12',
        },
        wantPaginationParams: new PaginationParams(12, 0),
      },
      {
        name: 'only offset',
        paramMap: {
          offset: '14',
        },
        wantPaginationParams: new PaginationParams(defaultPageSize, 14),
      },
      {
        name: 'only order-by',
        paramMap: {
          orderBy: 'name',
        },
        wantPaginationParams: new PaginationParams(defaultPageSize, 0, 'name'),
      },
      {
        name: 'only order-dir',
        paramMap: {
          orderDir: 'desc',
        },
        wantPaginationParams: new PaginationParams(defaultPageSize, 0, undefined, OrderDir.Desc),
      },
      {
        name: 'unknown order-dir',
        paramMap: {
          orderDir: 'garden',
        },
        wantPaginationParams: new PaginationParams(defaultPageSize, 0),
      },
      {
        name: 'all',
        paramMap: {
          limit: '817',
          offset: '302',
          orderBy: 'horse',
          orderDir: 'asc',
        },
        wantPaginationParams: new PaginationParams(817, 302, 'horse', OrderDir.Asc),
      },
    ];
    tests.forEach(tt => {
      describe(tt.name, () => {
        let paginationParams: PaginationParams<any>;

        beforeEach(fakeAsync(() => {
          component.pageSizeOptions = [defaultPageSize, 19382];
          const queryParams: { [keys: string]: string } = {};
          if (tt.paramMap.limit !== undefined) {
            queryParams[component.buildParamKey(queryParamLimit)] = tt.paramMap.limit;
          }
          if (tt.paramMap.offset !== undefined) {
            queryParams[component.buildParamKey(queryParamOffset)] = tt.paramMap.offset;
          }
          if (tt.paramMap.orderBy !== undefined) {
            queryParams[component.buildParamKey(queryParamOrderBy)] = tt.paramMap.orderBy;
          }
          if (tt.paramMap.orderDir !== undefined) {
            queryParams[component.buildParamKey(queryParamOrderDir)] = tt.paramMap.orderDir;
          }
          spectator.triggerNavigation({ queryParams });
          tick();
          paginationParams = component.pagination;
        }));

        it('should get limit correctly', () => {
          expect(paginationParams.limit).toEqual(tt.wantPaginationParams.limit);
        });

        it('should get offset correctly', () => {
          expect(paginationParams.offset).toEqual(tt.wantPaginationParams.offset);
        });

        it('should get order-by correctly', () => {
          expect(paginationParams.orderBy).toEqual(tt.wantPaginationParams.orderBy);
        });

        it('should get order-dir correctly', () => {
          expect(paginationParams.orderDir).toEqual(tt.wantPaginationParams.orderDir);
        });
      });
    });
  });
});

@Component({
  template: `
    <app-paginated-list [data]="data" (page)="latestPage = $event" #list>
      <h1>Hello World!</h1>
    </app-paginated-list>`,
})
class TestHostComponent {
  data?: Paginated<number>;
  latestPage?: PaginationParams<any>;
  dataSource = new MatTableDataSource();
}

describe('PaginatedListComponent.integration', () => {
  let spectator: SpectatorRouting<TestHostComponent>;
  let host: TestHostComponent;
  const createHost = createRoutingFactory<TestHostComponent>({
    ...genFactoryOptions(),
    component: TestHostComponent,
  });

  beforeEach(async () => {
    spectator = createHost();
    host = spectator.component;
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render content', () => {
    expect(spectator.query(byTextContent('Hello World!', { selector: 'h1' }))).toBeVisible();
  });

  it('should render paginator', async () => {
    expect(spectator.query('mat-paginator')).toBeVisible();
  });

  describe('handleData', () => {
    const newData = new Paginated<any>([1, 2, 3, 4], {
      limit: 38,
      offset: 517,
      orderedBy: 'object',
      orderDir: OrderDir.Desc,
      retrieved: 38,
      total: 795,
    });

    beforeEach(fakeAsync(() => {
      host.data = newData;
      spectator.detectComponentChanges();
      tick();
    }));

    it('should update pagination limit correctly', () => {
      expect(host.latestPage?.limit).toEqual(newData.limit);
    });

    it('should update pagination offset correctly', () => {
      expect(host.latestPage?.offset).toEqual(newData.offset);
    });

    it('should update pagination order-dir correctly', () => {
      expect(host.latestPage?.orderDir).toEqual(newData.orderDir);
    });
  });
});
