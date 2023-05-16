import { DurationPipe } from './duration.pipe';
import * as moment from "moment/moment";

describe('DurationPipe', () => {
  it('create an instance', () => {
    const pipe = new DurationPipe();
    expect(pipe).toBeTruthy();
  });
  it('test milliseconds', () => {
    const pipe = new DurationPipe();
    const duration = moment.duration(500);
    expect(pipe.transform(duration, "long")).toBe("500ms");
  });
  it('test minute', () => {
    const pipe = new DurationPipe();
    const duration = moment.duration(1, "minute");
    expect(pipe.transform(duration, "long")).toBe("1m");
  });
});

