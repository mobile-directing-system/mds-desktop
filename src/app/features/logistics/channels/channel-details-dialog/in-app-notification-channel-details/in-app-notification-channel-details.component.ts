import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomControlValueAccessor } from '../../../../../core/util/form-fields';
import { InAppNotificationChannelDetails } from '../../../../../core/model/channel';

/**
 * Component for editing {@link InAppNotificationChannelDetails}.
 */
@Component({
  selector: 'app-in-app-notification-channel-details',
  templateUrl: './in-app-notification-channel-details.component.html',
  styleUrls: ['./in-app-notification-channel-details.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InAppNotificationChannelDetailsComponent),
      multi: true,
    },
  ],
})
export class InAppNotificationChannelDetailsComponent extends CustomControlValueAccessor<InAppNotificationChannelDetails> {
  constructor() {
    super({});
  }
}
