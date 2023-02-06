import { ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

/**
 * Like {@link Validators.required} but for {@link moment.Duration}.
 * @param control
 * @constructor
 */
export let ValidatorDurationRequired: ValidatorFn = (control): ValidationErrors | null => {
  const dur = control.value as moment.Duration;
  if (dur.asMilliseconds() === 0) {
    return {
      'required': true,
    };
  }
  return null;
};

/**
 * Like {@link Validators.min} but for {@link moment.Duration}.
 * @param min The minimum allowed duration.
 * @constructor
 */
export function ValidatorDurationMin(min: moment.Duration): ValidatorFn {
  return (control): ValidationErrors | null => {
    const dur = control.value as moment.Duration;
    if (dur.asMilliseconds() < min.asMilliseconds()) {
      return {
        'min': {
          'min': min,
          'actual': dur,
        },
      };
    }
    return null;
  };
}
