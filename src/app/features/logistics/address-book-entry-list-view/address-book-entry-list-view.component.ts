import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressBookEntrySort, AddressBookService } from '../../../core/services/addressbook.service';
import { OperationService } from '../../../core/services/operation.service';
import { AddressBookEntry } from '../../../core/model/address-book-entry';
import { Operation } from '../../../core/model/operation';
import { orderDirFromSort, Paginated, PaginationParams } from '../../../core/util/store';
import { Loader } from '../../../core/util/loader';
import { map } from 'rxjs/operators';
import { MDSError, MDSErrorCode } from '../../../core/util/errors';
import { Sort } from '@angular/material/sort';

export interface AddressBookEntryRow {
  entry: AddressBookEntry,
  operation: Operation | null | undefined
}

@Component({
  selector: 'app-address-book-entry-list-view',
  templateUrl: './address-book-entry-list-view.component.html',
  styleUrls: ['./address-book-entry-list-view.component.scss'],
})
export class AddressBookEntryListView {
  columnsToDisplay = ['label', 'description', 'operation', 'user'];
  pagination?: PaginationParams<AddressBookEntrySort>;
  addressBookEntryRows?: Paginated<AddressBookEntryRow>;

  constructor(private router: Router, private route: ActivatedRoute, private addressBookService: AddressBookService, private operationService: OperationService) {
  }

  retrieving = new Loader();
  retrievingOperation = new Loader();

  refresh(): void {
    if (!this.pagination) {
      return;
    }
    this.retrieving.take(this.addressBookService.getAddressBookEntries(this.pagination, {}).pipe(
      map(paginatedEntries => {
        return new Paginated<AddressBookEntryRow>(
          paginatedEntries.entries.map(entry => {
            let tableEntry: AddressBookEntryRow = {
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
    ).subscribe(paginatedRows => this.addressBookEntryRows = paginatedRows), 'entry-retrieval');
  }

  navigateToAddressBookEntry(addressBookEntryId: string): void {
    this.router.navigate([addressBookEntryId], { relativeTo: this.route }).then();
  }

  createAddressBookEntry() {
    this.router.navigate(['create'], { relativeTo: this.route }).then();
  }

  page(pagination: PaginationParams<string>): void {
    this.pagination = pagination.mapOrderBy(AddressBookEntryListView.mapOrderBy);
    this.refresh();
  }

  asAddressBookEntryRow(addressBookTableContent: AddressBookEntryRow): AddressBookEntryRow {
    return addressBookTableContent;
  }

  formatRowUser(addressBookTableContent: AddressBookEntryRow): string {
    if (!addressBookTableContent.entry.user || !addressBookTableContent.entry.userDetails) {
      return '';
    }
    const userDetails = addressBookTableContent.entry.userDetails;
    return userDetails.lastName + ' ' + userDetails.firstName + ' (' + userDetails.username + ')';
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
    this.pagination.applyOrderBy(AddressBookEntryListView.mapOrderBy(sort.active), orderDirFromSort(sort));
    this.refresh();
  }
}
