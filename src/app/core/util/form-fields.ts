import { MatFormFieldControl } from '@angular/material/form-field';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, ElementRef, HostListener, Inject, Injectable, Input, OnDestroy } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Injectable()
export abstract class CustomControlValueAccessor<T> {
  private _value: T;
  get value(): T {
    return this._value;
  }

  set value(v: T) {
    this._value = v;
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  private _disabled = false;

  private onChangeListeners: ((v: T) => void) [] = [];
  private onTouchedListeners: (() => void) [] = [];

  registerOnChange(fn: (v: T) => void): void {
    this.onChangeListeners.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedListeners.push(fn);
  }

  writeValue(v: T): void {
    this.value = v;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  notifyOnChange(): void {
    this.notifyOnTouched();
    this.onChangeListeners.forEach(l => l(this.value));
  }

  notifyOnTouched(): void {
    this.onTouchedListeners.forEach(l => l());
  }

  protected constructor(defaultValue: T) {
    this._value = defaultValue;
  }
}

/**
 * Props for usage in {@link CustomMatFormField}.
 */
export interface CustomMatFormFieldProps<T> {
  defaultValue: T;
  controlType: string;
  ngControl: NgControl;
  elementRef: ElementRef<HTMLElement>;
  onContainerClick?: (event: MouseEvent) => void;
  onTouched?: () => void;
  customFocus?: boolean;
}

/**
 * Simple abstraction of {@link MatFormFieldControl} and {@link ControlValueAccessor} for omitting that horrible
 * boilerplate code when building custom form-field-controls.
 */
@Component({ template: '' })
// eslint-disable-next-line @angular-eslint/component-class-suffix
export abstract class CustomMatFormField<T> extends CustomControlValueAccessor<T> implements MatFormFieldControl<T>, ControlValueAccessor, OnDestroy {
  override get value(): T {
    return super.value;
  }

  override set value(v: T) {
    super.value = v;
    this.stateChanges.next();
  }

  triggerStateChangeDetection(): void {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  stateChanges = new Subject<void>();
  private static nextId = 0;
  id: string;

  private _placeholder: string = '';
  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  focused = false;
  touched = false;

  @HostListener('focusin', ['$event'])
  onFocusInListener(event: FocusEvent) {
    if (this.props.customFocus === false) {
      return;
    }
    this.onFocusIn(event);
  }

  onFocusIn(_: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  @HostListener('focusout', ['$event'])
  private onFocusOutListener(event: FocusEvent) {
    if (this.props.customFocus === false) {
      return;
    }
    this.onFocusOut(event);
  }


  onFocusOut(event: FocusEvent) {
    if (!this.props.elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      if (this.props.onTouched) {
        this.props.onTouched();
      }
      this.stateChanges.next();
      super.notifyOnTouched();
    }
  }

  abstract get empty(): boolean;

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }


  get controlType(): string {
    return this.props.controlType;
  }

  get errorState(): boolean {
    return this.touched && (this.ngControl.invalid || this.isErrorState());
  }

  abstract isErrorState(): boolean ;

  ngControl: NgControl;

  onContainerClick(event: MouseEvent): void {
    if (this.props.onContainerClick) {
      this.props.onContainerClick(event);
    }
  }

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _required = false;

  setDescribedByIds(ids: string[]): void {
    // We don't care.
  }

  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
    this.disabled = isDisabled;
    this.stateChanges.next();
  }

  override writeValue(v: T): void {
    this.value = v;
    this.stateChanges.next();
  }

  /**
   * For constructor values:
   * ```
   * constructor(_elementRef: ElementRef<HTMLElement>, @Optional() @Self() ngControl: NgControl)
   * ```
   * Do **not** add something like the following to component providers:
   * ```
   * {
   *   provide: NG_VALUE_ACCESSOR,
   *   useExisting: forwardRef(() => ChannelTypeSelectComponent),
   *   multi: true,
   * },
   * ```
   * @param props
   */
  protected constructor(@Inject('') private props: CustomMatFormFieldProps<T>) {
    super(props.defaultValue);
    this.id = `${ props.controlType }-${ CustomMatFormField.nextId++ }`;

    this.ngControl = props.ngControl;
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }
}
