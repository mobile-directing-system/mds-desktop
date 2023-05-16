import { CreateIntelStepperComponent } from './create-intel-stepper.component';
import { createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { AnalogRadioMessageIntelContent, IntelType } from '../../../core/model/intel';
import { Importance } from '../../../core/model/importance';
import { fakeAsync, tick } from '@angular/core/testing';
import { IntelCreationService } from '../../../core/services/intel-creation.service';
import { FormControl } from '@angular/forms';
import { IntelligenceModule } from '../intelligence.module';
import {Subject} from "rxjs";

function genFactoryOptions(): SpectatorRoutingOptions<CreateIntelStepperComponent> {
  return {
    component: CreateIntelStepperComponent,
    imports: [
      IntelligenceModule,
    ],
    mocks: [
      IntelCreationService,
    ],
    detectChanges: false,
  };
}

describe('CreateIntelStepperComponent', () => {
  let component: CreateIntelStepperComponent;
  let spectator: SpectatorRouting<CreateIntelStepperComponent>;
  const createIntelStepperComponent = createRoutingFactory(genFactoryOptions());

  beforeEach(async () => {
    spectator = createIntelStepperComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addCreateIntel', () => {
    const sampleIntelType: IntelType = IntelType.AnalogRadioMessage;
    const sampleContent: AnalogRadioMessageIntelContent = {
      head: 'penny',
      callsign: 'sentence',
      content: 'lock',
      channel: 'chalk',
    };
    const sampleAddressBookEntryIds: string[] = [
      'rid',
      'overflow',
      'fit',
    ];
    const sampleImportance: Importance = Importance.Urgent;

    it('should call addCreateIntel if all values set', fakeAsync(() => {
      spectator.inject(IntelCreationService).selectedOperation = new FormControl<string | null>('tonight');
      component.intelTypeFormGroup.controls.intelType.setValue(sampleIntelType);
      component.contentFormGroup.controls.content.setValue(sampleContent.content);
      component.contentFormGroup.controls.channel.setValue(sampleContent.channel);
      component.contentFormGroup.controls.head.setValue(sampleContent.head);
      component.contentFormGroup.controls.callsign.setValue(sampleContent.callsign);
      component.importanceFormGroup.controls.importance.setValue(sampleImportance);
      component.deliverToFromGroup.controls.deliverTo.setValue(sampleAddressBookEntryIds);

      const intelCreationService = spectator.inject(IntelCreationService);
      intelCreationService.inIntelCreation = new Subject<Boolean>();
      const createSpy = intelCreationService.addCreateIntel.and.returnValue(void 0);

      tick();
      component.addCreateIntel();
      expect(createSpy).toHaveBeenCalled();
    }));
  });
});
