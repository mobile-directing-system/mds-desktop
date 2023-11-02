import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectHarness } from '@angular/material/select/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { RadioChannelDetailsComponent } from './radio-channel-details.component';
import { RadioChannelDetails } from 'src/app/core/model/channel';
import { LogisticsModule } from 'src/app/features/logistics/logistics.module';
import { CoreModule } from 'src/app/core/core.module';


@Component({
  template: `
    <app-radio-channel-details [formControl]="fc"></app-radio-channel-details>`,
})
class TestHostComponent {
  fc = new FormControl<RadioChannelDetails>({
    name: '',
    info: '',
  }, { nonNullable: true });
}

describe('RadioChannelDetailsComponent.integration', () => {
  let spectator: Spectator<TestHostComponent>;
  let host: TestHostComponent;
  let component: RadioChannelDetailsComponent;

  const createComponent = createComponentFactory({
    component: TestHostComponent,
    imports: [CoreModule, LogisticsModule],
    declarations: [RadioChannelDetailsComponent],
    detectChanges: false,
  });
  const details: RadioChannelDetails = {
    name: 'channel 1',
    info: 'thunder',
  };
  let hLoader: HarnessLoader;
  let channelSelect: MatSelectHarness;

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.query(RadioChannelDetailsComponent)!;
    host = spectator.component;
    host.fc.setValue(details);
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    hLoader = await TestbedHarnessEnvironment.loader(spectator.fixture);
    channelSelect = await hLoader.getHarness(MatSelectHarness);
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should display select', ()=> {
    expect(channelSelect).toBeTruthy();
  });

  it('should apply selected option to form control', async ()=> {
    const selectOption = component.selectableChannelDetails[0];

    await channelSelect.open();
    const options = await channelSelect.getOptions({text: selectOption.name});
    await options[0].click();
    await spectator.fixture.whenStable();
    expect(host.fc.value).toEqual({
      name: selectOption.name,
      info: selectOption.info
    });

  });
});
