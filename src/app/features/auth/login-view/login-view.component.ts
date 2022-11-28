import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Loader } from '../../../core/util/loader';
import { NotificationService } from '../../../core/services/notification.service';
import { FormBuilder } from '@angular/forms';
import { MDSError, MDSErrorCode } from '../../../core/util/errors';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

/**
 * View for logging in a user.
 */
@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss'],
})
export class LoginView implements OnInit, OnDestroy {
  /**
   * Loader for when we are currently logging in and awaiting response.
   */
  loggingIn = new Loader();

  form = this.fb.nonNullable.group({
    username: this.fb.nonNullable.control<string>(''),
    pass: this.fb.nonNullable.control<string>(''),
  });
  allowLogin = false;

  private s: Subscription[] = [];

  constructor(private authService: AuthService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router) {
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    // Add validation manually as we do not want to visualize required-errors.
    this.s.push(this.form.valueChanges.subscribe(v => {
      if (!v.username) {
        this.allowLogin = false;
        return;
      }
      if (!v.pass) {
        this.allowLogin = false;
        return;
      }
      this.allowLogin = true;
    }));
  }

  login(): void {
    const username = this.form.value.username;
    if (username === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'username not set');
    }
    const pass = this.form.value.pass;
    if (pass === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'pass not set');
    }
    this.loggingIn.load(this.authService.login(username, pass)).subscribe({
      next: (loginOK: boolean): void => {
        if (!loginOK) {
          this.notificationService.notifyUninvasiveShort($localize `Login failed.`);
          return
        }
        // Navigate to homepage.
        this.router.navigate(['/']).then()
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize `Login failed.`);
      },
    });
  }
}
