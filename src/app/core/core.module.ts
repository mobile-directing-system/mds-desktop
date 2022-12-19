import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingLayoutComponent } from './components/landing-layout/landing-layout.component';
import { RouterModule } from '@angular/router';
import { LogoComponent } from './components/logo/logo.component';
import { LogoFullComponent } from './components/logo-full/logo-full.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { AngularMaterialModule } from './util/angular-material.module';
import { ShowLoadingOverlayDirective } from './directives/show-loading-overlay.directive';
import { ViewComponent } from './components/view/view.component';
import { SideNavItemComponent } from './components/sidenav/side-nav-item/side-nav-item.component';
import { SideNavTitleComponent } from './components/sidenav/side-nav-title/side-nav-title.component';
import { ProfileComponent } from './components/home-layout/profile/profile.component';
import { PaginatedListComponent } from './components/paginated-list/paginated-list.component';
import { HeadingHintComponent } from './components/heading-hint/heading-hint.component';
import { ListActionBarComponent } from './components/list-action-bar/list-action-bar.component';
import { QuickSearchComponent } from './components/quick-search/quick-search.component';
import {
  SearchableMultiChipEntityInputComponent,
} from './components/searchable-multi-chip-input-field/searchable-multi-chip-entity-input.component';
import { LoadingDotsComponent } from './components/loading-dots/loading-dots.component';
import { ErrorsComponent } from './components/errors/errors.component';


@NgModule({
  declarations: [
    LandingLayoutComponent,
    LogoComponent,
    LogoFullComponent,
    HomeLayoutComponent,
    LoadingOverlayComponent,
    ShowLoadingOverlayDirective,
    ViewComponent,
    SideNavItemComponent,
    SideNavTitleComponent,
    ProfileComponent,
    PaginatedListComponent,
    HeadingHintComponent,
    ListActionBarComponent,
    QuickSearchComponent,
    SearchableMultiChipEntityInputComponent,
    LoadingDotsComponent,
    ErrorsComponent,
  ],
  exports: [
    LogoComponent,
    LogoFullComponent,
    FormsModule,
    ReactiveFormsModule,
    ShowLoadingOverlayDirective,
    ViewComponent,
    SideNavItemComponent,
    SideNavTitleComponent,
    PaginatedListComponent,
    HeadingHintComponent,
    ListActionBarComponent,
    QuickSearchComponent,
    LoadingOverlayComponent,
    SearchableMultiChipEntityInputComponent,
    ErrorsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
})
export class CoreModule {
}
