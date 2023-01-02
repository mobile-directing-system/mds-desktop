import { Component, OnInit } from '@angular/core';
import { Loader } from '../../../core/util/loader';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

/**
 * View that logs out the user and redirects to login-page.
 */
@Component({
  selector: 'app-logout-view',
  templateUrl: './logout-view.component.html',
  styleUrls: ['./logout-view.component.scss'],
})
export class LogoutView implements OnInit {
  loggingOut = new Loader();

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.loggingOut.load(this.authService.logout()).subscribe(() => {
      this.router.navigate(['/login']).then()
    })
  }
}
