import { Component, ElementRef, OnInit, Optional, Self } from '@angular/core';
import { CustomMatFormField } from '../../util/form-fields';
import * as moment from 'moment';
import { NgControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

export function formatEditDuration(dur: moment.Duration): string {
  if (dur.asMilliseconds() === 0) {
    return '0s';
  }
  let s: string[] = [];
  if (Math.floor(dur.asHours()) > 0) {
    s.push(`${ Math.floor(dur.asHours()) }h`);
  }
  if (dur.minutes() > 0) {
    s.push(`${ dur.minutes() }m`);
  }
  if (dur.seconds() > 0) {
    s.push(`${ dur.seconds() }s`);
  }
  if (dur.milliseconds() > 0) {
    s.push(`${ dur.milliseconds() }ms`);
  }
  return s.join(' ');
}

const editDurationParts: {
  unitText: string;
  unit: moment.unitOfTime.DurationConstructor;
}[] = [
  {
    unitText: 'milliseconds',
    unit: 'milliseconds',
  },
  {
    unitText: 'millisecond',
    unit: 'milliseconds',
  },
  {
    unitText: 'seconds',
    unit: 'seconds',
  },
  {
    unitText: 'second',
    unit: 'seconds',
  },
  {
    unitText: 'minutes',
    unit: 'minutes',
  },
  {
    unitText: 'minute',
    unit: 'minute',
  },
  {
    unitText: 'hours',
    unit: 'hours',
  },
  {
    unitText: 'hour',
    unit: 'hours',
  },
  {
    unitText: 'ms',
    unit: 'milliseconds',
  },
  {
    unitText: 's',
    unit: 'seconds',
  },
  {
    unitText: 'm',
    unit: 'minutes',
  },
  {
    unitText: 'h',
    unit: 'hours',
  },
];

export function parseEditDuration(s: string): moment.Duration | undefined {
  s = s.toLowerCase();
  let dur = moment.duration(0);
  const segments = s.split(' ');
  const alreadyParsedUnits: moment.unitOfTime.DurationConstructor[] = [];
  // Check each segment for being a valid duration part.
  for (let _segment of segments) {
    const segment = _segment.trim();
    if (segment === '' || segment === '0') {
      continue;
    }
    const durPart = editDurationParts.find(durationPart => segment.endsWith(durationPart.unitText));
    if (durPart === undefined) {
      // Invalid.
      return undefined;
    }
    if (alreadyParsedUnits.some(p => p === durPart.unit)) {
      // Invalid. Example: 12h 2s 2s.
      return undefined;
    }
    alreadyParsedUnits.push(durPart.unit);
    // Parse and add to duration.
    const indexOfUnitText = segment.lastIndexOf(durPart.unitText);
    const v = +(segment.substring(0, indexOfUnitText));
    if (isNaN(v)) {
      // Invalid.
      return undefined;
    }
    dur.add(moment.duration(v, durPart.unit));
  }
  return dur;
}

/**
 * Form-field for picking {@link moment.Duration}.
 */
@Component({
  selector: 'app-duration-picker',
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: DurationPickerComponent,
    },
  ],
})
export class DurationPickerComponent extends CustomMatFormField<moment.Duration> implements OnInit {
  textValue: string = '';

  constructor(_elementRef: ElementRef<HTMLElement>, @Optional() @Self() ngControl: NgControl) {
    super({
      defaultValue: moment.duration('0'),
      controlType: 'mds-desktop-core-components-duration-picker-component',
      ngControl: ngControl,
      elementRef: _elementRef,
    });
  }

  ngOnInit(): void {
    this.ngControl.control?.addValidators(this.validate.bind(this));
    this.ngControl.control?.updateValueAndValidity();
  }

  private validate(): ValidationErrors | null {
    if (!parseEditDuration(this.textValue)) {
      return {
        invalidDuration: true,
      };
    }
    return null;
  }

  get empty(): boolean {
    return this.textValue === '';
  }

  isErrorState(): boolean {
    return !this.empty && !parseEditDuration(this.textValue);
  }

  override writeValue(v: moment.Duration) {
    super.writeValue(v);
    this.textValue = formatEditDuration(v);
  }

  /**
   * Called when the text input value changes. If a valid duration is parsed, the actual value is updated to the
   * corresponding {@link moment.Duration}.
   */
  textValueChange(): void {
    const dur = parseEditDuration(this.textValue);
    this.notifyOnTouched();
    this.ngControl.control?.updateValueAndValidity();
    if (dur !== undefined) {
      this.value = moment.duration(dur);
      this.notifyOnChange();
    } else {
      this.triggerStateChangeDetection();
    }
  }
}
