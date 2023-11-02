import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneChannelDetailsComponent } from './phone-channel-details.component';
import { FormControl } from '@angular/forms';
import { PhoneChannelDetails } from 'src/app/core/model/channel';
import { Spectator, byText, createComponentFactory } from '@ngneat/spectator';
import { HarnessLoader } from '@angular/cdk/testing';
import { Component } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { LogisticsModule } from 'src/app/features/logistics/logistics.module';

@Component({
  template: `
    <app-phone-channel-details [formControl]="fc"></app-phone-channel-details>`,
})
class TestHostComponent {
  fc = new FormControl<PhoneChannelDetails>({
    phoneNumber: "",
  }, { nonNullable: true });
}

describe('PhoneChannelDetailsComponent', () => {
  let spectator: Spectator<TestHostComponent>;
  let host: TestHostComponent;
  let hLoader: HarnessLoader;

  let details: PhoneChannelDetails = {
    phoneNumber: "1234567890"
  };
  
  const createComponent = createComponentFactory({
    component: TestHostComponent,
    imports: [CoreModule, LogisticsModule],
    declarations: [PhoneChannelDetailsComponent],
    detectChanges: false,
  });

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

  describe('phone', () => {
    let phoneFF: MatFormFieldHarness;
    let input: MatInputHarness;

    beforeEach(async () => {
      phoneFF = await hLoader.getHarness(MatFormFieldHarness.with({
        floatingLabelText: 'Phone number',
      }));
      input = await hLoader.getHarness(MatInputHarness.with({
        value: host.fc.value.phoneNumber,
      }));
    });

    it('should display form field', () => {
      expect(phoneFF).toBeTruthy();
    });

    it('should display input', () => {
      expect(input).toBeTruthy();
    });

    it('should apply input changes', async () => {
      let newNumber = "0987654321";
      await input.setValue(newNumber);
      expect(host.fc.value).toEqual({
        ...details,
        phoneNumber: newNumber,
      });
    });

    it('should display error when phone number is empty', async () => {
      await input.setValue("");
      await input.blur();
      expect(spectator.query(byText("Phone number is required", {
        selector: "mat-error",
        exact: true
      }))).toBeVisible();
    });

    it('should propagate required error to parent form control', async () => {
      await input.setValue("");
      expect(host.fc.invalid).toBeTrue();
      expect(host.fc.hasError("required")).toBeTrue();
    });
  });
});
