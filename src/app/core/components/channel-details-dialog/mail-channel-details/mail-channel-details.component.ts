import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { AbstractControl, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MailChannelDetails } from 'src/app/core/model/channel';
import { CustomControlValueAccessor } from 'src/app/core/util/form-fields';

@Component({
  selector: 'app-mail-channel-details',
  templateUrl: './mail-channel-details.component.html',
  styleUrls: ['./mail-channel-details.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MailChannelDetailsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MailChannelDetailsComponent),
      multi: true
    },
  ]
})
export class MailChannelDetailsComponent extends CustomControlValueAccessor<MailChannelDetails> implements OnInit, OnDestroy, Validator {

  mailControl = this.fb.nonNullable.control<string>('', [Validators.email, Validators.required]);

  private s: Subscription[] = [];

  constructor(private fb: FormBuilder) {
    super({email: ""});
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if(this.mailControl.valid) return null;

    return this.mailControl.errors;
  }

  ngOnInit(): void {
    this.s.push(this.mailControl.valueChanges.subscribe(_ => {
      this.value = {
        email: this.mailControl.value,
      };
      this.notifyOnChange();
    }));
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  override writeValue(details: MailChannelDetails) {
    super.writeValue(details);
    this.mailControl.setValue(details.email);
  }

}
