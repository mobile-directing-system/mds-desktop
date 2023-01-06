import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loader } from '../../../../core/util/loader';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MDSError, MDSErrorCode } from '../../../../core/util/errors';
import { OperationService } from '../../../../core/services/operation.service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-create-operation-view',
  templateUrl: './create-operation-view.component.html',
  styleUrls: ['./create-operation-view.component.scss'],
})

export class CreateOperationViewComponent implements OnInit, OnDestroy {

  private s: Subscription[] = [];

  currentStartDate: Date = new Date();

  /**
   * Loader for when creating a new operation and awaiting the response.
   */
  creatingOperation = new Loader();

  form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control<string>('', [Validators.required]),
    description: this.fb.nonNullable.control<string>('', [Validators.required]),
    start: this.fb.nonNullable.control<Date>(new Date(), [Validators.required]),
    end: this.fb.nonNullable.control<Date | undefined>(undefined, [this.validateEndDate()]),
    isArchived: this.fb.nonNullable.control<boolean>(false, [Validators.required]),
  });


  constructor(private operationService: OperationService, private notificationService: NotificationService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.s.push(this.form.controls.start.valueChanges.pipe(tap(newStartDate => {
      this.currentStartDate = newStartDate;
    })).subscribe());
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
      throw new MDSError(MDSErrorCode.AppError, 'isArchived-control is not set');
    }
    this.creatingOperation.load(this.operationService.createOperation({
      title: title,
      description: description,
      start: start,
      end: end,
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

  validateEndDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      if (control.value.getTime() >  this.currentStartDate.getTime()) {
        return null;
      } else {
        return { isValidEndDate: true };
      }
    };
  }

  close() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }
}
