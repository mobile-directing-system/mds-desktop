import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { fakeAsync, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { Spectator, byTextContent, createComponentFactory } from '@ngneat/spectator';
import * as moment from 'moment';
import { CoreModule } from '../../../../core/core.module';
import { ChannelType, localizeChannelType } from '../../../../core/model/channel';
import { Importance } from '../../../../core/model/importance';
import { newMatDialogRefMock } from '../../../../core/testutil/testutil';
import { LogisticsModule } from '../../logistics.module';
import {
  ChannelDetailsDialog,
  ChannelDetailsDialogData,
  ChannelDetailsDialogResult,
} from './channel-details-dialog.component';

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
        isActive: true,
        label: 'valley',
        type: ChannelType.Radio,
        timeout: moment.duration({ hours: 1 }),
        priority: 40,
        minImportance: Importance.Strike,
        details: {
          name: 'channel 1',
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
    'channel type'
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
    const newChannelType: ChannelType = ChannelType.Radio;
    const searchOption = 'radio';

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

  describe('is-active form field', () => {
    let toggle: MatSlideToggleHarness;

    beforeEach(async () => {
      const toggleElem = spectator.query(byTextContent('Active', {
        exact: false,
        selector: 'mat-slide-toggle',
      }));
      if (!toggleElem) {
        fail('could not locate slide-toggle');
        return;
      }
      toggleElem.classList.add('TEST_SELECT');
      const tmpToggle = await harnessLoader.getHarnessOrNull(MatSlideToggleHarness.with({
        selector: '.TEST_SELECT',
      }));
      if (!tmpToggle) {
        fail('could not get toggle-harness');
        return;
      }
      toggle = tmpToggle;
    });

    it('should display value', async () => {
      const isChecked = await toggle.isChecked();
      expect(isChecked).toBeTrue();
    });

    it('should set is-active to true if checked', async () => {
      await toggle.check();
      expect(component.form.getRawValue().isActive).toBeTrue();
    });

    it('should set is-active to false if unchecked', async () => {
      await toggle.uncheck();
      expect(component.form.getRawValue().isActive).toBeFalse();
    });
  });

  describe('channel details', () => {
    const tests: {
      channelType: ChannelType;
      expectSelector: string;
    }[] = [
      {
        channelType: ChannelType.Radio,
        expectSelector: 'app-radio-channel-details',
      },
      {
        channelType: ChannelType.Email,
        expectSelector: 'app-mail-channel-details',
      },
      {
        channelType: ChannelType.Phone,
        expectSelector: 'app-phone-channel-details',
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
        isActive: true,
        label: 'jump',
        type: ChannelType.Radio,
        timeout: moment.duration({ seconds: 3 }),
        priority: 65,
        minImportance: Importance.None,
        details: {
          name: 'channel',
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
