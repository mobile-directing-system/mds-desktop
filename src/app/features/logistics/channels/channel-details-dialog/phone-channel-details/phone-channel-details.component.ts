import { ChangeDetectorRef, Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { AbstractControl, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PhoneChannelDetails } from 'src/app/core/model/channel';
import { CustomControlValueAccessor } from 'src/app/core/util/form-fields';

@Component({
  selector: 'app-phone-channel-details',
  templateUrl: './phone-channel-details.component.html',
  styleUrls: ['./phone-channel-details.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneChannelDetailsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneChannelDetailsComponent),
      multi: true
    }
  ]
})
export class PhoneChannelDetailsComponent extends CustomControlValueAccessor<PhoneChannelDetails> implements Validator, OnDestroy {

  phoneControl = this.fb.nonNullable.control<string>("", [Validators.required]);

  private s: Subscription[] = [];

  constructor(private fb: FormBuilder) {
    super({phoneNumber: ""});
  }

  ngOnInit(): void {
    this.s.push(this.phoneControl.valueChanges.subscribe(_ => {
      this.value = {
        phoneNumber: this.phoneControl.value
      };
      this.notifyOnChange();
    }));
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if(this.phoneControl.valid) return null;
    return this.phoneControl.errors;
  }

  override writeValue(details: PhoneChannelDetails) {
    super.writeValue(details);
    this.phoneControl.setValue(details.phoneNumber);
  }
}
