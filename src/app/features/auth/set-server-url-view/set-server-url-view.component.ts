import { Component, OnInit } from '@angular/core';
import { NetService } from '../../../core/services/net.service';
import { FormControl, Validators } from '@angular/forms';
import { URLPattern } from '../../../core/constants/matchers';
import { Router } from '@angular/router';
import { NotificationService, NotifyDuration } from '../../../core/services/notification.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AuthService } from '../../../core/services/auth.service';

/**
 * View for setting the server url.
 */
@Component({
  selector: 'app-set-server-url-view',
  templateUrl: './set-server-url-view.component.html',
  styleUrls: ['./set-server-url-view.component.scss'],
})
export class SetServerURLView implements OnInit {
  serverURLFC = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.pattern(URLPattern), Validators.required],
  });

  constructor(private netService: NetService, private authService: AuthService, private router: Router,
              private notificationService: NotificationService, private lsService: LocalStorageService) {
  }

  ngOnInit(): void {
    const serverURL = this.lsService.getItem(LocalStorageService.TokenServerURL);
    if (serverURL !== null) {
      this.serverURLFC.setValue(serverURL);
    }
  }

  apply(): void {
    const newServerURL = this.serverURLFC.value;
    this.authService.clearLogin();
    this.netService.setBaseUrl(newServerURL);
    this.router.navigate(['/login']).then();
    const message = $localize`:notify that server url was set:Server url set to ${ newServerURL }:new_server_url:.`;
    this.notificationService.notifyUninvasiveShort(message, NotifyDuration.Regular);
  }
}
