import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { OrderDir, Paginated, PaginationParams } from '../../util/store';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { SimpleChangesTyped } from '../../util/misc';

export const queryParamLimit = 'limit';
export const queryParamOffset = 'offset';
export const queryParamOrderBy = 'orderBy';
export const queryParamOrderDir = 'orderDir';

/**
 * List with pagination.
 */
@Component({
  selector: 'app-paginated-list',
  templateUrl: './paginated-list.component.html',
  styleUrls: ['./paginated-list.component.scss'],
})
export class PaginatedListComponent<EntryT> implements OnInit, OnDestroy, OnChanges {
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
  @Input() data?: Paginated<EntryT>;
  /**
   * Emits when page is changed.
   */
  @Output() page = new EventEmitter<PaginationParams<string>>();

  /**
   * Current pagination.
   */
  pagination = new PaginationParams<string>(this.pageSizeOptions[0], 0);
  /**
   * Total number of available entries. Used for pagination.
   */
  total: number = 0;
  /**
   * Public data source to be used by child components.
   */
  dataSource = new MatTableDataSource<EntryT>();

  private s: Subscription[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  /**
   * Assembles a query param key based on {@link listId}.
   * @param s The query param key.
   * @private
   */
  buildParamKey(s: string): string {
    if (this.listId === '') {
      return s;
    }
    return `${ this.listId }_${ s }`;
  }

  /**
   * Creates {@link PaginationParams} based on the given param map.
   *
   * @param params The params to be used for setting pagination params.
   * @param defaultPageSize The default page size to use if none is provided in the param map or is <= 0.
   * @private
   */
  private buildPaginationParamsFromParamMap(params: ParamMap, defaultPageSize: number): PaginationParams<any> {
    // Get page size.
    const limitStr = params.get(this.buildParamKey(queryParamLimit));
    const limit = limitStr === null ? defaultPageSize : +limitStr;
    // Get page index.
    const offsetStr = params.get(this.buildParamKey(queryParamOffset));
    const offset = offsetStr === null ? 0 : +offsetStr;
    // Get order-by.
    const orderBy = params.get(this.buildParamKey(queryParamOrderBy)) ?? undefined;
    // Get order direction.
    let orderDir: OrderDir | undefined;
    switch (params.get(this.buildParamKey(queryParamOrderDir))) {
      case OrderDir.Asc: {
        orderDir = OrderDir.Asc;
        break;
      }
      case OrderDir.Desc: {
        orderDir = OrderDir.Desc;
        break;
      }
      default: {
        orderDir = undefined;
        break;
      }
    }
    return new PaginationParams<any>(limit, offset, orderBy, orderDir);
  }

  /**
   * Sets query params based on {@link pagination}.
   * @private
   */
  private navigateToCurrentPagination(): void {
    const queryParams: { [key: string]: any } = {};
    queryParams[this.buildParamKey(queryParamLimit)] = this.pagination.limit;
    queryParams[this.buildParamKey(queryParamOffset)] = this.pagination.offset;
    queryParams[this.buildParamKey(queryParamOrderBy)] = this.pagination.orderBy;
    queryParams[this.buildParamKey(queryParamOrderDir)] = this.pagination.orderDir;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).then();
  }

  ngOnInit(): void {
    this.pagination.limit = this.pageSizeOptions[0];
    /*
     * We subscribe to the param map where we except params for page, pageSize and search. Then the store is queried with adjusted
     * search retrieval params and the result then used to update the paginator and list data provider.
     */
    this.s.push(
      this.route.queryParamMap.subscribe(params => {
        this.pagination = this.buildPaginationParamsFromParamMap(params, this.pageSizeOptions[0]);
        this.emitPage();
      }),
    );
    this.handleData(this.data);
    this.emitPage();
  }

  /**
   * Emits {@link page} in order to retrieve new data.
   * @private
   */
  private emitPage(): void {
    setTimeout(() => this.page.emit(this.pagination))
  }

  /**
   * Updates {@link pagination} and feeds the new data to the {@link dataSource}.
   * @param data The retrieved data.
   * @private
   */
  private handleData(data?: Paginated<any>): void {
    // Update pagination.
    if (data?.limit !== undefined) {
      this.pagination.limit = data.limit;
    }
    if (data?.offset !== undefined) {
      this.pagination.offset = data.offset;
    }
    if (data?.orderDir !== undefined) {
      this.pagination.applyOrderBy(this.data?.orderedBy, this.pagination.orderDir);
    }
    this.total = data ? data.total : 0;
    // Update data source.
    this.dataSource.data = data?.entries ?? [];
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  /**
   * Calculates the current page index based on {@link total} and {@link pagination.limit}.
   */
  getCurrentPageIndex(): number {
    return Math.floor(this.pagination.offset / this.pagination.limit);
  }

  /**
   * Called when the paginator changes page.
   * @param e The event.
   */
  onPageChange(e: PageEvent): void {
    this.pagination.limit = e.pageSize;
    this.pagination.offset = e.pageIndex * e.pageSize;
    this.navigateToCurrentPagination();
  }

  ngOnChanges(changes: SimpleChangesTyped<PaginatedListComponent<EntryT>>): void {
    if (changes.data) {
      this.handleData(this.data);
    }
  }
}
