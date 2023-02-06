import { Component, forwardRef, Input } from '@angular/core';
import { Channel, defaultChannel } from '../../../core/model/channel';
import { MatTableDataSource } from '@angular/material/table';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChannelDetailsDialog } from './channel-details-dialog/channel-details-dialog.component';
import { CustomControlValueAccessor } from '../../../core/util/form-fields';
import { MDSError, MDSErrorCode } from '../../../core/util/errors';

/**
 * Component for editing and displaying channels. Channels are provided and returned by providing a form control.
 */
@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChannelsComponent),
      multi: true,
    },
  ],
})
export class ChannelsComponent extends CustomControlValueAccessor<Channel[]> {
  columnsToDisplay = ['label', 'type', 'priority', 'minImportance', 'timeout'];
  /**
   * Datasource for the table that contains the channel list.
   */
  channelsDataSource = new MatTableDataSource<Channel>();

  /**
   * ID of the address book entry that is used for creating new channels for the correct entry.
   */
  @Input() entryId?: string;
  @Input() loading: boolean | null = false;
  @Input() disableCreate = false;

  constructor(private dialog: MatDialog) {
    super([]);
  }

  asChannel(c: Channel): Channel {
    return c;
  }

  override writeValue(channels: Channel[]): void {
    channels.sort((a, b) => b.priority - a.priority);
    super.writeValue(channels);
    this.channelsDataSource.data = channels;
  }

  /**
   * Opens the edit-/view-dialog for the given channel and processes the result action accordingly.
   * @param channel The channel to open.
   */
  openChannel(channel: Channel): void {
    const dialogRef = ChannelDetailsDialog.open(this.dialog, {
      create: false,
      channel: channel,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        // Canceled.
        return;
      }
      switch (result.action) {
        case 'delete':
          this.writeValue(this.value.filter(c => c.id !== channel.id));
          return;
        case 'submit':
          this.writeValue(this.value.map((c => {
            if (c.id === channel.id) {
              return result.channel;
            }
            return c;
          })));
          return;
        default:
          throw new MDSError(MDSErrorCode.AppError, 'unsupported action', { result });
      }
    });
  }

  /**
   * Opens the edit-dialog for the {@link defaultChannel} and adds it to the list of channels.
   */
  newChannel(): void {
    if (this.entryId === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'missing entry id in channels component');
    }
    const dialogRef = ChannelDetailsDialog.open(this.dialog, {
      create: true,
      channel: defaultChannel(this.entryId),
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        // Canceled.
        return;
      }
      if (result.action !== 'submit') {
        throw new MDSError(MDSErrorCode.AppError, 'unsupported action', { result });
      }
      this.writeValue([result.channel, ...this.value]);
    });
  }
}
