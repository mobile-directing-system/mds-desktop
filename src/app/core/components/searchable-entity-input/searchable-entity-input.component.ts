import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  EMPTY,
  filter,
  Observable,
  startWith,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { MDSError, MDSErrorCode } from '../../util/errors';
import { map } from 'rxjs/operators';
import { Identifiable } from '../../util/misc';

/**
 * Form control for selecting an entity via search.
 *
 * @example Example for user-selection.
 * <app-searchable-entity-input
 *   [displayTemplate]="display"
 *   [errorTemplate]="errors"
 *   [formControl]="memberFC"
 *   [retrieve]="getUserById.bind(this)"
 *   [search]="searchUser.bind(this)"
 *   [required]="true"
 *   [suggestionTemplate]="suggestion"
 *   class="app-edit-input-large"
 *   label="Owner"
 *   placeholder="Search owner...">
 *   <ng-template #display let-entity='entity'>
 *     {{asUser(entity).firstName}} {{asUser(entity).lastName}}
 *   </ng-template>
 *   <ng-template #suggestion let-entity='entity'>
 *     {{asUser(entity).firstName}} {{asUser(entity).lastName}} <span
 *   class="username">({{asUser(entity).lastName}})</span>
 *   </ng-template>
 *   <ng-template #errors>
 *     <app-errors *ngIf="memberFC.errors">
 *       <mat-error *ngIf="memberFC.errors['required']" i18n>
 *         Required.
 *       </mat-error>
 *     </app-errors>
 *   </ng-template>
 * </app-searchable-entity-input>
 */
@Component({
  selector: 'app-searchable-entity-input',
  templateUrl: './searchable-entity-input.component.html',
  styleUrls: ['./searchable-entity-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableEntityInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: SearchableEntityInputComponent,
      multi: true,
    },
  ],
})
export class SearchableEntityInputComponent<Id, T extends Identifiable<Id>> implements OnInit, OnDestroy, ControlValueAccessor, Validator {
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
  @Input() required = false;
  /**
   * Function for retrieving search results for the given term (current input).
   */
  @Input() search?: (term: string) => Observable<T[]>;
  /**
   * Function for retrieving the entity, identified by the given id.
   */
  @Input() retrieve?: (id: Id) => Observable<T>;
  /**
   * Form control for accessing validation errors.
   */
  @Input() formControl?: FormControl;
  /**
   * Default option which will be shown if nothing is selected. Only works in combination with required=false.
   */
  @Input() defaultOption?: String;
  /**
   * Currently selected entities.
   */
  selectedEntityId?: Id;
  selectedEntityValue?: T;
  /**
   * Template for displaying the selected entity.
   */
  @Input() displayTemplate?: TemplateRef<any>;
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
    console.log(this.formControl?.value);
    this.s.push(this.searchFC.valueChanges.pipe(
      // Ignore other types. Required because of selecting a suggestion leading to setting the value automatically in
      // the search form control.
      filter(v => typeof v === 'string'),
      // Ignore null-values. These are set when a suggestion is selected in order to clear them.
      filter(v => v !== null),
      tap(() => {
        this.notifyOnTouched();
      }),
      // Debounce in order to void too many search requests.
      debounceTime(SearchableEntityInputComponent.SearchDebounceTimeMS),
      // Initial value for first suggestions.
      startWith(''),
      switchMap(v => v === null ? EMPTY : this.refreshSuggestions(v)),
    ).subscribe());
    if (this.required) {
      this.searchFC.addValidators(Validators.required);
    }
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
      tap(newSuggestions => this.suggestions.next(newSuggestions)),
      map(_ => void 0),
    );
  }

  /**
   * Selects the given entity clears search.
   * @param entity The entity to select.
   * @private
   */
  selectEntity(entity: T): void {
    if (this.searchFC.disabled) {
      throw new MDSError(MDSErrorCode.AppError, 'form control is disabled');
    }
    this.suggestions.next([]);
    this.selectedEntityId = entity.id;
    this.selectedEntityValue = entity;
    this.notifyOnChange();
  }

  /**
   * Clears the selected entity.
   */
  clearSelectedEntity(): void {
    if (this.searchFC.disabled) {
      throw new MDSError(MDSErrorCode.AppError, 'form control is disabled');
    }
    this.selectedEntityId = undefined;
    this.selectedEntityValue = undefined;
    this.clearSearch();
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

  private onChangeListeners: ((id: Id | null) => void)[] = [];
  private onTouchedListeners: (() => void)[] = [];

  private notifyOnChange(): void {
    this.onChangeListeners.forEach(l => l(this.selectedEntityId !== undefined ? this.selectedEntityId : null));
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
   * Used in order to satisfy {@link ControlValueAccessor}. Initial values only contains entity id, which is set and
   * its value retrieved via {@link retrieve}.
   * @param id The id of the selected entity.
   */
  writeValue(id: Id | null): void {
    this.suggestions.next([]);
    this.selectedEntityId = id !== null ? id : undefined;
    this.loadSelectedEntityValue();
  }

  private loadingSubscription?: Subscription;

  /**
   * Loads the entity value via {@link retrieve} for the selected entity, when {@link selectedEntityValue} is not set.
   * @private
   */
  private loadSelectedEntityValue(): void {
    this.loadingSubscription?.unsubscribe();
    if (this.selectedEntityId === undefined) {
      this.loadingSubscription = undefined;
      return;
    }
    if (!this.retrieve) {
      throw new MDSError(MDSErrorCode.AppError, 'missing retrieve function');
    }
    this.loadingSubscription = this.retrieve(this.selectedEntityId).subscribe(retrievedValue => {
      if (this.selectedEntityId !== retrievedValue.id) {
        return;
      }
      this.selectedEntityValue = retrievedValue;
    });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && this.selectedEntityId === undefined) {
      return {
        required: true,
      };
    }
    return null;
  }
}
