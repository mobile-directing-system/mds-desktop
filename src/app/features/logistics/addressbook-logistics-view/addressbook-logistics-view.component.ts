import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressBookEntrySort, AddressBookService } from '../../../core/services/addressbook.service';
import { OperationService } from '../../../core/services/operation.service';
import { AddressBookEntry } from '../../../core/model/addressbookEntry';
import { Operation } from '../../../core/model/operation';
import { orderDirFromSort, Paginated, PaginationParams } from '../../../core/util/store';
import { Loader } from '../../../core/util/loader';
import { EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { MDSError, MDSErrorCode } from '../../../core/util/errors';
import { Sort } from '@angular/material/sort';

export interface AddressBookEntryTableRowContent {
  entry: AddressBookEntry,
  operation: Operation | null | undefined
}

@Component({
  selector: 'app-addressbook-logistics-view',
  templateUrl: './addressbook-logistics-view.component.html',
  styleUrls: ['./addressbook-logistics-view.component.scss'],
})
export class AddressBookEntryLogisticsView {
  columnsToDisplay = ['label', 'description', 'operation', 'user'];
  pagination?: PaginationParams<AddressBookEntrySort>;
  loadedAddressBookEntryTableData?: Paginated<AddressBookEntryTableRowContent>;

  constructor(private router: Router, private route: ActivatedRoute, private addressBookService: AddressBookService, private operationService: OperationService) {
  }

  retrieving = new Loader();
  retrievingOperation = new Loader();

  refresh(): void {
    this.retrieving.loadFrom(() => {
      if (!this.pagination) {
        return EMPTY;
      }
      return this.addressBookService.getAddressBookEntries(this.pagination, {}).pipe(
        map(paginatedEntries => {
          return new Paginated<AddressBookEntryTableRowContent>(
            paginatedEntries.entries.map(entry => {
              let tableEntry: AddressBookEntryTableRowContent = {
                entry: entry,
                operation: undefined,
              };
              if (!entry.operation) {
                tableEntry.operation = null;
              } else {
                this.retrievingOperation.load(this.operationService.getOperationById(entry.operation)).subscribe(operation => tableEntry.operation = operation);
              }
              return tableEntry;
            }), {
              // Pagination details stay the same, since no extra entries where retrieved.
              retrieved: paginatedEntries.retrieved,
              limit: paginatedEntries.limit,
              offset: paginatedEntries.offset,
              total: paginatedEntries.total,
              orderedBy: paginatedEntries.orderedBy,
              orderDir: paginatedEntries.orderDir,
            });
        }),
      );
    }).subscribe(paginatedAddressBookEntryTableRowContent => this.loadedAddressBookEntryTableData = paginatedAddressBookEntryTableRowContent);
  }

  navigateToAddressBookEntry(addressBookEntryId: string): void {
    this.router.navigate([addressBookEntryId], { relativeTo: this.route }).then();
  }

  createAddressBookEntry() {
    this.router.navigate(['create'], { relativeTo: this.route }).then();
  }

  page(pagination: PaginationParams<string>): void {
    this.pagination = pagination.mapOrderBy(AddressBookEntryLogisticsView.mapOrderBy);
    this.refresh();
  }

  asAddressBookEntryTableContent(addressBookTableContent: AddressBookEntryTableRowContent): AddressBookEntryTableRowContent {
    return addressBookTableContent;
  }

  getOperationTitleFromAddressBookEntryTableContent(addressBookTableContent: AddressBookEntryTableRowContent): string {
    if (!addressBookTableContent.operation) {
      return '';
    }
    return addressBookTableContent.operation.title;
  }

  getUserDescriptionFromAddressBookEntryTableContent(addressBookTableContent: AddressBookEntryTableRowContent): string {
    if(!addressBookTableContent.entry.user || !addressBookTableContent.entry.userDetails) {
      return '';
    }
    return  addressBookTableContent.entry.userDetails.lastName + ' ' + addressBookTableContent.entry.userDetails.firstName + ' (' + addressBookTableContent.entry.userDetails.username + ')';
  }

  private static mapOrderBy(s: string): AddressBookEntrySort | undefined {
    switch (s) {
      case 'byLabel':
        return AddressBookEntrySort.ByLabel;
      case 'byDescription':
        return AddressBookEntrySort.ByDescription;
      case '':
        return undefined;
      default:
        throw new MDSError(MDSErrorCode.AppError, `unsupported order-by: ${ s }`);
    }
  }

  sortChange(sort: Sort): void {
    if (!this.pagination) {
      return;
    }
    this.pagination.applyOrderBy(AddressBookEntryLogisticsView.mapOrderBy(sort.active), orderDirFromSort(sort));
    this.refresh();
  }
}
