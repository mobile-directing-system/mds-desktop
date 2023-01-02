import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginView } from './login-view/login-view.component';
import { AngularMaterialModule } from '../../core/util/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { SetServerURLView } from './set-server-url-view/set-server-url-view.component';
import { LogoutView } from './logout-view/logout-view.component';


@NgModule({
  declarations: [
    LoginView,
    SetServerURLView,
    LogoutView,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    CoreModule,
  ],
})
export class AuthModule {
}
