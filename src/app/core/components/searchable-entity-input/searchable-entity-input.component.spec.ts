import { fakeAsync, tick } from '@angular/core/testing';

import { byTextContent, createComponentFactory, Spectator, SpectatorOptions } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { Observable, of } from 'rxjs';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AngularMaterialModule } from '../../util/angular-material.module';
import { SearchableEntityInputComponent } from './searchable-entity-input.component';
import Spy = jasmine.Spy;

interface SampleData {
  id: string,
  a: string
}

function genFactoryOptions(): SpectatorOptions<SearchableEntityInputComponent<string, SampleData>> {
  return {
    component: SearchableEntityInputComponent,
    imports: [
      CoreModule,
      NoopAnimationsModule,
    ],
  };
}

describe('SearchableEntityInputComponent', () => {
  let spectator: Spectator<SearchableEntityInputComponent<string, SampleData>>;
  let component: SearchableEntityInputComponent<string, SampleData>;
  const createComponent = createComponentFactory<SearchableEntityInputComponent<string, SampleData>>({
    ...genFactoryOptions(),
  });
  let harnessLoader: HarnessLoader;
  let retrieveSpy: Spy;
  let searchSpy: Spy;

  beforeEach(fakeAsync(() => {
    retrieveSpy = jasmine.createSpy('retrieve');
    searchSpy = jasmine.createSpy('search').and.returnValue(of([]));
    spectator = createComponent({
      props: {
        retrieve: retrieveSpy,
        search: searchSpy,
      },
    });
    component = spectator.component;
    harnessLoader = TestbedHarnessEnvironment.loader(spectator.fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search value changes', () => {
    it('should ignore non-string value changes', fakeAsync(() => {
      searchSpy.calls.reset();

      // @ts-ignore
      component.searchFC.setValue({ hello: 'world' });
      tick(SearchableEntityInputComponent.SearchDebounceTimeMS);

      expect(searchSpy).not.toHaveBeenCalled();
    }));

    it('should ignore null-values', fakeAsync(() => {
      searchSpy.calls.reset();

      component.searchFC.setValue(null);
      tick(SearchableEntityInputComponent.SearchDebounceTimeMS);

      expect(searchSpy).not.toHaveBeenCalled();
    }));

    it('should notify about being touched', fakeAsync(() => {
      searchSpy.calls.reset();
      const onTouchedSpy = jasmine.createSpy('on-touched-listener');
      component.registerOnTouched(onTouchedSpy);

      component.searchFC.setValue('promise');
      tick(SearchableEntityInputComponent.SearchDebounceTimeMS);

      expect(onTouchedSpy).toHaveBeenCalled();
    }));

    it('should debounce search input', fakeAsync(() => {
      searchSpy.calls.reset();
      component.searchFC.setValue('promise');

      tick(SearchableEntityInputComponent.SearchDebounceTimeMS / 2);
      expect(searchSpy).not.toHaveBeenCalled();
      tick(SearchableEntityInputComponent.SearchDebounceTimeMS / 2);
      expect(searchSpy).toHaveBeenCalled();
    }));

    it('should call search with initial value', () => {
      expect(searchSpy).toHaveBeenCalled();
    });
  });

  describe('refreshSuggestions', () => {
    const searchTerm = 'cousin';

    beforeEach(() => {
      searchSpy.calls.reset();
    });

    it('should throw an error when no search function was passed', fakeAsync(() => {
      expect(() => {
        component.search = undefined;
        component.searchFC.setValue(searchTerm);
        tick(SearchableEntityInputComponent.SearchDebounceTimeMS);
      }).toThrowError();
    }));

    it('should apply entities', fakeAsync(() => {
      const suggestions: SampleData[] = [
        {
          id: 'until',
          a: 'most',
        },
        {
          id: 'appoint',
          a: 'bear',
        },
        {
          id: 'ground',
          a: 'pet',
        },
        {
          id: 'stir',
          a: 'count',
        },
      ];
      searchSpy.and.returnValue(of(suggestions));

      component.searchFC.setValue('');
      tick(SearchableEntityInputComponent.SearchDebounceTimeMS);

      expect(component.suggestions.getValue()).toEqual(suggestions);
    }));
  });

  describe('selectEntity', () => {
    const entityToSelect: SampleData = {
      id: 'hit',
      a: 'touch',
    };

    it('should throw an error when disabled', () => {
      component.searchFC.disable();
      expect(() => {
        component.selectEntity(entityToSelect);
      }).toThrowError();
    });

    it('should clear suggestions', () => {
      component.selectEntity(entityToSelect);
      expect(component.suggestions.getValue()).toEqual([]);
    });

    it('should set the new entity', () => {
      component.selectEntity(entityToSelect);
      expect(component.selectedEntityId).toEqual(entityToSelect.id);
      expect(component.selectedEntityValue).toEqual(entityToSelect);
    });

    it('should notify about changed value', () => {
      const notifySpy = jasmine.createSpy();
      component.registerOnChange(notifySpy);

      component.selectEntity(entityToSelect);

      expect(notifySpy).toHaveBeenCalledOnceWith(component.selectedEntityId);
    });
  });

  describe('clearSearch', () => {
    const entity: SampleData = {
      id: 'hit',
      a: 'example',
    };

    it('should throw an error when native element ref for search input is missing', () => {
      component.searchInput = undefined;
      expect(() => {
        component.clearSelectedEntity();
      }).toThrowError();
    });

    it('should clear native element of search input', () => {
      component.selectEntity(entity);
      expect(component.searchInput?.nativeElement.value).toEqual('');
    });
  });

  it('should disable correctly', () => {
    component.setDisabledState(true);
    expect(component.searchFC.disabled).toBeTrue();
  });

  it('should enable correctly', () => {
    component.setDisabledState(false);
    expect(component.searchFC.enabled).toBeTrue();
  });

  describe('writeValue', () => {
    const id = 'whom';

    beforeEach(() => {
      searchSpy.calls.reset();
      retrieveSpy.calls.reset();
      retrieveSpy.and.returnValue(of([]));
    });

    it('should clear suggestions', () => {
      component.writeValue(id);
      expect(component.suggestions.getValue()).toEqual([]);
    });

    it('should replace selected entity', () => {
      component.writeValue(id);
      expect(component.selectedEntityId).toEqual(id);
    });

    it('should load entity value', () => {
      component.writeValue(id);
      expect(retrieveSpy).toHaveBeenCalledOnceWith(id);
    });
  });

  describe('loadSelectedEntityValue', () => {
    const entity: SampleData = {
      id: 'pack',
      a: 'pack',
    };

    beforeEach(() => {
      retrieveSpy.calls.reset();
    });

    it('should throw an error when no retrieve function is set', () => {
      component.retrieve = undefined;
      expect(() => component.writeValue(entity.id)).toThrowError();
    });

    it('should ignore the retrieved entity when it was cleared', fakeAsync(() => {
      retrieveSpy.and.callFake(() => {
        component.selectedEntityId = undefined;
        return of(entity);
      });
      component.writeValue(entity.id);

      expect(retrieveSpy).toHaveBeenCalledTimes(1);
      expect(component.selectedEntityValue).not.toEqual(entity);
    }));

    it('should ignore the retrieved entity when another one was selected', fakeAsync(() => {
      retrieveSpy.and.callFake(() => {
        component.selectedEntityId = 'choice';
        return of(entity);
      });
      component.writeValue(entity.id);

      expect(retrieveSpy).toHaveBeenCalledTimes(1);
      expect(component.selectedEntityValue).not.toEqual(entity);
    }));

    it('should set value of retrieved entity', fakeAsync(() => {
      retrieveSpy.and.returnValue(of(entity));
      component.writeValue(entity.id);
      tick();

      expect(component.selectedEntityValue).toEqual(entity);
    }));
  });

  describe('clearSelectedEntity', () => {
    const selectedEntity: SampleData = {
      id: 'ocean',
      a: 'log',
    };

    beforeEach(() => {
      component.selectedEntityId = selectedEntity.id;
      component.selectedEntityValue = selectedEntity;
    });

    it('should throw an error when form control is disabled', () => {
      component.setDisabledState(true);
      expect(() => component.clearSelectedEntity()).toThrowError();
    });

    it('should clear the element', () => {
      component.clearSelectedEntity();
      expect(component.selectedEntityId).toBeFalsy();
      expect(component.selectedEntityValue).toBeFalsy();
    });

    it('should notify about changed value', () => {
      const notifySpy = jasmine.createSpy();
      component.registerOnChange(notifySpy);

      component.clearSelectedEntity();

      expect(notifySpy).toHaveBeenCalledOnceWith(null);
    });

    it('should clear search input', () => {
      component.clearSelectedEntity();
      expect(component.searchFC.value).toEqual('');
    });
  });

  describe('fixture', () => {
    beforeEach(async () => {
      await spectator.fixture.whenStable();
    });

    it('should not display label when not set', async () => {
      component.label = undefined;
      spectator.detectChanges();
      await spectator.fixture.whenStable();
      // Bug in Angular Material.
      spectator.click('input');

      expect(spectator.query('mat-label')).not.toBeVisible();
    });

    it('should display label when set', async () => {
      component.label = 'hurt';
      spectator.detectChanges();
      await spectator.fixture.whenStable();
      // Bug in Angular Material.
      spectator.click('input');

      expect(spectator.query('mat-label')).toBeVisible();
      expect(spectator.query('mat-label')).toHaveText(component.label);
    });

    it('should not display value when no entities are selected', async () => {
      component.selectedEntityId = undefined;
      component.selectedEntityValue = undefined;
      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(spectator.query('.entity-display')).not.toBeVisible();
    });

    it('should display value when entity is selected', async () => {
      const selectedEntity: SampleData = {
        id: 'office',
        a: 'human',
      };
      component.selectedEntityId = selectedEntity.id;
      component.selectedEntityValue = selectedEntity;

      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(spectator.query(byTextContent(selectedEntity.id, {
        exact: false,
        selector: 'div',
      }))).toBeVisible();
    });

    it('should display loading dots when entity value is loading', async () => {
      component.selectedEntityId = 'effort';
      component.selectedEntityValue = undefined;

      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(spectator.query('app-loading-dots')).toBeVisible();
    });

    it('should display clear button', async () => {
      component.selectedEntityId = 'effort';

      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(spectator.query('mat-icon')).toBeVisible();
      expect(spectator.query('mat-icon')).toHaveText('close');
    });

    it('should clear when clicking cancel button for selected', async () => {
      const clearSpy = spyOn(component, 'clearSelectedEntity');
      component.selectedEntityId = 'effort';
      spectator.detectChanges();
      await spectator.fixture.whenStable();

      spectator.click(byTextContent('close', { selector: 'mat-icon' }));
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    describe('suggestions', () => {
      const suggestions: SampleData[] = [
        {
          id: 'marry',
          a: 'aloud',
        },
        {
          id: 'nature',
          a: 'enemy',
        },
      ];

      beforeEach(() => {
        searchSpy.calls.reset();
        searchSpy.and.returnValue(of(suggestions));
      });

      it('should display suggestions for autocomplete', fakeAsync(async () => {
        spectator.typeInElement('hello', 'input');
        tick(SearchableEntityInputComponent.SearchDebounceTimeMS);

        const autocomplete = await harnessLoader.getHarness(MatAutocompleteHarness);
        expect(autocomplete).toBeTruthy();
        tick();
        const options = await autocomplete.getOptions();
        expect(options.length).toEqual(suggestions.length);
        const optionTexts = await Promise.all(options.map(o => o.getText()));
        expect(optionTexts).toEqual(suggestions.map(s => s.id));
      }));

      it('should select entity on suggestion selection', fakeAsync(async () => {
        spectator.typeInElement('hello', 'input');
        tick(SearchableEntityInputComponent.SearchDebounceTimeMS);

        const autocomplete = await harnessLoader.getHarness(MatAutocompleteHarness);
        tick();
        const options = await autocomplete.getOptions();
        await options[0].click();
        tick();

        expect(component.selectedEntityId).toEqual(suggestions[0].id);
        expect(component.selectedEntityValue).toEqual(suggestions[0]);
      }));
    });
  });
});

@Component({
  template: `
    <app-searchable-entity-input
      [displayTemplate]="display"
      [errorTemplate]="errors"
      [formControl]="fc"
      required="true"
      [retrieve]="getByID.bind(this)"
      [search]="search.bind(this)"
      [suggestionTemplate]="suggestion"
      class="app-edit-input-large"
      label="Owner"
      placeholder="Search owner...">
      <ng-template #display let-entity='entity'>
        {{asSD(entity).a}}
      </ng-template>
      <ng-template #suggestion let-entity='entity'>
        {{asSD(entity).a}}
      </ng-template>
      <ng-template #errors>
        <mat-error *ngIf="fc.errors">Invalid value.</mat-error>
      </ng-template>
    </app-searchable-entity-input>`,
})
class TestHostComponent {
  fc = new FormControl<string | null>(null);

  @Input() getByID: (id: string) => Observable<SampleData> = () => {
    throw new Error('missing get-by-id fn');
  };
  @Input() search: (searchTerm: string) => Observable<SampleData[]> = () => {
    throw new Error('missing search fn');
  };

  asSD(sd: any): SampleData {
    return sd;
  }
}

describe('SearchableEntityInputComponent.integration', () => {
  let spectator: Spectator<TestHostComponent>;
  let host: TestHostComponent;
  const createComponent = createComponentFactory<TestHostComponent>({
    ...genFactoryOptions(),
    imports: [CoreModule, AngularMaterialModule],
    component: TestHostComponent,
  });
  let harnessLoader: HarnessLoader;
  let retrieveSpy: Spy;
  let searchSpy: Spy;
  let entity: SampleData;
  let suggestions: SampleData[] = [];

  beforeEach(async () => {
    retrieveSpy = jasmine.createSpy('retrieve');
    searchSpy = jasmine.createSpy('search').and.returnValue(of([]));
    entity = {
      id: 'pack',
      a: 'hello',
    };
    suggestions = [
      {
        id: 'angle',
        a: 'prepare',
      },
      {
        id: 'near',
        a: 'handle',
      },
    ];
    spectator = createComponent({
      props: {
        getByID: retrieveSpy,
        search: searchSpy,
      },
    });
    host = spectator.component;
    harnessLoader = TestbedHarnessEnvironment.loader(spectator.fixture);

    await spectator.fixture.whenStable();
  });

  it('should create', fakeAsync(() => {
    expect(host).toBeTruthy();
  }));

  it('should apply form control value', fakeAsync(async () => {
    retrieveSpy.calls.reset();
    retrieveSpy.and.returnValue(of(entity));
    host.fc.setValue(entity.id);
    tick();
    await spectator.fixture.whenStable();

    // Bug in Angular Material.
    spectator.click('input');

    expect(retrieveSpy).withContext('should have called retrieve').toHaveBeenCalledOnceWith(entity.id);
  }));

  it('should display entity with display-template', fakeAsync(async () => {
    retrieveSpy.calls.reset();
    retrieveSpy.and.returnValue(of(entity));
    host.fc.setValue(entity.id);
    tick();
    await spectator.fixture.whenStable();

    // Bug in Angular Material.
    spectator.click('input');

    expect(spectator.query(byTextContent(entity.a, {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  }));

  it('should call for suggestions', fakeAsync(() => {
    const term = 'general';
    searchSpy.calls.reset();
    searchSpy.and.returnValue(of(suggestions));

    spectator.typeInElement(term, 'input');
    tick(SearchableEntityInputComponent.SearchDebounceTimeMS);

    expect(searchSpy).toHaveBeenCalledOnceWith(term);
  }));

  it('should display suggestions using template', fakeAsync(async () => {
    const term = 'general';
    searchSpy.calls.reset();
    searchSpy.and.returnValue(of(suggestions));

    spectator.typeInElement(term, 'input');
    tick(SearchableEntityInputComponent.SearchDebounceTimeMS);
    await spectator.fixture.whenStable();

    const autocomplete = await harnessLoader.getHarness(MatAutocompleteHarness);
    tick();
    const options = await autocomplete.getOptions();
    const optionTexts = await Promise.all(options.map(o => o.getText()));

    expect(optionTexts).toEqual(suggestions.map(s => s.a));
  }));

  it('should display errors using template', fakeAsync(async () => {
    // Touch.
    spectator.focus('input');
    spectator.focus('mat-form-field')

    spectator.detectComponentChanges();
    tick();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Invalid value.', { selector: 'mat-error' }))).toBeVisible();
  }));
});
