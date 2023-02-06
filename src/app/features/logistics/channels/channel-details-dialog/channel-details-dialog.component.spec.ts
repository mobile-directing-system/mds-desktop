import {
  ChannelDetailsDialog,
  ChannelDetailsDialogData,
  ChannelDetailsDialogResult,
} from './channel-details-dialog.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../../../core/core.module';
import { LogisticsModule } from '../../logistics.module';
import { ChannelType, localizeChannelType } from '../../../../core/model/channel';
import * as moment from 'moment';
import { Importance, localizeImportance } from '../../../../core/model/importance';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { formatEditDuration } from '../../../../core/components/duration-picker/duration-picker.component';
import { newMatDialogRefMock } from '../../../../core/testutil/testutil';

describe('ChannelDetailsDialog', () => {
  let spectator: Spectator<ChannelDetailsDialog>;
  let component: ChannelDetailsDialog;
  const createComponent = createComponentFactory({
    component: ChannelDetailsDialog,
    imports: [CoreModule, LogisticsModule],
    mocks: [MatDialog, MatDialogRef],
  });
  let harnessLoader: HarnessLoader;
  let dialogData: ChannelDetailsDialogData;
  let formFields: MatFormFieldHarness[];

  beforeEach(async () => {
    dialogData = {
      create: false,
      channel: {
        id: 'cake',
        entry: 'clever',
        label: 'valley',
        type: ChannelType.Radio,
        timeout: moment.duration({ hours: 1 }),
        priority: 40,
        minImportance: Importance.Strike,
        details: {
          info: 'appear',
        },
      },
    };
    spectator = createComponent({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
      ],
    });
    component = spectator.component;
    await spectator.fixture.whenStable();
    harnessLoader = await TestbedHarnessEnvironment.loader(spectator.fixture);
    formFields = await harnessLoader.getAllHarnesses(MatFormFieldHarness);
    spectator.inject(MatDialogRef).close.and.returnValue(undefined);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display channel label if not empty', () => {
    expect(spectator.query(byTextContent(dialogData.channel.label, {
      exact: false,
      selector: 'h2',
    }))).toBeVisible();
  });

  it('should display replacement for empty channel label', async () => {
    component.form.patchValue({
      label: '',
    });
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('unnamed', {
      exact: false,
      selector: 'h2',
    }))).toBeVisible();
  });

  [
    'label',
    'channel type',
    'importance',
    'priority',
    'timeout',
  ].forEach(label => {
    it(`should display form field for ${ label }`, async () => {
      const labels = await Promise.all(formFields.map(ff => ff.getLabel()));
      expect(labels.find(l => l && l.toLowerCase().includes(label)))
        .withContext(`found label: ${ labels }`).toBeTruthy();
    });
  });

  describe('label form field', () => {
    let labelInput: HTMLInputElement;
    const newLabel = 'oar';

    beforeEach(() => {
      const tmpLabelInput = spectator.query(byTextContent('Label', {
        exact: false,
        selector: 'mat-form-field',
      }))?.querySelector('input');
      if (tmpLabelInput) {
        labelInput = tmpLabelInput;
      }
    });

    it('should display input', () => {
      expect(labelInput).toBeTruthy();
    });

    it('should display value', () => {
      expect(labelInput.value).toEqual(dialogData.channel.label);
    });

    it('should update label when input changes', fakeAsync(() => {
      spectator.typeInElement(newLabel, labelInput);
      tick();
      expect(component.form.getRawValue().label).toEqual(newLabel);
    }));
  });

  describe('channel type form field', () => {
    let channelTypeSelect: MatSelectHarness;
    const newChannelType: ChannelType = ChannelType.InAppNotification;
    const searchOption = 'in-app';

    beforeEach(async () => {
      const formField = spectator.query(byTextContent('Channel Type', {
        exact: false,
        selector: 'mat-form-field',
      }));
      if (!formField) {
        return;
      }
      formField.className += ' TEST_SELECT';
      const tmpChannelTypeSelect = await harnessLoader.getHarnessOrNull(MatSelectHarness.with({
        ancestor: '.TEST_SELECT',
      }));
      if (!tmpChannelTypeSelect) {
        return;
      }
      channelTypeSelect = tmpChannelTypeSelect;
    });

    it('should display select', () => {
      expect(channelTypeSelect).toBeTruthy();
    });

    it('should display value', async () => {
      const selected = await channelTypeSelect.getValueText();
      const search = localizeChannelType(dialogData.channel.type);
      expect(selected.includes(search))
        .withContext(`expect ${ search } in ${ selected }`).toBeTrue();
    });

    it('should update channel type on selection', async () => {
      await channelTypeSelect.open();
      const options = await channelTypeSelect.getOptions();
      const optionLabels = await Promise.all(options.map(o => o.getText()));
      const optionIndex = optionLabels.findIndex(l => l.toLowerCase().includes(searchOption));
      if (optionIndex === -1) {
        fail(`option '${ searchOption }' not included in available ones: ${ optionLabels }`);
        return;
      }
      const optionText = await options[optionIndex].getText();
      await channelTypeSelect.clickOptions({
        text: optionText,
      });
      await spectator.fixture.whenStable();
      expect(component.form.getRawValue().type).toEqual(newChannelType);
    });
  });

  describe('min importance form field', () => {
    let minImportanceSelect: MatSelectHarness;
    const newMinImportance: Importance = Importance.Low;
    const searchOption = 'low';

    beforeEach(async () => {
      const formField = spectator.query(byTextContent('Importance', {
        exact: false,
        selector: 'mat-form-field',
      }));
      if (!formField) {
        return;
      }
      formField.className += ' TEST_SELECT';
      const tmpImportanceSelect = await harnessLoader.getHarnessOrNull(MatSelectHarness.with({
        ancestor: '.TEST_SELECT',
      }));
      if (!tmpImportanceSelect) {
        return;
      }
      minImportanceSelect = tmpImportanceSelect;
    });

    it('should display select', () => {
      expect(minImportanceSelect).toBeTruthy();
    });

    it('should display value', async () => {
      const selected = await minImportanceSelect.getValueText();
      const search = localizeImportance(dialogData.channel.minImportance);
      expect(selected.includes(search))
        .withContext(`expect ${ search } in ${ selected }`).toBeTrue();
    });

    it('should update importance on selection', async () => {
      await minImportanceSelect.open();
      const options = await minImportanceSelect.getOptions();
      const optionLabels = await Promise.all(options.map(o => o.getText()));
      const optionIndex = optionLabels.findIndex(l => l.toLowerCase().includes(searchOption));
      if (optionIndex === -1) {
        fail(`option '${ searchOption }' not included in available ones: ${ optionLabels }`);
        return;
      }
      const optionText = await options[optionIndex].getText();
      await minImportanceSelect.clickOptions({
        text: optionText,
      });
      await spectator.fixture.whenStable();
      expect(component.form.getRawValue().minImportance).toEqual(newMinImportance);
    });
  });

  describe('priority form field', () => {
    let priorityInput: HTMLInputElement;
    const newPriority = 135;

    beforeEach(() => {
      const tmpLabelInput = spectator.query(byTextContent('Priority', {
        exact: false,
        selector: 'mat-form-field',
      }))?.querySelector('input');
      if (tmpLabelInput) {
        priorityInput = tmpLabelInput;
      }
    });

    it('should display input', () => {
      expect(priorityInput).toBeTruthy();
    });

    it('should display value', () => {
      const value = priorityInput.value;
      expect(value).toEqual(`${ dialogData.channel.priority }`);
    });

    it('should update priority when input changes', fakeAsync(() => {
      spectator.typeInElement(`${ newPriority }`, priorityInput);
      tick();
      expect(component.form.getRawValue().priority).toEqual(newPriority);
    }));
  });

  describe('timeout form field', () => {
    let formField: MatFormFieldHarness;
    let timeoutInput: MatInputHarness;
    const newTimeout = moment.duration({
      hours: 23,
      minutes: 23,
      seconds: 1,
      milliseconds: 340,
    });

    beforeEach(async () => {
      const tmpFormField = spectator.query(byTextContent('Timeout', {
        exact: false,
        selector: 'mat-form-field',
      }));
      if (!tmpFormField) {
        return;
      }
      tmpFormField.className += ' TEST_SELECT';
      formField = await harnessLoader.getHarness(MatFormFieldHarness.with({
        selector: '.TEST_SELECT',
      }));
      const tmpTimeoutInput = await harnessLoader.getHarnessOrNull(MatInputHarness.with({
        ancestor: '.TEST_SELECT',
      }));
      if (!tmpTimeoutInput) {
        return;
      }
      timeoutInput = tmpTimeoutInput;
    });

    it('should display input', () => {
      expect(timeoutInput).toBeTruthy();
    });

    it('should display value', async () => {
      const value = await timeoutInput.getValue();
      expect(value).toEqual(formatEditDuration(dialogData.channel.timeout));
    });

    it('should update timeout on input change', async () => {
      await timeoutInput.setValue(formatEditDuration(newTimeout));
      await spectator.fixture.whenStable();
      expect(component.form.getRawValue().timeout).toEqual(newTimeout);
    });

    it('should mark negative time as invalid', async () => {
      await timeoutInput.setValue('-1s');
      await spectator.fixture.whenStable();
      const isValid = await formField.isControlValid();
      expect(isValid).toBeFalse();
    });
  });

  describe('channel details', () => {
    const tests: {
      channelType: ChannelType;
      expectSelector: string;
    }[] = [
      {
        channelType: ChannelType.InAppNotification,
        expectSelector: 'app-in-app-notification-channel-details',
      },
      {
        channelType: ChannelType.Radio,
        expectSelector: 'app-radio-channel-details',
      },
    ];
    tests.forEach(tt => {
      it(`should display details for ${ tt.channelType } with ${ tt.expectSelector }`, async () => {
        // Select channel type.
        component.form.patchValue({
          type: tt.channelType,
        });
        spectator.detectComponentChanges();
        await spectator.fixture.whenStable();
        // Assure expected details component.
        expect(spectator.query(tt.expectSelector)).toBeVisible();
      });
    });
  });

  it('should close when cancel-button is clicked', () => {
    spectator.click(byTextContent('Cancel', {
      exact: false,
      selector: 'button',
    }));
    expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledOnceWith(undefined);
  });

  it('should submit when submit-button is clicked', () => {
    const expectResult: ChannelDetailsDialogResult = {
      action: 'submit',
      channel: {
        id: dialogData.channel.id,
        entry: 'separate',
        label: 'jump',
        type: ChannelType.Radio,
        timeout: moment.duration({ seconds: 3 }),
        priority: 65,
        minImportance: Importance.None,
        details: {
          info: 'fond',
        },
      },
    };
    component.form.patchValue(expectResult.channel);
    spectator.click(byTextContent('Submit', {
      exact: false,
      selector: 'button',
    }));
    expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledOnceWith(expectResult);
  });

  it('should delete when delete-button is clicked and confirmed', () => {
    spectator.inject(MatDialog).open.and.returnValue(newMatDialogRefMock(true));
    const expectResult: ChannelDetailsDialogResult = {
      action: 'delete',
    };
    spectator.click(byTextContent('Delete', {
      exact: false,
      selector: 'button',
    }));
    expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledOnceWith(expectResult);
  });
});
