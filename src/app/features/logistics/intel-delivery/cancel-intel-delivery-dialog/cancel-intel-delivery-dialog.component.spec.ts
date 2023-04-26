import {
  CancelIntelDeliveryDialog,
  CancelIntelDeliveryDialogData,
  CancelIntelDeliveryDialogResult,
} from './cancel-intel-delivery-dialog.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  DetailedOpenIntelDelivery,
  ManualIntelDeliveryService,
} from '../../../../core/services/manual-intel-delivery.service';
import { ManualIntelDeliveryMockService } from '../../../../core/services/manual-intel-delivery-mock.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreModule } from '../../../../core/core.module';
import { IntelDeliveryModule } from '../intel-delivery.module';
import { Importance } from '../../../../core/model/importance';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';

describe('CancelIntelDeliveryDialogComponent', () => {
  let spectator: Spectator<CancelIntelDeliveryDialog>;
  let component: CancelIntelDeliveryDialog;
  const dialogData: CancelIntelDeliveryDialogData = {
    deliveryId: 'make',
  };
  const selected: DetailedOpenIntelDelivery = {
    delivery: {
      delivery: {
        id: dialogData.deliveryId,
        intel: 'homemade',
        to: 'bleed',
        note: 'blood',
      },
      intel: {
        id: 'homemade',
        operation: 'stuff',
        importance: Importance.Regular,
        createdAt: new Date(Date.parse('2023-04-24T13:15:20Z')),
        createdBy: 'count',
        isValid: true,
      },
    },
  };

  let manualIntelDeliveryService = new ManualIntelDeliveryMockService();
  const createComponent = createComponentFactory({
    component: CancelIntelDeliveryDialog,
    imports: [
      CoreModule,
      IntelDeliveryModule,
    ],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: dialogData,
      },
    ],
    mocks: [MatDialogRef],
    detectChanges: false,
  });
  let hLoader: HarnessLoader;

  beforeEach(async () => {
    manualIntelDeliveryService = new ManualIntelDeliveryMockService();
    spectator = createComponent({
      providers: [
        {
          provide: ManualIntelDeliveryService,
          useValue: manualIntelDeliveryService,
        },
      ],
    });
    component = spectator.component;
    spectator.detectChanges();
    manualIntelDeliveryService.selected.next(selected);
    await spectator.fixture.whenStable();
    hLoader = TestbedHarnessEnvironment.loader(spectator.fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fixture', () => {
    beforeEach(async () => {
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
    });

    describe('confirm-button', () => {
      const selector = byTextContent('Confirm', {
        exact: false,
        selector: 'button',
      });

      it('should display confirm button', () => {
        expect(spectator.query(selector)).toBeVisible();
      });

      it('should allow confirm if selection did not change', () => {
        expect(spectator.query(selector)).not.toBeDisabled();
      });

      it('should disallow confirm if selection changed', async () => {
        const changed = JSON.parse(JSON.stringify(selected));
        changed.delivery.delivery.id = 'eat';

        manualIntelDeliveryService.selected.next(changed);
        await spectator.fixture.whenStable();
        spectator.detectChanges();
        await spectator.fixture.whenStable();

        expect(spectator.query(selector)).toBeDisabled();
      });

      it('should close the dialog with confirm', () => {
        spectator.click(selector);
        const expectResult: CancelIntelDeliveryDialogResult = {
          action: 'submit',
          deliveryToCancel: selected.delivery.delivery.id,
          success: false,
          note: undefined,
        };
        expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledOnceWith(expectResult);
      });

    });

    it('should display information regarding delivery attempts', () => {
      expect(spectator.query(byTextContent('all active delivery attempts', {
        exact: false,
        selector: 'div',
      }))).toBeVisible();
    });

    describe('success-toggle', () => {
      let toggle: MatSlideToggleHarness;

      beforeEach(async () => {
        toggle = await hLoader.getHarness(MatSlideToggleHarness.with({
          label: 'Mark delivery as successful',
        }));
      });

      it('should display', () => {
        expect(toggle).toBeTruthy();
      });

      it('should mark the delivery as successful if set to true', async () => {
        await toggle.check();
        await spectator.fixture.whenStable();

        expect(component.form.getRawValue().success).toBeTrue();
      });

      it('should mark the delivery as unsuccessful if clicked twice', async () => {
        await toggle.uncheck();
        await spectator.fixture.whenStable();

        expect(component.form.getRawValue().success).toBeFalse();
      });
    });

    describe('note', () => {
      let noteSelector = 'textarea';

      it('should display', () => {
        expect(spectator.query(noteSelector)).toBeVisible();
      });

      it('should set the note', async () => {
        const note = 'appoint';

        spectator.typeInElement(note, noteSelector);
        await spectator.fixture.whenStable();

        expect(component.form.getRawValue().note).toEqual(note);
      });
    });

    describe('cancel-button', () => {
      const selector = byTextContent(`Don't cancel`, {
        exact: false,
        selector: 'button',
      });

      it('should display', () => {
        expect(spectator.query(selector)).toBeVisible();
      });

      it('should be enable', () => {
        expect(spectator.query(selector)).not.toBeDisabled();
      });

      it('should close the dialog without confirmation', () => {
        spectator.click(selector);
        expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledOnceWith();
      });
    });
  });
});
