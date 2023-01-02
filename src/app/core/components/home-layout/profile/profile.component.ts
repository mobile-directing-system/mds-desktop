import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../model/user';
import { of, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  loggedInUser?: User;

  private s: Subscription[] = [];

  constructor(private authService: AuthService, private userService: UserService) {
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    // Retrieve currently logged-in user on update.
    this.s.push(this.authService.userChange().pipe(
      switchMap((loggedInUser: string | undefined) => {
        if (!loggedInUser) {
          return of(void 0);
        }
        return this.userService.getUserById(loggedInUser);
      }),
    ).subscribe((loggedInUser: User | undefined) => this.loggedInUser = loggedInUser));
  }

  /**
   * Assembles the displayed profile name including missing fields.
   */
  assembleProfileName(): string | undefined {
    if (!this.loggedInUser) {
      return undefined;
    }
    let s: string[] = [];
    if (this.loggedInUser.firstName !== '') {
      s.push(this.loggedInUser.firstName);
    }
    if (this.loggedInUser.lastName !== '') {
      s.push(this.loggedInUser.lastName);
    }
    if (this.loggedInUser.username !== '') {
      if (s.length === 0) {
        s.push(this.loggedInUser.username);
      } else {
        s.push(`(${ this.loggedInUser.username })`);
      }
    }
    return s.join(' ');
  }
}
