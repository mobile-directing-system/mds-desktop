import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum NotifyDuration {
  Short = 2000,
  Regular = 3500,
  Long = 5000,
}

/**
 * Service for showing and managing notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {
  }

  notifyUninvasiveShort(message: string, duration: NotifyDuration = NotifyDuration.Short): void {
    this.snackBar.open(message, undefined, { duration: duration });
  }
}
