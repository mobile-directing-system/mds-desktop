import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreModule } from 'src/app/core/core.module';
import { DialogData } from 'src/app/features/mailbox/incoming-messages-view/incoming-messages-view.component';
import { ReviewerModule } from '../../reviewer.module';

@Component({
  selector: 'app-select-channel-dialog',
  templateUrl: './select-channel-dialog.component.html',
  styleUrls: ['./select-channel-dialog.component.scss']
})
export class SelectChannelDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}
