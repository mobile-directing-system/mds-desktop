import { formatEditDuration, parseEditDuration } from './duration-picker.component';
import * as moment from 'moment';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { MatInputHarness } from '@angular/material/input/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

describe('formatEditDuration', () => {
  const tests: {
    dur: moment.DurationInputArg1;
    expect: string;
  }[] = [
    {
      dur: {
        seconds: 1,
      },
      expect: '1s',
    },
    {
      dur: {
        hours: 2,
      },
      expect: '2h',
    },
    {
      dur: {
        day: 2,
        minutes: 3,
      },
      expect: '48h 3m',
    },
    {
      dur: {
        hours: 4,
        minutes: 2,
        seconds: 20,
      },
      expect: '4h 2m 20s',
    },
    {
      dur: {},
      expect: '0s',
    },
    {
      dur: {
        hours: 28,
        seconds: 2,
        milliseconds: 30,
      },
      expect: '28h 2s 30ms',
    },
    {
      dur: {
        minutes: 120,
      },
      expect: '2h',
    },
    {
      dur: {
        hours: 23,
        minutes: 59,
        seconds: 59,
        milliseconds: 999,
      },
      expect: '23h 59m 59s 999ms',
    },
  ];
  tests.forEach(tt => {
    const dur = moment.duration(tt.dur);
    it(`should format duration for ${ dur.toISOString() } correctly`, () => {
      expect(formatEditDuration(dur)).toEqual(tt.expect);
    });
  });
});

describe('parseEditDuration', () => {
  const tests: {
    in: string;
    expect: moment.DurationInputArg1 | undefined,
  }[] = [
    {
      in: '2h',
      expect: {
        hours: 2,
      },
    },
    {
      in: 'abc',
      expect: undefined,
    },
    {
      in: '2h2h2h',
      expect: undefined,
    },
    {
      in: '1h 2m 29s',
      expect: {
        hours: 1,
        minutes: 2,
        seconds: 29,
      },
    },
    {
      in: 'h1h',
      expect: undefined,
    },
    {
      in: '1m 39h',
      expect: {
        hours: 39,
        minutes: 1,
      },
    },
    {
      in: '200s',
      expect: {
        minutes: 3,
        seconds: 20,
      },
    },
    {
      in: '0',
      expect: {},
    },
  ];
  tests.forEach(tt => {
    let expectDur: moment.Duration | undefined = undefined;
    if (tt.expect !== undefined) {
      expectDur = moment.duration(tt.expect);
    }
    it(`should parse duration '${ tt.in }' as ${ expectDur?.toISOString() }`, () => {
      expect(parseEditDuration(tt.in)).toEqual(expectDur);
    });
  });
});

@Component({
    template: `
      <mat-form-field>
        <app-duration-picker [formControl]="fc"></app-duration-picker>
      </mat-form-field>`,
  },
)
class TestHostComponent {
  fc = new FormControl<moment.Duration>(moment.duration(0), { nonNullable: true });
}

describe('DurationPickerComponent.integration', () => {
  let spectator: Spectator<TestHostComponent>;
  let host: TestHostComponent;
  const createComponent = createComponentFactory({
    component: TestHostComponent,
    imports: [CoreModule],
  });
  let hLoader: HarnessLoader;
  let input: MatInputHarness;
  let formField: MatFormFieldHarness;

  beforeEach(async () => {
    spectator = createComponent();
    host = spectator.component;
    await spectator.fixture.whenStable();
    hLoader = await TestbedHarnessEnvironment.loader(spectator.fixture);
    input = await hLoader.getHarness(MatInputHarness);
    formField = await hLoader.getHarness(MatFormFieldHarness);
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should display input', () => {
    expect(input).toBeTruthy();
    expect(spectator.query('input')).toBeVisible();
  });

  it('should be mat-form-field', () => {
    expect(formField).toBeTruthy();
  });

  it('should display current duration', async () => {
    const inputText = await input.getValue();
    expect(inputText).toEqual(formatEditDuration(host.fc.value));
  });

  it('should be invalid when invalid duration is entered', async () => {
    await input.setValue('h1s');
    await spectator.fixture.whenStable();
    const isValid = await formField.isControlValid();
    expect(isValid).toBeFalse();
  });

  it('should be valid when valid duration is entered', async () => {
    await input.setValue('23h 19m 3s');
    await spectator.fixture.whenStable();
    const isValid = await formField.isControlValid();
    expect(isValid).toBeTrue();
  });

  it('should notify about new valid duration', async () => {
    await input.setValue('23h 19m 3s');
    await spectator.fixture.whenStable();
    expect(host.fc.value).toEqual(moment.duration({
      hours: 23,
      minutes: 19,
      seconds: 3,
    }));
  });

  it('should display updated duration', async () => {
    host.fc.setValue(moment.duration({
      minutes: 10,
      milliseconds: 3,
    }));
    await spectator.fixture.whenStable();
    const inputValue = await input.getValue();
    expect(inputValue).toEqual('10m 3ms');
  });
});
