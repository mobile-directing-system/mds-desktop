import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { Spectator, byText, createComponentFactory } from '@ngneat/spectator';
import { CoreModule } from 'src/app/core/core.module';
import { MailChannelDetails } from 'src/app/core/model/channel';
import { MailChannelDetailsComponent } from './mail-channel-details.component';
import { LogisticsModule } from 'src/app/features/logistics/logistics.module';

@Component({
  template: `
    <app-mail-channel-details [formControl]="fc"></app-mail-channel-details>`,
})
class TestHostComponent {
  fc = new FormControl<MailChannelDetails>({
    email: '',
  }, { nonNullable: true });
}

describe('MailChannelDetailsComponent', () => {
  let spectator: Spectator<TestHostComponent>;
  let host: TestHostComponent;
  let hLoader: HarnessLoader;

  let details: MailChannelDetails = {
    email: "test@example.com"
  };

  const createComponent = createComponentFactory({
    component: TestHostComponent,
    imports: [CoreModule, LogisticsModule],
    declarations: [MailChannelDetailsComponent],
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

  describe('email', () => {
    let mailFF: MatFormFieldHarness;
    let input: MatInputHarness;

    beforeEach(async () => {
      mailFF = await hLoader.getHarness(MatFormFieldHarness.with({
        floatingLabelText: 'Email',
      }));
      input = await hLoader.getHarness(MatInputHarness.with({
        value: host.fc.value.email,
      }));
    });

    it('should display form field', () => {
      expect(mailFF).toBeTruthy();
    });

    it('should display input', () => {
      expect(input).toBeTruthy();
    });

    it('should apply input changes', async () => {
      let newMail = "new@mail.com";
      await input.setValue(newMail);
      expect(host.fc.value).toEqual({
        ...details,
        email: newMail,
      });
    });

    describe('form validator', () => {
      it('should display error when mail is empty', async () => {
        await input.setValue("");
        await input.blur();
        expect(spectator.query(byText("Email is required", {
          selector: "mat-error",
          exact: true
        }))).toBeVisible();
      });

      it('should propagate required error to parent form control', async () => {
        await input.setValue("");
        expect(host.fc.invalid).toBeTrue();
        expect(host.fc.hasError("required")).toBeTrue();
      });

      it('should display error when mail is invalid', async () => {
        await input.setValue("invalid mail");
        await input.blur();
        expect(spectator.query(byText("Invalid mail", {
          selector: "mat-error",
          exact: true
        }))).toBeVisible();
      });

      it('should propagate invalid mail error to parent form control', async () => {
        await input.setValue("invalid mail");
        expect(host.fc.invalid).toBeTrue();
        expect(host.fc.hasError("email")).toBeTrue();
      });
    });

  });
});
