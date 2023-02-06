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
import { SearchableEntityInputComponent } from './components/searchable-entity-input/searchable-entity-input.component';
import { ErrorsComponent } from './components/errors/errors.component';
import { LocalPaginatedListComponent } from './components/local-paginated-list/local-paginated-list.component';
import { ShowLoadingDotsDirective } from './directives/show-loading-dots.directive';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';
import { MtxMomentDatetimeModule } from '@ng-matero/extensions-moment-adapter';
import { MissingPermissionsView } from './components/missing-permissions-view/missing-permissions-view.component';
import { DurationPipe } from './pipes/duration.pipe';
import { ImportanceInlineComponent } from './components/importance-inline/importance-inline.component';
import { ChannelTypeInlineComponent } from './components/channel-type-inline/channel-type-inline.component';
import { DeleteConfirmButtonComponent } from './components/delete-confirm-button/delete-confirm-button.component';
import { DeleteConfirmDialog } from './components/delete-confirm-dialog/delete-confirm-dialog.component';
import { ImportanceSelectComponent } from './components/importance-select/importance-select.component';
import { ChannelTypeSelectComponent } from './components/channel-type-select/channel-type-select.component';
import { DurationPickerComponent } from './components/duration-picker/duration-picker.component';


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
    SearchableEntityInputComponent,
    ErrorsComponent,
    LocalPaginatedListComponent,
    ShowLoadingDotsDirective,
    MissingPermissionsView,
    DurationPipe,
    ImportanceInlineComponent,
    ChannelTypeInlineComponent,
    DeleteConfirmButtonComponent,
    DeleteConfirmDialog,
    ChannelTypeSelectComponent,
    ImportanceSelectComponent,
    DurationPickerComponent,
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
    SearchableEntityInputComponent,
    ErrorsComponent,
    LocalPaginatedListComponent,
    ShowLoadingDotsDirective,
    LoadingDotsComponent,
    DurationPipe,
    ImportanceInlineComponent,
    ChannelTypeInlineComponent,
    DeleteConfirmButtonComponent,
    ChannelTypeSelectComponent,
    ImportanceSelectComponent,
    DurationPickerComponent,
    AngularMaterialModule,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    // Datetime picker (do not change order!).
    MtxDatetimepickerModule,
    MtxNativeDatetimeModule,
    MtxMomentDatetimeModule,
  ],
})
export class CoreModule {
}
