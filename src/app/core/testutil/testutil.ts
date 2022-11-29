import { Route } from '@angular/router';

/**
 * Clears all components in the given {@link Route} list for the given path. This is required for tests where parent
 * components demand providers.
 * @param routes The routes to clear components in.
 * @param path The path to clear of components.
 */
export function clearRoutesFor(routes: Route[], path: string): Route[] {
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
    } else if (route.path === currentSegment) {
      newRoute.component = undefined;
      newPath = path.substring(currentSegment.length);
    }
    if (!!route.children) {
      newRoute.children?.push(...clearRoutesFor(route.children, newPath));
    }
    cleared.push(newRoute);
  });
  return cleared;
}
