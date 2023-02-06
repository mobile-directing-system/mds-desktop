import { Component, Input } from '@angular/core';
import { ChannelType } from '../../model/channel';

/**
 * Component for displaying {@link ChannelType} with icon and label.
 */
@Component({
  selector: 'app-channel-type-inline',
  templateUrl: './channel-type-inline.component.html',
  styleUrls: ['./channel-type-inline.component.scss'],
})
export class ChannelTypeInlineComponent {
  ChannelType = ChannelType;
  @Input() channelType?: ChannelType;
}
