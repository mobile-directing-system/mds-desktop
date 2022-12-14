import { NetService } from '../services/net.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';

export function netLoginInit(netService: NetService, authService: AuthService, router: Router): () => void {
  return () => {
    const pathName = window.location.pathname;
    // Redirect to set-server-url-page if base url is not set.
    if (netService.getBaseURL() === undefined) {
      router.navigate(['/set-server-url']).then();
      return;
    }
    // Redirect to login-page if not logged in.
    if (authService.loggedInUser() === undefined && pathName !== '/set-server-url') {
      router.navigate(['/login']).then();
      return;
    }
  };
}

export function matPaginatorInternationalization(p: MatPaginatorIntl): () => void {
  return () => {
    p.itemsPerPageLabel = $localize`Items per page:`;
    p.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length == 0 || pageSize == 0) {
        return $localize`0 of ${ length }:total:`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return $localize`${ startIndex + 1 }:from: - ${ endIndex }:to: of ${ length }:total:`;
    };
  };
}
