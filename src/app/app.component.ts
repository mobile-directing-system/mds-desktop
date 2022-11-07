import { Component, OnInit } from '@angular/core';
import { UserService } from './core/services/user.service';
import { AuthService } from './core/services/auth.service';
import { NetService } from './core/services/net.service';
import { mergeMap, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  response: string = '<no call yet>';

  constructor(private s: UserService, private authService: AuthService, private netService: NetService) {
    netService.baseUrl = 'http://minikube:30080';
  }

  ngOnInit(): void {
    this.authService.login('admin', 'admin').pipe(
      tap(() => {
        this.isLoggedIn = true;
      }),
      // The "actual" service call.
      mergeMap(() => this.s.getUsers({
        limit: 10,
        offset: 0,
      })),
    ).subscribe({
        next: response => (this.response = JSON.stringify(response)),
      },
    );
  }
}
