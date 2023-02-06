import { Component, ElementRef, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Importance, localizeImportance } from '../../model/importance';
import { MatFormFieldControl } from '@angular/material/form-field';
import { CustomMatFormField } from '../../util/form-fields';

/**
 * Component for picking {@link Importance} via select.
 */
@Component({
  selector: 'app-importance-select',
  templateUrl: './importance-select.component.html',
  styleUrls: ['./importance-select.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: ImportanceSelectComponent,
    },
  ],
})
export class ImportanceSelectComponent extends CustomMatFormField<Importance> implements ControlValueAccessor, MatFormFieldControl<Importance> {
  Importance = Importance;
  localizeImportance = localizeImportance;
  availableImportance: Importance[] = Object.keys(Importance).map(v => parseInt(v)).filter(v => !isNaN(v));

  constructor(_elementRef: ElementRef<HTMLElement>, @Optional() @Self() ngControl: NgControl) {
    super({
      controlType: 'mds-desktop-core-components-importance-select-component',
      defaultValue: Importance.Regular,
      elementRef: _elementRef,
      ngControl: ngControl,
    });
  }

  selectImportance(importance: Importance): void {
    super.value = importance;
    super.notifyOnChange();
  }

  get empty(): boolean {
    return false;
  }

  isErrorState(): boolean {
    return false;
  }
}
