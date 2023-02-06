import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { AngularMaterialModule } from '../../util/angular-material.module';
import { FormControl } from '@angular/forms';
import { ChannelType } from '../../model/channel';
import { Component } from '@angular/core';
import { MatSelectHarness } from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';


@Component({
  template: `
    <mat-form-field *ngIf="fc">
      <app-channel-type-select [formControl]="fc"></app-channel-type-select>
    </mat-form-field>
  `,
})
class TestHostComponent {
  fc?: FormControl<ChannelType>;
}

describe('ChannelTypeSelectComponent.integration', () => {
  let spectator: Spectator<TestHostComponent>;
  let component: TestHostComponent;
  const createComponent = createComponentFactory({
    component: TestHostComponent,
    imports: [CoreModule, AngularMaterialModule],
  });
  let hLoader: HarnessLoader;
  let select: MatSelectHarness;
  let fc: FormControl<ChannelType>;

  beforeEach(async () => {
    fc = new FormControl<ChannelType>(ChannelType.InAppNotification, { nonNullable: true });
    spectator = createComponent({
      props: {
        fc: fc,
      },
    });
    component = spectator.component;
    await spectator.fixture.whenStable();
    hLoader = TestbedHarnessEnvironment.loader(spectator.fixture);
    select = await hLoader.getHarness(MatSelectHarness);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply selected value from form control', async () => {
    const valueText = await select.getValueText();
    expect(valueText.toLowerCase()).toContain('in-app notification');
  });

  it('should should select correct value', async () => {
    // Find radio value.
    await select.open()
    const options = await select.getOptions();
    const optionTexts = await Promise.all(options.map(async (v) => v.getText()));
    const radioIndex = optionTexts.findIndex(vt => vt.toLowerCase().includes('radio'));
    if (radioIndex === -1) {
      fail(`missing radio channel type. found ones: ${ optionTexts }`);
      return;
    }
    const radioOption = options[radioIndex];
    // Select radio.
    await radioOption.click();

    await spectator.fixture.whenStable();

    const selected = await select.getValueText()
    expect(selected.toLowerCase()).withContext('update select value').toContain('radio')
    expect(fc.value).withContext('update form control value').toEqual(ChannelType.Radio);
  });
});
