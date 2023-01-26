import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';
import { OperationService } from '../../../../core/services/operation.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-create-operation-view',
  templateUrl: './create-operation-view.component.html',
  styleUrls: ['./create-operation-view.component.scss'],
})

export class CreateOperationView implements OnInit, OnDestroy {

  private s: Subscription[] = [];

  /**
   * Loader for when creating a new operation and awaiting the response.
   */
  creatingOperation = new Loader();

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.form.controls.start.valueChanges.subscribe(() => this.form.controls.end.updateValueAndValidity()));
  }

  form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control<string>('', [Validators.required]),
    description: this.fb.nonNullable.control<string>(''),
    start: this.fb.nonNullable.control<moment.Moment>(moment(), [Validators.required]),
    end: this.fb.control<moment.Moment | null>(null, [this.validateEndDate()]),
    isArchived: this.fb.nonNullable.control<boolean>(false, [Validators.required]),
  });


  constructor(private operationService: OperationService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute) {
  }

  createOperation(): void {
    const title = this.form.value.title;
    if (title === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'title-control is not set');
    }
    const description = this.form.value.description;
    if (description === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'description-control is not set');
    }
    const start = this.form.value.start;
    if (start === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'start-control is not set');
    }
    const end = this.form.value.end;
    const isArchived = this.form.value.isArchived;
    if (isArchived === undefined) {
      throw new MDSError(MDSErrorCode.AppError, 'is-archived-control is not set');
    }
    this.creatingOperation.load(this.operationService.createOperation({
      title: title,
      description: description,
      start: start.toDate(),
      end: end?.toDate(),
      is_archived: isArchived,
    })).subscribe({
      next: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Operation created successfully.`);
        this.close();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Operation creation failed.`);
      },
    });
  }

  /**
   * Validates whether the selected end date is past the selected start date.
   */
  validateEndDate(): ValidatorFn {
    return (_: AbstractControl): ValidationErrors | null => {
      const end = this.form?.controls.end.getRawValue();
      if (!end) {
        return null;
      }
      if (end.isAfter(this.form.controls.start.getRawValue())) {
        return null;
      } else {
        return { isValidEndDate: true };
      }
    };
  }

  /**
   * Navigates to the previous page.
   */
  close() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }
}
