import { Route } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

/**
 * Clears all components in the given {@link Route} list for the given path. This is required for tests where parent
 * components demand providers.
 * @param routes The routes to clear components in.
 * @param path The path to clear of components.
 */
export function clearRouteComponentsFor(routes: Route[], path: string): Route[] {
  path = path.replace(/^\//, '');
  const currentSegment = path.split('/')[0];
  const cleared: Route[] = [];
  routes.forEach(route => {
    const newRoute: Route = {
      ...route,
      children: [],
    };
    let newPath = path;
    if (path.length > 0 && route.path == '') {
      newRoute.component = undefined;
      newRoute.canActivate = undefined;
      newRoute.canActivateChild = undefined;
    } else if (route.path === currentSegment) {
      newRoute.component = undefined;
      newRoute.canActivate = undefined;
      newRoute.canActivateChild = undefined;
      newPath = path.substring(currentSegment.length);
    }
    if (!!route.children) {
      newRoute.children?.push(...clearRouteComponentsFor(route.children, newPath));
    }
    cleared.push(newRoute);
  });
  return cleared;
}

function isPathSet(p: string | undefined): boolean {
  return p !== undefined && p !== '';
}

/**
 * Clears all components in the given {@link Route} list except the one for the given path. This is required for tests
 * where parent and child components demand providers.
 * @param routes The routes to clear components in.
 * @param exceptPath The except-path to not clear of components.
 */
export function clearRouteComponentsExcept(routes: Route[], exceptPath: string): Route[] {
  exceptPath = exceptPath.replace(/^\//, '');
  exceptPath = exceptPath.startsWith('/') ? exceptPath : `/${ exceptPath }`;
  return clearRouteComponentsExceptRec(routes, exceptPath, '');
}

function clearRouteComponentsExceptRec(routes: Route[], exceptPath: string, lastPath: string): Route[] {
  const cleared: Route[] = [];
  routes.forEach(route => {
    const newRoute: Route = {
      ...route,
      children: [],
    };
    const currentPath = lastPath + (isPathSet(route.path) ? `/${ route.path }` : '');
    // Clear if not except-path.
    if (currentPath !== exceptPath) {
      newRoute.component = undefined;
      newRoute.canActivate = undefined;
      newRoute.canActivateChild = undefined;
    }
    if (!!route.children) {
      newRoute.children?.push(...clearRouteComponentsExceptRec(route.children, exceptPath, currentPath));
    }
    cleared.push(newRoute);
  });
  return cleared;
}

/**
 * Creates a new {@link MatDialogRef} that returns the given value on {@link MatDialogRef.afterClosed}.
 * @param result
 */
export function newMatDialogRefMock<T>(result: T | undefined): jasmine.SpyObj<MatDialogRef<any>> {
  return jasmine.createSpyObj({
    afterClosed: of(result),
  });
}
