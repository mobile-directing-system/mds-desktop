import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateIncident, Incident } from 'src/app/core/model/incident';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Loader } from 'src/app/core/util/loader';

@Component({
  selector: 'app-create-incident',
  templateUrl: './create-incident.component.html',
  styleUrls: ['./create-incident.component.scss']
})
export class CreateIncidentComponent {

  loader: Loader = new Loader();

  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control<string>('', Validators.required),
    description: this.fb.nonNullable.control<string>(''),
  });

  constructor(private incidentService: IncidentService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private notificationService: NotificationService, private localStorage: LocalStorageService, private location: Location) { }

  createIncident() {
    let operation = this.localStorage.getItem(LocalStorageService.TokenWorkspaceOperation);
    if(!operation) {
      this.notificationService.notifyUninvasiveShort($localize`:@@incident-creation-failed:Incident creation failed.`);
      return;
    }

    const fv = this.form.getRawValue();
    const incident: CreateIncident = {
      name: fv.name,
      description: fv.description ?? "",
      isCompleted: false,
      operation: operation
    };

    this.loader.load(this.incidentService.createIncident(incident)).subscribe({
      next: _ => {
        this.cancel();
        this.notificationService.notifyUninvasiveShort($localize`:@@incident-creation-successful:Incident created successfully.`);
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`:@@incident-creation-failed:Incident creation failed.`);
      }
    });
  }

  cancel() {
    this.location.back();
  }
}
