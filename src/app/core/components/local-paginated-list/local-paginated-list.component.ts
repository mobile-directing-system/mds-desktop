import { Component, Input, OnChanges } from '@angular/core';
import { Paginated, PaginationParams } from '../../util/store';
import { MatTableDataSource } from '@angular/material/table';
import { SimpleChangesTyped } from '../../util/misc';

/**
 * Paginated list that uses an array of data and does not request data fetching.
 */
@Component({
  selector: 'app-local-paginated-list',
  templateUrl: './local-paginated-list.component.html',
  styleUrls: ['./local-paginated-list.component.scss'],
})
export class LocalPaginatedListComponent<EntryT> implements OnChanges {
  // Inspections suppressed, because of needed fixed numbers for page size options.
  // noinspection MagicNumberJS
  /**
   * The available page sizes.
   */
  @Input() pageSizeOptions = [25, 50, 100, 500];
  /**
   * Optional id if multiple lists share the same route. This is used in order to differ between pagination query
   * params.
   */
  @Input() listId = '';
  /**
   * Data to show in the table and use for pagination.
   */
  @Input() data?: EntryT[];
  /**
   * Current pagination.
   */
  pagination = new PaginationParams<string>(this.pageSizeOptions[0], 0);
  /**
   * Public data source to be used by child components.
   */
  dataSource = new MatTableDataSource<EntryT>();

  page(page: PaginationParams<string>): void {
    this.pagination = page;
    this.refreshDataSource();
  }

  private refreshDataSource(): void {
    this.dataSource.data = this.getData().entries;
  }

  getData(): Paginated<EntryT> {
    let paginated = new Paginated<EntryT>([], {
      total: 0,
      limit: this.pagination.limit,
      offset: this.pagination.offset,
      orderDir: this.pagination.orderDir,
      orderedBy: this.pagination.orderBy,
      retrieved: 0,
    });
    if (this.data === undefined) {
      return paginated;
    }
    paginated = paginated.changeResultType(this.data.slice(this.pagination.offset, this.pagination.offset + this.pagination.limit));
    paginated.total = this.data.length;
    paginated.retrieved = paginated.entries.length;
    return paginated;
  }

  ngOnChanges(changes: SimpleChangesTyped<LocalPaginatedListComponent<EntryT>>): void {
    if (changes.data) {
      this.refreshDataSource();
    }
  }
}
