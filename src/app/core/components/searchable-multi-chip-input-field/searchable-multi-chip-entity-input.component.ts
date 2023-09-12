import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Identifiable } from '../../util/misc';
import {
  BehaviorSubject,
  debounceTime,
  EMPTY,
  filter,
  forkJoin,
  Observable,
  startWith,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { MDSError, MDSErrorCode } from '../../util/errors';

/**
 * Container which holds an optional value. {@link id} is used for retrieving value when writing value in
 * {@link SearchableMultiChipEntityInputComponent}.
 */
export interface SelectedEntity<Id, T extends Identifiable<Id>> {
  /**
   * Identifies the entity.
   */
  id: Id,
  /**
   * Value of the entity.
   */
  v?: T;
}

/**
 * Form control for selecting multiple entities via search.
 *
 * @example Example for multi-member-selection.
 * <app-searchable-multi-chip-entity-input-field
 *   [chipTemplate]="chip"
 *   [errorTemplate]="errors"
 *   [formControl]="memberFC"
 *   [retrieve]="getUserById.bind(this)"
 *   [search]="searchUser.bind(this)"
 *   [suggestionTemplate]="suggestion"
 *   class="app-edit-input-large"
 *   label="Members"
 *   placeholder="Add member...">
 *   <ng-template #chip let-entity='entity'>
 *     {{asUser(entity).firstName}} {{asUser(entity).lastName}}
 *   </ng-template>
 *   <ng-template #suggestion let-entity='entity'>
 *     {{asUser(entity).firstName}} {{asUser(entity).lastName}} <span
 *   class="username">({{asUser(entity).lastName}})</span>
 *   </ng-template>
 *   <ng-template #errors>
 *     <mat-error *ngIf="memberFC.errors && memberFC.errors['minlength']" i18n>
 *       At least {{memberFC.errors['minlength'].requiredLength }} required.
 *     </mat-error>
 *   </ng-template>
 * </app-searchable-multi-chip-entity-input-field>
 */
@Component({
  selector: 'app-searchable-multi-chip-entity-input-field',
  templateUrl: './searchable-multi-chip-entity-input.component.html',
  styleUrls: ['./searchable-multi-chip-entity-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableMultiChipEntityInputComponent),
      multi: true,
    },
  ],
})
export class SearchableMultiChipEntityInputComponent<Id, T extends Identifiable<Id>> implements OnInit, OnDestroy, ControlValueAccessor {
  /**
   * Debounce time for search input.
   */
  static readonly SearchDebounceTimeMS = 200;
  /**
   * Label for the form field.
   */
  @Input() label?: string;
  /**
   * Placeholder for the form field.
   */
  @Input() placeholder = '';
  /**
   * Function for retrieving search results for the given term (current input).
   */
  @Input() search?: (term: string) => Observable<T[]>;
  /**
   * Function for retrieving the entity, identified by the given id.
   */
  @Input() retrieve?: (id: Id) => Observable<T | undefined>;
  /**
   * Currently selected entities.
   */
  selectedEntities: SelectedEntity<Id, T>[] = [];
  /**
   * Template for displaying chips.
   */
  @Input() chipTemplate?: TemplateRef<any>;
  /**
   * Template for displaying suggestions.
   */
  @Input() suggestionTemplate?: TemplateRef<any>;
  /**
   * Template for displaying validation errors.
   */
  @Input() errorTemplate?: TemplateRef<any>;

  /**
   * For some magical reasons, we need direct ref as seen in example
   * {@link https://material.angular.io/components/chips/overview#autocomplete}. Value changes to {@link searchFC} are
   * not reflected if a suggestion is selected and the control's value cleared. There is already an issue open at
   * {@link https://github.com/angular/components/issues/25809}.
   */
  @ViewChild('entityInput') searchInput?: ElementRef<HTMLInputElement>;
  /**
   * Form control for search input.
   */
  searchFC = new FormControl<string>('');
  /**
   * List of suggestions being used for autocomplete.
   */
  suggestions = new BehaviorSubject<T[]>([]);

