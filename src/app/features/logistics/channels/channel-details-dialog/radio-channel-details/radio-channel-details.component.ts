import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { CustomControlValueAccessor } from '../../../../../core/util/form-fields';
import { compareRadioChannelDetails, predefinedRadioChannelDetails, RadioChannelDetails } from '../../../../../core/model/channel';
import { FormBuilder, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Component for editing {@link RadioChannelDetails}.
 */
@Component({
  selector: 'app-radio-channel-details',
  templateUrl: './radio-channel-details.component.html',
  styleUrls: ['./radio-channel-details.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioChannelDetailsComponent),
      multi: true,
    },
  ],
})
export class RadioChannelDetailsComponent extends CustomControlValueAccessor<RadioChannelDetails> implements OnInit, OnDestroy {

  readonly compareDetails = compareRadioChannelDetails;
  readonly selectableChannelDetails: RadioChannelDetails[] = predefinedRadioChannelDetails();

  radioDetailsControl = this.fb.nonNullable.control<RadioChannelDetails>(predefinedRadioChannelDetails()[0], [Validators.required]);

  private s: Subscription[] = [];

  constructor(private fb: FormBuilder) {
    super(predefinedRadioChannelDetails()[0]);
  }

  ngOnInit(): void {
    this.s.push(this.radioDetailsControl.valueChanges.subscribe(_ => {
      this.value = {
        ...this.radioDetailsControl.value
      }
      this.notifyOnChange();
    }));
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  override writeValue(details: RadioChannelDetails) {
    super.writeValue(details);
    this.radioDetailsControl.patchValue({
      ...details
    })
  }
}
