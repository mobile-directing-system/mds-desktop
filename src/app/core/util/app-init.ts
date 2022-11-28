import { NetService } from '../services/net.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export function netLoginInit(netService: NetService, authService: AuthService, router: Router): () => void {
  return () => {
    const pathName = window.location.pathname
    // Redirect to set-server-url-page if base url is not set.
    if (netService.getBaseURL() === undefined) {
      router.navigate(['/set-server-url']).then();
      return;
    }
    // Redirect to login-page if not logged in.
    if (authService.loggedInUser() === undefined && pathName !== "/set-server-url") {
      router.navigate(['/login']).then();
      return;
    }
  };
}
