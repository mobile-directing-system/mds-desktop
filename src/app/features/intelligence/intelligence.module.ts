import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntelligenceLayoutComponent } from './intelligence-layout/intelligence-layout.component';
import { CoreModule } from '../../core/core.module';
import { IntelCreationComponent } from './intel-creation/intel-creation.component';
import { MatStepperModule } from '@angular/material/stepper';
import {
  CreateIntelConfirmationDialogComponent,
} from './create-intel-confirmation-dialog/create-intel-confirmation-dialog.component';
import { CreateIntelStepperComponent } from './create-intel-stepper/create-intel-stepper.component';
import { IntelInCreationSideNavComponent } from './intel-in-creation-side-nav/intel-in-creation-side-nav.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    IntelligenceLayoutComponent,
    IntelCreationComponent,
    CreateIntelConfirmationDialogComponent,
    CreateIntelStepperComponent,
    IntelInCreationSideNavComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    MatStepperModule,
    MatDialogModule,
  ],
})
export class IntelligenceModule { }
