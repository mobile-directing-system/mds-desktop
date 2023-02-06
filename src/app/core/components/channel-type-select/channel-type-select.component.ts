import { Component, ElementRef, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ChannelType, localizeChannelType } from '../../model/channel';
import { CustomMatFormField } from '../../util/form-fields';
import { MatFormFieldControl } from '@angular/material/form-field';

/**
 * Component for picking {@link ChannelType} via select.
 */
@Component({
  selector: 'app-channel-type-select',
  templateUrl: './channel-type-select.component.html',
  styleUrls: ['./channel-type-select.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: ChannelTypeSelectComponent,
    },
  ],
})
export class ChannelTypeSelectComponent extends CustomMatFormField<ChannelType> implements ControlValueAccessor, MatFormFieldControl<ChannelType> {
  ChannelType = ChannelType;
  localizeChannelType = localizeChannelType;
  availableChannelTypes: ChannelType[] = Object.values(ChannelType);

  constructor(_elementRef: ElementRef<HTMLElement>, @Optional() @Self() ngControl: NgControl) {
    super({
      controlType: 'mds-desktop-core-components-channel-type-select-component',
      defaultValue: ChannelType.Radio,
      elementRef: _elementRef,
      ngControl: ngControl,
    });
  }

  selectChannelType(channelType: ChannelType): void {
    super.value = channelType;
    super.notifyOnChange();
  }

  get empty(): boolean {
    return false;
  }

  isErrorState(): boolean {
    return false;
  }
}
