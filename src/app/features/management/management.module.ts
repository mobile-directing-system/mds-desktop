import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageLayoutComponent } from './manage-layout/manage-layout.component';
import { CoreModule } from '../../core/core.module';
import { AngularMaterialModule } from '../../core/util/angular-material.module';
import { RouterOutlet } from '@angular/router';
import { UserManagementView } from './user-management-view/user-management-view.component';
import { GroupManagementView } from './group-management-view/group-management-view.component';
import { OperationManagementView } from './operation-management-view/operation-management-view.component';


@NgModule({
  declarations: [
    ManageLayoutComponent,
    UserManagementView,
    GroupManagementView,
    OperationManagementView,
  ],
  imports: [
    CoreModule,
    CommonModule,
    AngularMaterialModule,
    RouterOutlet,
  ],
})
export class ManagementModule {
}
