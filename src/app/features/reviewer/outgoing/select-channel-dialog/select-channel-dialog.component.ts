import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/app/core/model/channel';
import { Participant } from 'src/app/core/model/message';
import { ChannelService } from 'src/app/core/services/channel.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { MessageRow } from '../outgoing-messages-view/outgoing-messages-view.component';

@Component({
  selector: 'app-select-channel-dialog',
  templateUrl: './select-channel-dialog.component.html',
  styleUrls: ['./select-channel-dialog.component.scss']
})
export class SelectChannelDialog implements OnInit {

  channelColumns: string[] = ["label", "channelType", "info"];
  selectableChannels: Channel[] = [];
  selectedChannel: Channel | null = null;
  showMissingChannelError: boolean = false;


  constructor(@Inject(MAT_DIALOG_DATA) public data: MessageRow, private channelService: ChannelService,
    private dialogRef: MatDialogRef<SelectChannelDialog>, private messageService: MessageService) {}

  ngOnInit(): void {
    if(this.data.recipientType === Participant.AddressBookEntry) {
      this.channelService.getChannelsByAddressBookEntry(this.data.recipientId).subscribe(channels => {
        this.selectableChannels = channels;
      });
    }
  }

  /**
   * Is called when a channel was selected in the channel table
   */
  channelSelected(channel: Channel) {
    this.selectedChannel = channel;
    this.showMissingChannelError = false;
  }

  /**
   * Is called when submit button was clicked
   */
  submitClicked() {
    if(!this.selectedChannel) {
      this.showMissingChannelError = true;
      return;
    }

    this.dialogRef.close(this.selectedChannel);
  }

}
