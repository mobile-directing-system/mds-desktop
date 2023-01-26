import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Permission, PermissionName } from '../../../../../core/permissions/permissions';
import { MDSError, MDSErrorCode } from '../../../../../core/util/errors';

/**
 * Simple toggle for either granting permissions or not. No options supported.
 */
@Component({
  selector: 'app-simple-permission-control',
  templateUrl: './simple-permission-control.component.html',
  styleUrls: ['./simple-permission-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SimplePermissionControlComponent),
      multi: true,
    },
  ],
})
export class SimplePermissionControlComponent implements ControlValueAccessor {
  /**
   * Optional label to show instead of {@link permissionName}.
   */
  @Input() label?: string;
  /**
   * Permission for the control.
   */
  @Input() permissionName?: PermissionName;
  /**
   * Whether the permission is granted (toggled).
   */
  isGranted = false;
  /**
   * Whether the control is disabled. Set via {@link setDisabledState}.
   */
  isDisabled = false;

  private onChangeListeners: any[] = [];

  /**
   * Required for {@link ControlValueAccessor}.
   * @param fn The listener.
   */
  registerOnChange(fn: any): void {
    this.onChangeListeners.push(fn);
  }

  private onTouchedListeners: any[] = [];

  /**
   * Required for {@link ControlValueAccessor}.
   * @param fn The listener.
   */
  registerOnTouched(fn: any): void {
    this.onTouchedListeners.push(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(permission: Permission | null): void {
    this.isGranted = permission !== null;
  }

  setGranted(isGranted: boolean): void {
    if (this.permissionName === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'missing permission name');
    }
    // Update toggled state.
    this.isGranted = isGranted;
    // Notify listeners.
    let notifyValue: Permission | null = null;
    if (isGranted) {
      notifyValue = {
        name: this.permissionName,
      };
    }
    this.onChangeListeners.forEach(l => l(notifyValue));
    this.onTouchedListeners.forEach(l => l());
  }
}