  private s: Subscription[] = [];

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.searchFC.valueChanges.pipe(
      // Ignore other types. Required because of selecting a suggestion leading to setting the value automatically in
      // the search form control.
      filter(v => typeof v === 'string'),
      // Ignore null-values. These are set when a suggestion is selected in order to clear suggestions until the user
      // types the next search term.
      filter(v => v !== null),
      tap(() => this.notifyOnTouched()),
      // Debounce in order to void too many search requests.
      debounceTime(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS),
      // Initial value for first suggestions.
      startWith(''),
      switchMap(v => v === null ? EMPTY : this.refreshSuggestions(v)),
    ).subscribe());
  }

  /**
   * Refreshes {@link suggestions} for the given search term.
   * @param searchTerm The search term to use for retrieving suggestions.
   * @private
   */
  private refreshSuggestions(searchTerm: string): Observable<void> {
    if (!this.search) {
      throw new MDSError(MDSErrorCode.AppError, 'missing search function');
    }
    return this.search(searchTerm).pipe(
      tap(newSuggestions => {
        const deduplicatedFromSelected: T[] = newSuggestions.filter(suggestion =>
          !this.selectedEntities.find(alreadySelected => alreadySelected.id === suggestion.id));
        this.suggestions.next(deduplicatedFromSelected);
      }),
      map(_ => void 0),
    );
  }

  /**
   * Adds the given entity to the list of selected ones and clears search.
   * @param entity The entity to add (must not have already been added).
   * @private
   */
  addEntity(entity: T): void {
    if (this.searchFC.disabled) {
      throw new MDSError(MDSErrorCode.AppError, 'form control is disabled');
    }
    if (this.selectedEntities.find(e => e.id === entity.id)) {
      throw new MDSError(MDSErrorCode.AppError, 'duplicate entry', {
        entityId: entity.id,
        entity: entity,
      });
    }
    this.suggestions.next([]);
    const toPush: SelectedEntity<Id, T> = {
      id: entity.id,
      v: entity,
    };
    this.selectedEntities.push(toPush);
    this.notifyOnChange();
    this.clearSearch();
  }

  /**
   * Removes the given entity from selected ones.
   * @param entityToRemove The entity to remove.
   */
  remove(entityToRemove: SelectedEntity<Id, T>): void {
    if (this.searchFC.disabled) {
      throw new MDSError(MDSErrorCode.AppError, 'form control is disabled');
    }
    // Remove from selected ones.
    const index = this.selectedEntities.indexOf(entityToRemove);
    if (index === -1) {
      throw new MDSError(MDSErrorCode.AppError, 'entity to remove not found in selected ones', {
        entityToRemove: entityToRemove,
        selectedEntities: this.selectedEntities,
      });
    }
    this.selectedEntities.splice(index, 1);

    this.notifyOnChange();
    this.searchFC.setValue('');
  }

  /**
   * Clears the search input.
   * @private
   */
  private clearSearch(): void {
    this.searchFC.setValue(null);
    if (!this.searchInput) {
      throw new MDSError(MDSErrorCode.AppError, 'missing ref to entity input');
    }
    this.searchInput.nativeElement.value = '';
  }

  private onChangeListeners: ((ids: Id[]) => void)[] = [];
  private onTouchedListeners: (() => void)[] = [];

  private notifyOnChange(): void {
    this.onChangeListeners.forEach(l => l(this.selectedEntities.map(e => e.id)));
  }

  private notifyOnTouched(): void {
    this.onTouchedListeners.forEach(l => l());
  }

  registerOnChange(fn: any): void {
    this.onChangeListeners.push(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchedListeners.push(fn);
  }

  /**
   * Enables/disables the form control.
   * @param isDisabled Whether to disable it.
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.searchFC.disable();
    } else {
      this.searchFC.enable();
    }
  }

  /**
   * Used in order to satisfy {@link ControlValueAccessor}. Initial values only contain entity ids. These are added to
   * selected ones and their values retrieved via {@link retrieve}.
   * @param ids
   */
  writeValue(ids: Id[]): void {
    this.suggestions.next([]);
    this.selectedEntities = ids.map((id: Id): SelectedEntity<Id, T> => ({ id: id }));
    this.loadSelectedEntityValues();
  }

  private loadingSubscription?: Subscription;

  /**
   * Loads entity values via {@link retrieve} for all selected entities, not having {@link SelectedEntity.v} set.
   * @private
   */
  private loadSelectedEntityValues(): void {
    this.loadingSubscription?.unsubscribe();
    this.loadingSubscription = forkJoin(this.selectedEntities.filter(e => !e.v).map(entityToRetrieveValueFor => {
      // Check inside map function because of the linter not liking it being on the outside as this is a callback
      // function.
      if (!this.retrieve) {
        throw new MDSError(MDSErrorCode.AppError, 'missing retrieve function');
      }
      return this.retrieve(entityToRetrieveValueFor.id).pipe(tap(retrievedValue => {
        // Apply result.
        const entityRef = this.selectedEntities.find(e => e === entityToRetrieveValueFor);
        if (!entityRef) {
          // Maybe the element got removed during retrieval.
          return;
        }
        entityRef.v = retrievedValue;
      }));
    })).subscribe();
  }
}
