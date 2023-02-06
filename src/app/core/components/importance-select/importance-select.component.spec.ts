import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { AngularMaterialModule } from '../../util/angular-material.module';
import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { MatSelectHarness } from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Importance } from '../../model/importance';


@Component({
  template: `
    <mat-form-field *ngIf="fc">
      <app-importance-select [formControl]="fc"></app-importance-select>
    </mat-form-field>
  `,
})
class TestHostComponent {
  fc?: FormControl<Importance>;
}

describe('ImportanceSelectComponent.integration', () => {
  let spectator: Spectator<TestHostComponent>;
  let component: TestHostComponent;
  const createComponent = createComponentFactory({
    component: TestHostComponent,
    imports: [CoreModule, AngularMaterialModule],
  });
  let hLoader: HarnessLoader;
  let select: MatSelectHarness;
  let fc: FormControl<Importance>;

  beforeEach(async () => {
    fc = new FormControl<Importance>(Importance.Regular, { nonNullable: true });
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
    expect(valueText.toLowerCase()).toContain('regular');
  });

  it('should should select correct value', async () => {
    // Find strike value.
    await select.open();
    const options = await select.getOptions();
    const optionTexts = await Promise.all(options.map(async (v) => v.getText()));
    const strikeIndex = optionTexts.findIndex(vt => vt.toLowerCase().includes('strike'));
    if (strikeIndex === -1) {
      fail(`missing strike importance. found ones: ${ optionTexts }`);
      return;
    }
    const strikeOption = options[strikeIndex];
    // Select strike.
    await strikeOption.click();

    await spectator.fixture.whenStable();

    const selected = await select.getValueText();
    expect(selected.toLowerCase()).withContext('update select value').toContain('strike');
    expect(fc.value).withContext('update form control value').toEqual(Importance.Strike);
  });

  it('should include all importance as option', async () => {
    await select.open();
    const options = await select.getOptions();
    const importance: Importance[] = Object.values(Importance).filter(i => !isNaN(+i)) as Importance[];
    expect(options.length).toEqual(importance.length);
  });
});
