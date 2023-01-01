import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageLayoutComponent } from './manage-layout/manage-layout.component';
import { CoreModule } from '../../core/core.module';
import { AngularMaterialModule } from '../../core/util/angular-material.module';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { UserManagementView } from './user-management-view/user-management-view.component';
import { GroupManagementView } from './group-management-view/group-management-view.component';
import { OperationManagementView } from './operation-management-view/operation-management-view.component';
import { CreateUserView } from './user-management-view/create-user-view/create-user-view.component';
import { EditUserView } from './user-management-view/edit-user-view/edit-user-view.component';
import {
  UpdateUserPasswordView,
} from './user-management-view/update-user-password-view/update-user-password-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateGroupView } from './group-management-view/create-group-view/create-group-view.component';
import { EditGroupView } from './group-management-view/edit-group-view/edit-group-view.component';


@NgModule({
  declarations: [
    ManageLayoutComponent,
    UserManagementView,
    GroupManagementView,
    OperationManagementView,
    CreateGroupView,
    EditGroupView,
    CreateUserView,
    EditUserView,
    UpdateUserPasswordView,
  ],
  imports: [
    CoreModule,
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLinkWithHref,
  ],
})
export class ManagementModule {
}
