import { Component, Inject } from '@angular/core';
import { Channel, ChannelBase, ChannelType } from '../../../../core/model/channel';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ValidatorDurationMin, ValidatorDurationRequired } from '../../../../core/util/duration';

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
    label: this.fb.nonNullable.control<string>(this.data.channel.label, Validators.required),
    type: this.fb.nonNullable.control<ChannelType>(this.data.channel.type),
    priority: this.fb.nonNullable.control<number>(this.data.channel.priority),
    minImportance: this.fb.nonNullable.control<number>(this.data.channel.minImportance),
    timeout: this.fb.nonNullable.control<moment.Duration>(this.data.channel.timeout, [ValidatorDurationRequired, ValidatorDurationMin(moment.duration())]),
    details: this.fb.nonNullable.control<object>(this.data.channel.details, Validators.required),
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
      id: v.id ?? undefined,
      entry: v.entry!,
      label: v.label,
      type: v.type,
      minImportance: v.minImportance,
      priority: v.priority,
      timeout: v.timeout,
      details: v.details,
    };
    this.close({
      action: 'submit',
      channel: channel as Channel,
    });
  }
}
