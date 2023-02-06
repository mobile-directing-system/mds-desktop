import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';

export function formatDurationLong(dur: moment.Duration): string {
  return dur.format('w[w] d[d] h[h] m[m] s[s]', {
    trim: 'both mid',
  });
}

/**
 * Pipe for formatting {@link moment.Duration}.
 */
@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {

  transform(dur: moment.Duration, format: 'long' | 'humanized' = 'long'): string {
    switch (format) {
      case 'humanized':
        return dur.humanize();
      case 'long':
        return formatDurationLong(dur);
    }
  }
}
