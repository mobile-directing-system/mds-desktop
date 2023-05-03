import { IntelType } from 'src/app/core/model/intel';
import { Component } from '@angular/core';
import { IntelCreationService } from '../../../core/services/intel-creation.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-create-intel-confirmation-dialog',
  templateUrl: './create-intel-confirmation-dialog.component.html',
  styleUrls: ['./create-intel-confirmation-dialog.component.scss']
})
export class CreateIntelConfirmationDialogComponent{
  protected readonly IntelType = IntelType;

  constructor(public dialogRef: MatDialogRef<CreateIntelConfirmationDialogComponent>, public intelCreationService: IntelCreationService) {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
