import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { IntelCreationService } from '../../../core/services/intel-creation.service';
import { CreateIntel, IntelType } from '../../../core/model/intel';
import { Importance } from '../../../core/model/importance';
import { fakeAsync } from '@angular/core/testing';
import { CreateIntelConfirmationDialogComponent } from './create-intel-confirmation-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { IntelligenceModule } from '../intelligence.module';

function genFactoryOptions(): SpectatorRoutingOptions<CreateIntelConfirmationDialogComponent> {
  return {
    component: CreateIntelConfirmationDialogComponent,
    imports: [
      IntelligenceModule,
    ],
    mocks: [
      IntelCreationService,
      MatDialogRef
    ],
    detectChanges: false,
  };
}

describe('CreateIntelConfirmationDialogComponent', () => {
  let component: CreateIntelConfirmationDialogComponent;
  let spectator: SpectatorRouting<CreateIntelConfirmationDialogComponent>;
  const intelInCreationSideNav = createRoutingFactory(genFactoryOptions());

  beforeEach(async () => {
    spectator = intelInCreationSideNav();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cancel', () => {
    it('should close', () => {
      component.onCancelClick();
      expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledOnceWith();
    });
  });

  describe('fixture', () => {
    const sampleCreateIntel: CreateIntel[] = [{
      type: IntelType.AnalogRadioMessage,
      importance: Importance.Regular,
      initialDeliverTo: ['tire', 'gradual', 'move', 'drink'],
      content: {
        callsign: 'caution',
        content: 'pride',
        head: 'axe',
        channel: 'sort',
      },
      operation: 'fight',
    }, {
      type: IntelType.PlainTextMessage,
      importance: Importance.Urgent,
      initialDeliverTo: ['tire', 'gradual'],
      content: {
        text: 'director',
      },
      operation: 'pattern',
    }];
    beforeEach(fakeAsync(async () => {
      spectator.inject(IntelCreationService).intelInCreation = sampleCreateIntel;
      spectator.inject(IntelCreationService).getLoadedAddressBookEntryById.withArgs('tire').and.returnValue({
        id: 'tire',
        label: 'cat',
        description: 'afraid',
      });
      spectator.inject(IntelCreationService).getLoadedAddressBookEntryById.withArgs('gradual').and.returnValue({
        id: 'gradual',
        label: 'rise',
        description: 'ruin',
      });
      spectator.inject(IntelCreationService).getLoadedAddressBookEntryById.withArgs('move').and.returnValue({
        id: 'move',
        label: 'knife',
        description: 'ask',
      });
      spectator.inject(IntelCreationService).getLoadedAddressBookEntryById.withArgs('drink').and.returnValue({
        id: 'drink',
        label: 'few',
        description: 'dive',
      });
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
    }));

    it('should display intel types', () => {
      expect(spectator.query(byTextContent('Analog Radio Message', {
        exact: false,
        selector: 'p',
      }))).toBeVisible();
      expect(spectator.query(byTextContent('Plain Text Message', {
        exact: false,
        selector: 'p',
      }))).toBeVisible();
    });

    it('should display content', () => {
      expect(spectator.query(byTextContent('pride', {
        exact: false,
        selector: 'p',
      }))).toBeVisible();
      expect(spectator.query(byTextContent('director', {
        exact: false,
        selector: 'p',
      }))).toBeVisible();
    });

    it('should display address book entry labels accordingly', () => {
      expect(spectator.query(byTextContent('cat', {
        exact: false,
        selector: 'span',
      }))).toBeVisible();
      expect(spectator.query(byTextContent('rise', {
        exact: false,
        selector: 'span',
      }))).toBeVisible();
      expect(spectator.query(byTextContent('knife', {
        exact: false,
        selector: 'span',
      }))).toBeVisible();
      expect(spectator.query(byTextContent('few', {
        exact: false,
        selector: 'span',
      }))).toBeVisible();
    });

    it('should display confirm button', () => {
      expect(spectator.query(byTextContent('Confirm', {
        exact: false,
        selector: 'button',
      }))).toBeVisible();
    });
  });
});
