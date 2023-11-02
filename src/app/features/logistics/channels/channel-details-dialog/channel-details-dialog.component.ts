import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Channel, ChannelBase, ChannelType } from '../../../../core/model/channel';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ValidatorDurationMin, ValidatorDurationRequired } from '../../../../core/util/duration';
import * as uuid from 'uuid';

/**
 * Dialog data for {@link ChannelDetailsDialog}.
 */
export interface ChannelDetailsDialogData {
  create: boolean;
  channel: Channel;
}

/**
 * Dialog result of {@link ChannelDetailsDialog}.
 */
export type ChannelDetailsDialogResult = {
  action: 'submit',
  channel: Channel,
} | {
  action: 'delete'
}

/**
 * Dialog for setting channel meta-data as well as details.
 */
@Component({
  selector: 'app-channel-details-dialog',
  templateUrl: './channel-details-dialog.component.html',
  styleUrls: ['./channel-details-dialog.component.scss'],
})
export class ChannelDetailsDialog {
  ChannelType = ChannelType;

  form = this.fb.group({
    id: this.data.channel.id,
    entry: this.data.channel.entry,
    isActive: this.fb.nonNullable.control<boolean>(this.data.channel.isActive),
    label: this.fb.nonNullable.control<string>(this.data.channel.label, Validators.required),
    type: this.fb.nonNullable.control<ChannelType>(this.data.channel.type),
    details: this.fb.nonNullable.control<object>(this.data.channel.details),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ChannelDetailsDialogData, private dialogRef: MatDialogRef<ChannelDetailsDialog>,
              private fb: FormBuilder) {
  }

  static open(dialog: MatDialog, data: ChannelDetailsDialogData): MatDialogRef<ChannelDetailsDialog, ChannelDetailsDialogResult | undefined> {
    return dialog.open<ChannelDetailsDialog, ChannelDetailsDialogData, ChannelDetailsDialogResult | undefined>(ChannelDetailsDialog, {
      data: data,
    });
  }

  /**
   * Closes the dialog with the given return value.
   * @param result The value to return.
   */
  close(result: ChannelDetailsDialogResult | undefined): void {
    this.dialogRef.close(result);
  }

  closeDelete(): void {
    this.close({ action: 'delete' });
  }

  closeSubmit(): void {
    const v = this.form.getRawValue();
    const channel: ChannelBase = {
      id: v.id ?? uuid.v4(),
      entry: v.entry!,
      isActive: v.isActive,
      label: v.label,
      type: v.type,
      minImportance: 0,
      priority: 0,
      timeout: moment.duration(0),
      details: v.details,
    };
    this.close({
      action: 'submit',
      channel: channel as Channel,
    });
  }
}
