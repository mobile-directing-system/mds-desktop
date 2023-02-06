import { RadioChannelDetailsComponent } from './radio-channel-details.component';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RadioChannelDetails } from '../../../../../core/model/channel';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../../../../core/core.module';
import { LogisticsModule } from '../../../logistics.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';


@Component({
  template: `
    <app-radio-channel-details [formControl]="fc"></app-radio-channel-details>`,
})
class TestHostComponent {
  fc = new FormControl<RadioChannelDetails>({
    info: '',
  }, { nonNullable: true });
}

describe('RadioChannelDetailsComponent.integration', () => {
  let spectator: Spectator<TestHostComponent>;
  let host: TestHostComponent;
  const createComponent = createComponentFactory({
    component: TestHostComponent,
    imports: [CoreModule, LogisticsModule],
    declarations: [RadioChannelDetailsComponent],
    detectChanges: false,
  });
  const details: RadioChannelDetails = {
    info: 'thunder',
  };
  let hLoader: HarnessLoader;

  beforeEach(async () => {
    spectator = createComponent();
    host = spectator.component;
    host.fc.setValue(details);
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    hLoader = await TestbedHarnessEnvironment.loader(spectator.fixture);
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  describe('info', () => {
    const newInfo = 'hope';
    let infoFF: MatFormFieldHarness;
    let textarea: MatInputHarness;

    beforeEach(async () => {
      infoFF = await hLoader.getHarness(MatFormFieldHarness.with({
        floatingLabelText: 'Info',
      }));
      textarea = await hLoader.getHarness(MatInputHarness.with({
        value: host.fc.value.info,
      }));
    });

    it('should display form field', () => {
      expect(infoFF).toBeTruthy();
    });

    it('should display input', () => {
      expect(textarea).toBeTruthy();
    });

    it('should apply input changes', async () => {
      await textarea.setValue(newInfo);
      await spectator.fixture.whenStable();
      expect(host.fc.value).toEqual({
        ...details,
        info: newInfo,
      });
    });
  });
});
