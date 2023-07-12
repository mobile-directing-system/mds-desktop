import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationTableLayout } from './operation-table-layout.component';
import { OperationTableView } from './operation-table-view/operation-table-view.component';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';
import { CreateIncidentComponent } from './create-incident/create-incident.component';



@NgModule({
  declarations: [
    OperationTableLayout,
    OperationTableView,
    CreateIncidentComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule
  ]
})
export class OperationTableModule { }
