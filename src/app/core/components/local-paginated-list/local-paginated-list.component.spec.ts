import { LocalPaginatedListComponent } from './local-paginated-list.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { OrderDir, Paginated, PaginationParams } from '../../util/store';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

interface SampleEntry {
  a: number;
}

function genFactoryOptions(): SpectatorRoutingOptions<LocalPaginatedListComponent<any>> {
  return {
    component: LocalPaginatedListComponent,
    imports: [CoreModule],
    queryParams: {
      'limit': 20,
      'offset': 5,
      'orderBy': 'a',
      'orderDir': 'desc',
    },
  };
}

describe('LocalPaginatedListComponent', () => {
  let spectator: SpectatorRouting<LocalPaginatedListComponent<SampleEntry>>;
  let component: LocalPaginatedListComponent<SampleEntry>;
  const createComponent = createRoutingFactory<LocalPaginatedListComponent<SampleEntry>>({
    ...genFactoryOptions(),
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply pagination from page-event', () => {
    const newPage: PaginationParams<string> = new PaginationParams<string>(31, 897, 'watch', OrderDir.Desc);
    component.page(newPage);
    expect(component.pagination).toEqual(newPage);
  });

  it('should refresh data-source data from page-event', () => {
    const newPage: PaginationParams<string> = new PaginationParams<string>(825, 752, 'opposite', OrderDir.Desc);
    component.page(newPage);
    expect(component.dataSource.data).toEqual(component.getData().entries);
  });

  describe('getData', () => {
    beforeEach(() => {
      component.data = [];
      for (let i = 0; i < 200; i++) {
        component.data.push({ a: Math.floor(Math.random() * 999999) });
      }
    });

    it('should return empty result when no data is set', () => {
      component.data = undefined;
      component.page(new PaginationParams<string>(23, 169, 'donkey', OrderDir.Desc));
      const expectPaginated = new Paginated<SampleEntry>([], {
        total: 0,
        limit: 23,
        offset: 169,
        orderedBy: 'donkey',
        orderDir: OrderDir.Desc,
        retrieved: 0,
      });
      expect(component.getData()).toEqual(expectPaginated);
    });

    it('should return result with correct entries when data is set', () => {
      component.page(new PaginationParams<string>(166, 2, 'cave', OrderDir.Desc));
      const expectPaginated = new Paginated<SampleEntry>(component.data!.slice(2, 166 + 2), {
        total: 200,
        limit: 166,
        offset: 2,
        orderedBy: 'cave',
        orderDir: OrderDir.Desc,
        retrieved: 166,
      });
      expect(component.getData()).toEqual(expectPaginated);
    });

    [
      {
        limit: 1,
        offset: 1,
      },
      {
        limit: 0,
        offset: 0,
      },
      {
        limit: 300,
        offset: 300,
      },
      {
        limit: 1000,
        offset: 0,
      },
      {
        limit: 29,
        offset: 30,
      },
    ].forEach((tt, num) => {
      it(`should slice entries correctly ${ num }`, () => {
        component.page(new PaginationParams<string>(tt.limit, tt.offset, 'coin', OrderDir.Desc));
        expect(component.getData().entries).toEqual(component.data!.slice(tt.offset, tt.limit + tt.offset));
      });
    });
  });
});

@Component({
  template: `
    <app-local-paginated-list [data]="data" (page)="latestPage = $event" #list>
      <h1>Hello World!</h1>
    </app-local-paginated-list>`,
})
class TestHostComponent {
  data = [884, 618, 224, 485, 786, 938];
  latestPage?: PaginationParams<any>;
  dataSource = new MatTableDataSource();
}

describe('LocalPaginatedListComponent.integration', () => {
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
});
