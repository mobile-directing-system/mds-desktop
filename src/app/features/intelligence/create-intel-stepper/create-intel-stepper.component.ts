import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AnalogRadioMessageIntelContent,
  CreateIntel,
  IntelType,
  PlaintextMessageIntelContent,
} from 'src/app/core/model/intel';
import { MatStepper } from '@angular/material/stepper';
import { FormBuilder, Validators } from '@angular/forms';
import { IntelCreationService } from '../../../core/services/intel-creation.service';
import { Observable, Subscription } from 'rxjs';
import { Importance } from 'src/app/core/model/importance';
import { AddressBookEntry } from '../../../core/model/address-book-entry';


@Component({
  selector: 'app-create-intel-stepper',
  templateUrl: './create-intel-stepper.component.html',
  styleUrls: ['./create-intel-stepper.component.scss'],
})
export class CreateIntelStepperComponent implements OnInit, OnDestroy {

  /**
   * {@link IntelType} for the {@link CreateIntel} to be created.
   */
  @Input() intelType?: IntelType;

  /**
   * {@link AnalogRadioMessageIntelContent} of the {@link Intel.content}
   * if the {@link CreateIntel} to be created is of type {@link IntelType.AnalogRadioMessage}.
   */
  @Input() contentAnalogRadioMessageIntel?: AnalogRadioMessageIntelContent;

  /**
   * {@link PlaintextMessageIntelContent} of the {@link Intel.content}
   * if the {@link CreateIntel} to be created is of type {@link IntelType.PlainTextMessage}.
   */
  @Input() contentPlainTextMessageIntel?: PlaintextMessageIntelContent;

  /**
   * List of {@link AddressBookEntry.Id}s the {@link CreateIntel} is to be delivered to.
   */
  @Input() deliverTo?: string[];

  /**
   * {@link Importance} of the {@link CreateIntel} to be created.
   */
  @Input() importance?: Importance;

  @ViewChild('stepper') private stepper!: MatStepper;

  protected readonly IntelType = IntelType;

  protected readonly Importance = Importance;

  s: Subscription[] = [];

  intelTypeFormGroup = this.fb.nonNullable.group({
    intelType: this.fb.nonNullable.control<IntelType | null>(this.intelType ? this.intelType : null, Validators.required),
  });

  contentFormGroup = this.fb.nonNullable.group({
    channel: this.fb.nonNullable.control<string>((this.contentAnalogRadioMessageIntel
      && this.contentAnalogRadioMessageIntel.channel) ? this.contentAnalogRadioMessageIntel.channel : ''),
    callsign: this.fb.nonNullable.control<string>((this.contentAnalogRadioMessageIntel
      && this.contentAnalogRadioMessageIntel.callsign) ? this.contentAnalogRadioMessageIntel.callsign : ''),
    head: this.fb.nonNullable.control<string>((this.contentAnalogRadioMessageIntel
      && this.contentAnalogRadioMessageIntel.head) ? this.contentAnalogRadioMessageIntel.head : ''),
    content: this.fb.nonNullable.control<string>((this.contentAnalogRadioMessageIntel
      && this.contentAnalogRadioMessageIntel.content) ? this.contentAnalogRadioMessageIntel.content : ''),
    text: this.fb.nonNullable.control<string>((this.contentPlainTextMessageIntel
      && this.contentPlainTextMessageIntel.text) ? this.contentPlainTextMessageIntel.text : ''),
  });

  deliverToFromGroup = this.fb.nonNullable.group({
    deliverTo: this.fb.nonNullable.control<string[]>(this.deliverTo ? this.deliverTo : [], Validators.required),
  });

  importanceFormGroup = this.fb.nonNullable.group({
    importance: this.fb.nonNullable.control<Importance | null>(this.importance ? this.importance : null, Validators.required),
  });

  constructor(private intelCreationService: IntelCreationService, private fb: FormBuilder) {
  }


  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.intelTypeFormGroup.controls.intelType.valueChanges.subscribe(newValue => {
      if (!newValue) {
        return;
      } else if (newValue === IntelType.PlainTextMessage) {
        this.contentFormGroup.controls.text.addValidators(Validators.required);
        this.contentFormGroup.controls.content.removeValidators(Validators.required);
        this.contentFormGroup.controls.head.removeValidators(Validators.required);
        this.contentFormGroup.controls.callsign.removeValidators(Validators.required);
        this.contentFormGroup.controls.channel.removeValidators(Validators.required);
      } else if (newValue === IntelType.AnalogRadioMessage) {
        this.contentFormGroup.controls.text.removeValidators(Validators.required);
        this.contentFormGroup.controls.content.addValidators(Validators.required);
        this.contentFormGroup.controls.head.addValidators(Validators.required);
        this.contentFormGroup.controls.callsign.addValidators(Validators.required);
        this.contentFormGroup.controls.channel.addValidators(Validators.required);
      }
      this.updateFromValidators();
    }));
  }

  asAddressBookEntry(entity: AddressBookEntry): AddressBookEntry {
    return entity;
  }

  getAddressBookEntryById(entryId: string): Observable<AddressBookEntry> {
    return this.intelCreationService.getAddressBookEntryById(entryId);
  }

  searchAddressBookEntry(query: string): Observable<AddressBookEntry[]> {
    return this.intelCreationService.searchAddressBookEntry(query);
  }

  /**
   * Adds the {@link CreateIntel} to {@link IntelCreationService}s list, based on the input of the form values.
   */
  addCreateIntel() {
    if (!this.intelCreationService.selectedOperation.getRawValue() || !this.intelTypeFormGroup.controls.intelType.getRawValue() || !this.importanceFormGroup.controls.importance.getRawValue()) {
      return;
    }
    let createIntelToAdd: CreateIntel;
    if (this.intelTypeFormGroup.controls.intelType.getRawValue() && this.intelTypeFormGroup.controls.intelType.getRawValue() === IntelType.PlainTextMessage) {
      createIntelToAdd = {
        type: IntelType.PlainTextMessage,
        operation: this.intelCreationService.selectedOperation.getRawValue()!,
        content: {
          text: this.contentFormGroup.controls.text.getRawValue(),
        },
        importance: this.importanceFormGroup.controls.importance.getRawValue()!.valueOf(),
        initialDeliverTo: this.deliverToFromGroup.controls.deliverTo.getRawValue(),
      };
    } else if (this.intelTypeFormGroup.controls.intelType.getRawValue() === IntelType.AnalogRadioMessage) {
      createIntelToAdd = {
        type: IntelType.AnalogRadioMessage,
        operation: this.intelCreationService.selectedOperation.getRawValue()!,
        content: {
          callsign: this.contentFormGroup.controls.callsign.getRawValue(),
          head: this.contentFormGroup.controls.head.getRawValue(),
          content: this.contentFormGroup.controls.content.getRawValue(),
          channel: this.contentFormGroup.controls.channel.getRawValue(),
        },
        importance: this.importanceFormGroup.controls.importance.getRawValue()!.valueOf(),
        initialDeliverTo: this.deliverToFromGroup.controls.deliverTo.getRawValue(),
      };
    } else {
      return;
    }
    this.intelCreationService.addCreateIntel(createIntelToAdd);
    this.intelCreationService.inIntelCreation = false;
  }

  private updateFromValidators(): void {
    this.contentFormGroup.controls.text.updateValueAndValidity();
    this.contentFormGroup.controls.content.updateValueAndValidity();
    this.contentFormGroup.controls.head.updateValueAndValidity();
    this.contentFormGroup.controls.callsign.updateValueAndValidity();
    this.contentFormGroup.controls.channel.updateValueAndValidity();
  }
}
