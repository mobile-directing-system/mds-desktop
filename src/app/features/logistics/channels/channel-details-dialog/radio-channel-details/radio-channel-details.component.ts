import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { CustomControlValueAccessor } from '../../../../../core/util/form-fields';
import { RadioChannelDetails } from '../../../../../core/model/channel';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  form = this.fb.group({
    info: this.fb.nonNullable.control<string>(''),
  });

  private s: Subscription[] = [];

  constructor(private fb: FormBuilder) {
    super({ info: '' });
  }

  ngOnInit(): void {
    this.s.push(this.form.valueChanges.subscribe(_ => {
      this.value = {
        info: this.form.getRawValue().info,
      };
      this.notifyOnChange();
    }));
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  override writeValue(details: RadioChannelDetails) {
    super.writeValue(details);
    this.form.patchValue({
      info: details.info,
    });
  }
}
