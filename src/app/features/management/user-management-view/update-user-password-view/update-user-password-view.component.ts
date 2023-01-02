import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';

/**
 * View for updating a user's password.
 */
@Component({
  selector: 'app-update-user-password-view',
  templateUrl: './update-user-password-view.component.html',
  styleUrls: ['./update-user-password-view.component.scss'],
})
export class UpdateUserPasswordView implements OnInit, OnDestroy {

  /**
   * Loader for when updating a user and awaiting the response.
   */
  updatingUserPass = new Loader();

  form = this.fb.nonNullable.group({
    newPassword: this.fb.nonNullable.control<string>('', [Validators.required]),
  });

  private s: Subscription[] = [];
  id = '';

  constructor(private userService: UserService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute) {
    this.updatingUserPass.bindFormGroup(this.form);
  }

  ngOnDestroy() {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    // Get id of current user from router path.
    this.s.push(this.route.params.subscribe(params => {
      this.id = params['id'];
    }));
  }

  updateUserPass(): void {
    const newPassword = this.form.value.newPassword;
    if (newPassword === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'new-password-control is not set');
    }
    this.updatingUserPass.load(this.userService.updateUserPass(this.id, newPassword)).subscribe({
      next: _ => {
        this.close();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Updating password failed.`);
      },
    });
  }

  close() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }
}
