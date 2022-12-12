import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, skipWhile, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

/**
 * Debounce for search term.
 */
const SearchDebounceMS = 200;

/**
 * Search bar for simple text search with memory-function via query params.
 */
@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss'],
})
export class QuickSearchComponent implements OnInit, OnDestroy {
  /**
   * Optional search id if multiple ones are used on the same route.
   */
  @Input() searchId = '';
  /**
   * Emits when the search term changes.
   */
  @Output() search = new EventEmitter<string>();

  searchTermFC = new FormControl<string>('');

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  private s: Subscription[] = [];

  buildQueryParam(s: string): string {
    if (this.searchId === '') {
      return s;
    }
    return `${ this.searchId }_${ s }`;
  }

  ngOnInit(): void {
    this.s.push(this.searchTermFC.valueChanges.pipe(
      debounceTime(SearchDebounceMS),
    ).subscribe(v => {
        if (v === null) {
          return;
        }
        const queryParams: { [keys: string]: any } = {};
        queryParams[this.buildQueryParam('search')] = v !== '' ? v : null;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams,
          queryParamsHandling: 'merge',
        }).then();
        this.search.emit(v);
      },
    ));
    this.s.push(this.route.queryParamMap.pipe(
      map(paramMap => paramMap.get(this.buildQueryParam('search'))),
      skipWhile(searchTerm => searchTerm === ''),
      distinctUntilChanged(),
    ).subscribe(searchTerm => {
      if (searchTerm === null) {
        searchTerm = '';
      }
      if (this.searchTermFC.value !== searchTerm) {
        this.searchTermFC.setValue(searchTerm);
      }
    }));
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  /**
   * Clears the current search term.
   */
  clear(): void {
    this.searchTermFC.setValue('');
  }
}
