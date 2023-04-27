import { AddressBookEntryListView, AddressBookEntryRow } from './address-book-entry-list-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { OperationService } from '../../../core/services/operation.service';
import { CoreModule } from '../../../core/core.module';
import { AddressBookEntry } from '../../../core/model/address-book-entry';
import { Operation } from '../../../core/model/operation';
import { OrderDir, Paginated, PaginationParams } from '../../../core/util/store';
import { fakeAsync, tick } from '@angular/core/testing';
import { AddressBookEntrySort, AddressBookService } from '../../../core/services/addressbook.service';
import { of } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { LogisticsModule } from '../logistics.module';


describe('AddressBookEntryLogisticsView', () => {
  let component: AddressBookEntryListView;
  let spectator: SpectatorRouting<AddressBookEntryListView>;
  const createComponent = createRoutingFactory({
    component: AddressBookEntryListView,
    imports: [
      CoreModule,
      LogisticsModule,
    ],
    mocks: [
      AddressBookService,
      OperationService,
    ],
    detectChanges: false,
  });

  const sampleEntries: AddressBookEntry[] = [
    {
      id: 'split',
      label: 'observe',
      description: 'fail',
      operation: 'purple',
      user: 'cloth',
      userDetails: {
        id: 'cloth',
        lastName: 'white',
        firstName: 'object',
        username: 'rate',
        isActive: true,
        isAdmin: false,
      },
    },
    {
      id: 'honor',
      label: 'what',
      description: 'moral',
      user: 'most',
      userDetails: {
        id: 'most',
        lastName: 'paper',
        firstName: 'whom',
        username: 'quite',
        isActive: true,
        isAdmin: false,
      },
    },
    {
      id: 'beat',
      label: 'treasury',
      description: 'limit',
      operation: 'purple',
    },
  ];

  const sampleOperation: Operation =
    {
      id: 'purple',
      title: 'person',
      description: 'belong',
      start: new Date(2022, 9, 9),
      isArchived: false,
    };

  const sampleAddressBookEntryTableRowContent: AddressBookEntryRow[] = [
    {
      entry: sampleEntries[0],
      operation: sampleOperation,
    },
    {
      entry: sampleEntries[1],
      operation: null,
    },
    {
      entry: sampleEntries[2],
      operation: sampleOperation,
    },
  ];

  const samplePaginatedEntries: Paginated<AddressBookEntry> = new Paginated<AddressBookEntry>(sampleEntries, {
    limit: 3,
    retrieved: 3,
    total: 42,
    offset: 0,
  });

  const samplePaginatedAddressBookEntryTableRowContent: Paginated<AddressBookEntryRow> = new Paginated<AddressBookEntryRow>(sampleAddressBookEntryTableRowContent, {
    limit: 3,
    retrieved: 3,
    total: 42,
    offset: 0,
  });

  beforeEach(fakeAsync(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.inject(AddressBookService).getAddressBookEntries.and.returnValue(of(samplePaginatedEntries));
    spectator.inject(OperationService).getOperationById.and.returnValue(of(sampleOperation));
    spectator.detectComponentChanges();
    tick();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load entries', () => {
    expect(component.addressBookEntryRows).toEqual(samplePaginatedAddressBookEntryTableRowContent);
  });

  it('should refresh correctly on page-event', fakeAsync(() => {
    const samplePaginationParams = new PaginationParams<string>(2, 4);

    component.page(samplePaginationParams);
    tick();

    expect(spectator.inject(AddressBookService).getAddressBookEntries).toHaveBeenCalledWith(samplePaginationParams, {});
  }));

  it('should refresh correctly on sort-event', fakeAsync(() => {
    if (!component.pagination) {
      fail('missing pagination');
      return;
    }
    const sampleSort: Sort = {
      active: 'byLabel',
      direction: 'desc',
    };
    component.sortChange(sampleSort);
    tick();

    const expectParams: PaginationParams<AddressBookEntrySort> = component.pagination.clone();
    expectParams.applyOrderBy(AddressBookEntrySort.ByLabel, OrderDir.Desc);
    expect(spectator.inject(AddressBookService).getAddressBookEntries).toHaveBeenCalledWith(expectParams, {});
  }));

  describe('fixture', () => {
    beforeEach(fakeAsync(async () => {
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
    }));

    it('should have a descriptive heading', () => {
      expect(spectator.query(byTextContent('Address Book Entries', {
        exact: false,
        selector: 'h1',
      }))).toBeVisible();
    });

    it('should show a button for creating entries', () => {
      expect(spectator.query(byTextContent('Create Entry', {
        exact: false,
        selector: 'button',
      }))).toBeVisible();
    });

    it('should call createAddressBookEntry on button click', () => {
      const createSpy = spyOn(component, 'createAddressBookEntry');
      spectator.click(byTextContent('Create Entry', {
        exact: false,
        selector: 'button',
      }));
      expect(createSpy).toHaveBeenCalledOnceWith();
    });

    it('should navigate to AddressBookEntries/Create on button click', () => {
      spectator.click(byTextContent('Create Entry', {
        exact: false,
        selector: 'button',
      }));
      expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['create'], { relativeTo: spectator.activatedRouteStub });
    });
  });

  it('should show address book entry table', () => {
    expect(spectator.query('table')).toBeVisible();
  });

  it('should show address book entry attributes in table', () => {
    sampleEntries.forEach(expectEntry => {
      let attributes: string[] = [expectEntry.label, expectEntry.description];
      if (expectEntry.operation) {
        attributes.push(sampleOperation.title);
      }
      if (expectEntry.userDetails) {
        attributes.push(expectEntry.userDetails.lastName + ' ' + expectEntry.userDetails.firstName + ' (' + expectEntry.userDetails.username + ')');
      }
      attributes.forEach(expectAttribute => {
        expect(byTextContent(expectAttribute, {
          exact: false,
          selector: 'td',
        })).withContext(`should show address book entry attribute ${ expectAttribute } from entry ${ expectEntry.id }`).toBeVisible();
      });
    });
  });

  it('should call navigateToAddressBookEntry on addressBookEntry-row clicked', fakeAsync(async () => {
    const sampleEntry: AddressBookEntry = {
      id: 'pour',
      label: 'adopt',
      description: 'enter',
    };

    spectator.inject(AddressBookService).getAddressBookEntries.and.returnValue(of(samplePaginatedEntries.changeResultType([sampleEntry])));
    component.refresh();
    tick();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    const editSpy = spyOn(component, 'navigateToAddressBookEntry');
    spectator.click(byTextContent(sampleEntry.label, {
      exact: false,
      selector: 'tr',
    }));
    expect(editSpy).toHaveBeenCalledOnceWith(sampleEntry.id);
  }));

  describe('order-by', () => {
    const tests: {
      column: string,
      orderBy: AddressBookEntrySort,
    }[] = [
      {
        column: 'label',
        orderBy: AddressBookEntrySort.ByLabel,
      },
      {
        column: 'description',
        orderBy: AddressBookEntrySort.ByDescription,
      },
    ];
    tests.forEach(tt => {
      it(`should order by ${ tt.column } correctly`, () => {
        if (!component.pagination) {
          fail('missing pagination');
          return;
        }

        let expectParams: PaginationParams<AddressBookEntrySort> = component.pagination.clone();
        expectParams.applyOrderBy(tt.orderBy, OrderDir.Asc);
        const columnHeader = byTextContent(tt.column, {
          exact: false,
          selector: 'tr th',
        });
        spectator.click(columnHeader);
        expect(spectator.inject(AddressBookService).getAddressBookEntries).withContext('first').toHaveBeenCalledWith(expectParams, {});
        expectParams.applyOrderBy(expectParams.orderBy, OrderDir.Desc);
        spectator.click(columnHeader);
        expect(spectator.inject(AddressBookService).getAddressBookEntries).withContext('second').toHaveBeenCalledWith(expectParams, {});
        expectParams.applyOrderBy(undefined, undefined);
      });
    });
  });
});
