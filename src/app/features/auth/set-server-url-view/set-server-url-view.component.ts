import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { URLPattern } from '../../../core/constants/matchers';
import { Router } from '@angular/router';
import { NotificationService, NotifyDuration } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfigService } from '../../../core/services/config.service';

/**
 * View for setting the server url.
 */
@Component({
  selector: 'app-set-server-url-view',
  templateUrl: './set-server-url-view.component.html',
  styleUrls: ['./set-server-url-view.component.scss'],
})
export class SetServerURLView implements OnInit {
  serverUrlFC = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.pattern(URLPattern), Validators.required],
  });

  constructor(private configService: ConfigService, private authService: AuthService, private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.configService.serverUrl.subscribe(serverUrl => {
      if (serverUrl !== null) {
        this.serverUrlFC.setValue(serverUrl);
      }
    });
  }

  apply(): void {
    const newServerUrl = this.serverUrlFC.value;
    this.authService.clearLogin();
    this.configService.setServerUrl(newServerUrl);
    this.router.navigate(['/login']).then();
    const message = $localize`:notify that server url was set:Server url set to ${ newServerUrl }:new_server_url:.`;
    this.notificationService.notifyUninvasiveShort(message, NotifyDuration.Regular);
  }
}
