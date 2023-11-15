import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { MtxMomentDatetimeModule } from '@ng-matero/extensions-moment-adapter';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { ChannelTypeInlineComponent } from './components/channel-type-inline/channel-type-inline.component';
import { ChannelTypeSelectComponent } from './components/channel-type-select/channel-type-select.component';
import { DeleteConfirmButtonComponent } from './components/delete-confirm-button/delete-confirm-button.component';
import { DeleteConfirmDialog } from './components/delete-confirm-dialog/delete-confirm-dialog.component';
import { DurationPickerComponent } from './components/duration-picker/duration-picker.component';
import { ErrorsComponent } from './components/errors/errors.component';
import { HeadingHintComponent } from './components/heading-hint/heading-hint.component';
import { HiddenComponent } from './components/hidden/hidden.component';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { ProfileComponent } from './components/home-layout/profile/profile.component';
import {
  SelectWorkspaceOperationDialog,
} from './components/home-layout/workspace-operation-selector/select-workspace-operation-dialog/select-workspace-operation-dialog.component';
import {
  WorkspaceOperationSelectorComponent,
} from './components/home-layout/workspace-operation-selector/workspace-operation-selector.component';
import { ImportanceInlineComponent } from './components/importance-inline/importance-inline.component';
import { ImportanceSelectComponent } from './components/importance-select/importance-select.component';
import {
  AnalogRadioMessageSummaryComponent,
} from './components/intel-summary/analog-radio-message-summary/analog-radio-message-summary.component';
import { IntelSummaryComponent } from './components/intel-summary/intel-summary.component';
import {
  PlainTextMessageSummaryComponent,
} from './components/intel-summary/plain-text-message-summary/plain-text-message-summary.component';
import { IntelTypeInlineComponent } from './components/intel-type-inline/intel-type-inline.component';
import { KeyInfoBarComponent } from "./components/key-info-bar/key-info-bar.component";
import { LandingLayoutComponent } from './components/landing-layout/landing-layout.component';
import { ListActionBarComponent } from './components/list-action-bar/list-action-bar.component';
import { LoadingDotsComponent } from './components/loading-dots/loading-dots.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { LocalPaginatedListComponent } from './components/local-paginated-list/local-paginated-list.component';
import { LogoFullComponent } from './components/logo-full/logo-full.component';
import { LogoComponent } from './components/logo/logo.component';
import { MissingPermissionsView } from './components/missing-permissions-view/missing-permissions-view.component';
import { PaginatedListComponent } from './components/paginated-list/paginated-list.component';
import { QuickSearchComponent } from './components/quick-search/quick-search.component';
import { SearchableEntityInputComponent } from './components/searchable-entity-input/searchable-entity-input.component';
import {
  SearchableMultiChipEntityInputComponent,
} from './components/searchable-multi-chip-input-field/searchable-multi-chip-entity-input.component';
import { SideNavItemComponent } from './components/sidenav/side-nav-item/side-nav-item.component';
import { SideNavTitleComponent } from './components/sidenav/side-nav-title/side-nav-title.component';
import { ViewComponent } from './components/view/view.component';
import { AutofocusDirective } from "./directives/autofocus.directive";
import { ShowLoadingDotsDirective } from './directives/show-loading-dots.directive';
import { ShowLoadingOverlayDirective } from './directives/show-loading-overlay.directive';
import { DurationPipe } from './pipes/duration.pipe';
import { AngularMaterialModule } from './util/angular-material.module';
import { ChannelDetailsDialog } from './components/channel-details-dialog/channel-details-dialog.component';
import { EditChannelsComponent } from './components/edit-channels/edit-channels.component';
import { PhoneChannelDetailsComponent } from './components/channel-details-dialog/phone-channel-details/phone-channel-details.component';
import { RadioChannelDetailsComponent } from './components/channel-details-dialog/radio-channel-details/radio-channel-details.component';
import { MailChannelDetailsComponent } from './components/channel-details-dialog/mail-channel-details/mail-channel-details.component';


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
    WorkspaceOperationSelectorComponent,
    SelectWorkspaceOperationDialog,
    HiddenComponent,
    IntelTypeInlineComponent,
    IntelSummaryComponent,
    PlainTextMessageSummaryComponent,
    AnalogRadioMessageSummaryComponent,
    KeyInfoBarComponent,
    AutofocusDirective,
    ChannelDetailsDialog,
    EditChannelsComponent,
    PhoneChannelDetailsComponent,
    RadioChannelDetailsComponent,
    MailChannelDetailsComponent
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
    HiddenComponent,
    IntelTypeInlineComponent,
    IntelSummaryComponent,
    KeyInfoBarComponent,
    AutofocusDirective,
    DeleteConfirmDialog,
    MatStepperModule,
    EditChannelsComponent
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
    MatStepperModule,
  ],
})
export class CoreModule {
}
