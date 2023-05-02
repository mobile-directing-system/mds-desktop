import { Component, OnDestroy } from '@angular/core';
import { IntelType } from '../../../core/model/intel';
import { IntelCreationService } from '../../../core/services/intel-creation.service';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateIntelConfirmationDialogComponent,
} from '../create-intel-confirmation-dialog/create-intel-confirmation-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-intel-in-creation-side-nav',
  templateUrl: './intel-in-creation-side-nav.component.html',
  styleUrls: ['./intel-in-creation-side-nav.component.scss'],
})
export class IntelInCreationSideNavComponent implements OnDestroy{

  protected readonly IntelType = IntelType;

  s:Subscription [] = [];
  constructor(public intelCreationService: IntelCreationService, public dialog: MatDialog) {
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  /**
   * Opens the {@link CreateIntelConfirmationDialogComponent} to confirm
   */
  openConfirmDialog():void {
    const dialogRef = this.dialog.open(CreateIntelConfirmationDialogComponent);
    this.s.push(dialogRef.afterClosed().subscribe(value => {
      if(value) {
        this.sendIntelInCreation();
      }
    }));
  }

  sendIntelInCreation() {
    this.intelCreationService.sendIntelInCreation();
  }
}
