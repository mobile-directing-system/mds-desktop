import { QuickSearchComponent } from './quick-search.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import anything = jasmine.anything;

function genFactoryOptions(): SpectatorRoutingOptions<QuickSearchComponent> {
  return {
    component: QuickSearchComponent,
    imports: [CoreModule],
  };
}

describe('QuickSearchComponent', () => {
  let spectator: SpectatorRouting<QuickSearchComponent>;
  let component: QuickSearchComponent;
  const createComponent = createRoutingFactory({
    ...genFactoryOptions(),
  });
  const term = 'student door';

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set search from query params', fakeAsync(() => {
    spectator.setRouteQueryParam(component.buildQueryParam('search'), term);
    discardPeriodicTasks();
    tick();

    expect(component.searchTermFC.value).toEqual(term);
  }));

  it('should set query params on search term change', fakeAsync(() => {
    spectator.router.navigate = jasmine.createSpy().and.resolveTo();
    component.searchTermFC.setValue(term);
    tick(2000);

    expect(spectator.router.navigate).toHaveBeenCalledOnceWith([], {
      relativeTo: anything(),
      queryParams: { 'search': term },
      queryParamsHandling: 'merge',
    });
  }));

  it('should emit search event on search term change', fakeAsync(() => {
    spectator.router.navigate = jasmine.createSpy().and.resolveTo();
    const emitSpy = spyOn(component.search, 'emit');
    component.searchTermFC.setValue(term);
    tick(2000);

    expect(emitSpy).toHaveBeenCalledOnceWith(term);
  }));

  describe('clear', () => {
    it('should clear search term', () => {
      component.clear();
      expect(component.searchTermFC.value).toEqual('');
    });
  });

  describe('fixture', () => {
    beforeEach(async () => {
      await spectator.fixture.whenStable();
    });

    it('should have a descriptive label', fakeAsync(() => {
      expect(spectator.query(byTextContent('Quick search', {
        exact: false,
        selector: 'mat-label',
      }))).toBeVisible();

      discardPeriodicTasks();
    }));

    it('should emit an event when search term changes', fakeAsync(() => {
      spectator.router.navigate = jasmine.createSpy().and.resolveTo();
      const emitSpy = spyOn(component.search, 'emit');

      spectator.typeInElement(term, 'input');
      tick(2000);

      expect(emitSpy).toHaveBeenCalledOnceWith(term);
    }));
  });
});
