import { fakeAsync, tick } from '@angular/core/testing';

import {
  SearchableMultiChipEntityInputComponent,
  SelectedEntity,
} from './searchable-multi-chip-entity-input.component';
import { byTextContent, createComponentFactory, Spectator, SpectatorOptions } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { Observable, of } from 'rxjs';
import { Identifiable } from '../../util/misc';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AngularMaterialModule } from '../../util/angular-material.module';
import Spy = jasmine.Spy;

interface SampleData {
  id: string,
  a: string
}

function genFactoryOptions(): SpectatorOptions<SearchableMultiChipEntityInputComponent<string, SampleData>> {
  return {
    component: SearchableMultiChipEntityInputComponent,
    imports: [
      CoreModule,
      NoopAnimationsModule,
    ],
  };
}

describe('SearchableMultiChipEntityInputComponent', () => {
  let spectator: Spectator<SearchableMultiChipEntityInputComponent<string, SampleData>>;
  let component: SearchableMultiChipEntityInputComponent<string, SampleData>;
  const createComponent = createComponentFactory<SearchableMultiChipEntityInputComponent<string, SampleData>>({
    ...genFactoryOptions(),
  });
  let harnessLoader: HarnessLoader;
  let retrieveSpy: Spy;
  let searchSpy: Spy;
  let selectedEntities: SelectedEntity<string, SampleData>[] = [];

  beforeEach(fakeAsync(() => {
    retrieveSpy = jasmine.createSpy('retrieve');
    searchSpy = jasmine.createSpy('search').and.returnValue(of([]));
    selectedEntities = [
      {
        id: 'pack',
        v: {
          id: 'pack',
          a: 'hello',
        },
      },
      {
        id: 'sand',
        v: {
          id: 'sand',
          a: 'world',
        },
      },
      {
        id: 'quick',
        v: {
          id: 'quick',
          a: '!',
        },
      },
      {
        id: 'forget',
        v: {
          id: 'forget',
          a: '',
        },
      },
    ];
    spectator = createComponent({
      props: {
        retrieve: retrieveSpy,
        search: searchSpy,
        selectedEntities: selectedEntities,
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
      tick(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS);

      expect(searchSpy).not.toHaveBeenCalled();
    }));

    it('should ignore null-values', fakeAsync(() => {
      searchSpy.calls.reset();

      component.searchFC.setValue(null);
      tick(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS);

      expect(searchSpy).not.toHaveBeenCalled();
    }));

    it('should notify about being touched', fakeAsync(() => {
      searchSpy.calls.reset();
      const onTouchedSpy = jasmine.createSpy('on-touched-listener');
      component.registerOnTouched(onTouchedSpy);

      component.searchFC.setValue('promise');
      tick(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS);

      expect(onTouchedSpy).toHaveBeenCalled();
    }));

    it('should debounce search input', fakeAsync(() => {
      searchSpy.calls.reset();
      component.searchFC.setValue('promise');

      tick(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS / 2);
      expect(searchSpy).not.toHaveBeenCalled();
      tick(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS / 2);
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
        tick(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS);
      }).toThrowError();
    }));

    it('should not apply already selected entities', fakeAsync(() => {
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
      component.selectedEntities = [suggestions[0], suggestions[2]];
      searchSpy.and.returnValue(of(suggestions));

      component.searchFC.setValue('');
      tick(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS);

      expect(component.suggestions.getValue()).toEqual([suggestions[1], suggestions[3]]);
    }));
  });

  describe('addEntity', () => {
    const entityToAdd: SampleData = {
      id: 'hit',
      a: 'touch',
    };

    beforeEach(() => {
      component.selectedEntities = [
        {
          id: 'preach',
          v: {
            id: 'preach',
            a: 'hello',
          },
        },
        {
          id: 'soften',
          v: {
            id: 'soften',
            a: 'world',
          },
        },
        {
          id: 'nephew',
          v: {
            id: 'nephew',
            a: '!',
          },
        },
      ];
    });

    it('should throw an error when disabled', () => {
      component.searchFC.disable();
      expect(() => {
        component.addEntity(entityToAdd);
      }).toThrowError();
    });

    it('should throw an error on duplicate entry', () => {
      expect(() => {
        component.addEntity(component.selectedEntities[1].v!);
      }).toThrowError();
    });

    it('should clear suggestions', () => {
      component.addEntity(entityToAdd);
      expect(component.suggestions.getValue()).toEqual([]);
    });

    it('should add the new entity', () => {
      component.addEntity(entityToAdd);
      expect(component.selectedEntities).toContain({
        id: entityToAdd.id,
        v: entityToAdd,
      });
    });

    it('should notify about changed value', () => {
      const notifySpy = jasmine.createSpy();
      component.registerOnChange(notifySpy);

      component.addEntity(entityToAdd);

      expect(notifySpy).toHaveBeenCalledOnceWith(component.selectedEntities.map(e => e.id));
    });

    it('should clear current search input', () => {
      component.addEntity(entityToAdd);
      expect(component.searchFC.value).toBeNull();
    });
  });

  describe('clearSearch', () => {
    const entity: SampleData = {
      id: 'hit',
      a: 'example',
    };

    it('should clear current search input', () => {
      component.addEntity(entity);
      expect(component.searchFC.value).toBeNull();
    });

    it('should throw an error when native element ref for search input is missing', () => {
      component.searchInput = undefined;
      expect(() => {
        component.addEntity(entity);
      }).toThrowError();
    });

    it('should clear native element of search input', () => {
      component.addEntity(entity);
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
    const ids = ['than', 'whom', 'bad'];

    beforeEach(() => {
      searchSpy.calls.reset();
      retrieveSpy.calls.reset();
      retrieveSpy.and.returnValue(of([]));
    });

    it('should clear suggestions', () => {
      component.writeValue(ids);
      expect(component.suggestions.getValue()).toEqual([]);
    });

    it('should replace selected entities', () => {
      component.writeValue(ids);
      expect(component.selectedEntities.map(e => e.id)).toEqual(ids);
    });

    it('should load entity values', () => {
      component.writeValue(ids);
      expect(retrieveSpy).toHaveBeenCalledTimes(ids.length);
    });
  });

  describe('loadSelectedEntityValues', () => {
    const entities: SampleData[] = [
      {
        id: 'pack',
        a: 'pack',
      },
      {
        id: 'sand',
        a: 'sand',
      },
      {
        id: 'quick',
        a: 'quick',
      },
      {
        id: 'forget',
        a: 'forget',
      },
    ];
    const ids = entities.map(e => e.id);

    beforeEach(() => {
      retrieveSpy.calls.reset();
    });

    it('should throw an error when no retrieve function is set', () => {
      component.retrieve = undefined;
      expect(() => component.writeValue(ids)).toThrowError();
    });

    it('should ignore a retrieved entity when it got removed', fakeAsync(() => {
      retrieveSpy.and.callFake(() => {
        component.selectedEntities.splice(1);
        return of(entities[0]);
      });
      component.writeValue(ids);
      component.selectedEntities.splice(1);

      expect(retrieveSpy).toHaveBeenCalledTimes(ids.length);
      expect(component.selectedEntities).not.toContain(entities[0]);
    }));

    it('should set values for retrieved entities', fakeAsync(() => {
      retrieveSpy.and.returnValues(...entities.map(e => of(e)));
      component.writeValue(ids);
      tick();

      expect(retrieveSpy).toHaveBeenCalledTimes(ids.length);
      expect(component.selectedEntities).toEqual(entities.map(e => ({
        id: e.id,
        v: {
          id: e.id,
          a: e.id,
        },
      })));
    }));
  });

  describe('remove', () => {
    const toRemove: Identifiable<string> = {
      id: 'whom',
    };
    beforeEach(() => {
      component.selectedEntities.push({ id: 'width' });
      component.selectedEntities.push(toRemove);
    });

    it('should throw an error when form control is disabled', () => {
      component.setDisabledState(true);
      expect(() => component.remove(toRemove)).toThrowError();
    });

    it('should throw an error when element was not found', () => {
      expect(() => component.remove({ id: 'courage' })).toThrowError();
    });

    it('should remove the element from selected ones', () => {
      expect(component.selectedEntities).toContain(toRemove);
      component.remove(toRemove);
      expect(component.selectedEntities).not.toContain(toRemove);
    });

    it('should notify about changed value', () => {
      const notifySpy = jasmine.createSpy();
      component.registerOnChange(notifySpy);

      component.remove(toRemove);

      expect(notifySpy).toHaveBeenCalledOnceWith(spectator.component.selectedEntities.map(e => e.id));
    });

    it('should clear search input', () => {
      component.remove(toRemove);
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

    it('should not display chips when no entities are selected', async () => {
      component.selectedEntities = [];
      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(spectator.query('mat-chip-row')).not.toBeVisible();
    });

    it('should display chips when entities are selected', async () => {
      component.selectedEntities = [
        { id: 'persuade' },
        { id: 'tune' },
        { id: 'insure' },
        { id: 'glory' },
      ];
      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(spectator.queryAll('mat-chip-row').length).toEqual(component.selectedEntities.length);
    });

    it('should display loading dots when entities are loading', async () => {
      // Clear values.
      component.selectedEntities = component.selectedEntities.map(e => ({
        ...e,
        v: undefined,
      }));
      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(spectator.queryAll('app-loading-dots').length).toEqual(component.selectedEntities.length);
    });

    it('should display cancel buttons for chips', async () => {
      expect(spectator.queryAll('mat-icon').length).toEqual(component.selectedEntities.length);
      expect(spectator.query('mat-icon')).toHaveText('cancel');
    });

    it('should remove when clicking cancel button in chip', () => {
      const removeSpy = spyOn(component, 'remove');
      spectator.click(byTextContent('cancel', { selector: 'mat-icon' }));
      expect(removeSpy).toHaveBeenCalledTimes(1);
    });

    describe('suggestions', () => {
      const suggestions: SampleData[] = [
        {
          id: 'marry',
          a: 'blow',
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
        tick(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS);

        const autocomplete = await harnessLoader.getHarness(MatAutocompleteHarness);
        expect(autocomplete).toBeTruthy();
        tick();
        const options = await autocomplete.getOptions();
        expect(options.length).toEqual(suggestions.length);
        const optionTexts = await Promise.all(options.map(o => o.getText()));
        expect(optionTexts).toEqual(suggestions.map(s => s.id));
      }));

      it('should add entity on suggestion selection', fakeAsync(async () => {
        spectator.typeInElement('hello', 'input');
        tick(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS);

        const autocomplete = await harnessLoader.getHarness(MatAutocompleteHarness);
        tick();
        const options = await autocomplete.getOptions();
        await options[0].click();
        tick();

        expect(component.selectedEntities.map(e => e.v)).toContain(suggestions[0]);
      }));
    });
  });
});

@Component({
  template: `
    <app-searchable-multi-chip-entity-input-field
      [chipTemplate]="chip"
      [errorTemplate]="errors"
      [formControl]="fc"
      [retrieve]="getByID.bind(this)"
      [search]="search.bind(this)"
      [suggestionTemplate]="suggestion"
      class="app-edit-input-large"
      label="Members"
      placeholder="Add member...">
      <ng-template #chip let-entity='entity'>
        {{asSD(entity).a}}
      </ng-template>
      <ng-template #suggestion let-entity='entity'>
        {{asSD(entity).a}}
      </ng-template>
      <ng-template #errors>
        <mat-error *ngIf="fc.errors">Invalid value.</mat-error>
      </ng-template>
    </app-searchable-multi-chip-entity-input-field>`,
})
class TestHostComponent {
  fc = new FormControl<string[]>([]);

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

describe('SearchableMultiChipEntityInputComponent.integration', () => {
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
  let selectedEntities: SelectedEntity<string, SampleData>[] = [];
  let suggestions: SampleData[] = [];

  beforeEach(async () => {
    retrieveSpy = jasmine.createSpy('retrieve');
    searchSpy = jasmine.createSpy('search').and.returnValue(of([]));
    selectedEntities = [
      {
        id: 'pack',
        v: {
          id: 'pack',
          a: 'hello',
        },
      },
      {
        id: 'sand',
        v: {
          id: 'sand',
          a: 'world',
        },
      },
    ];
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
    selectedEntities.forEach(e => {
      retrieveSpy.withArgs(e.id).and.returnValue(of(e.v));
    });
    host.fc.setValue(selectedEntities.map(e => e.id));
    tick();
    await spectator.fixture.whenStable();

    // Bug in Angular Material.
    spectator.click('input');

    expect(retrieveSpy).withContext('should have called retrieve').toHaveBeenCalledTimes(selectedEntities.length);
    expect(spectator.queryAll('mat-chip-row').length).toEqual(selectedEntities.length);
  }));

  it('should display chip with template', fakeAsync(async () => {
    const e = selectedEntities[0];
    retrieveSpy.calls.reset();
    retrieveSpy.and.returnValue(of(e.v));
    host.fc.setValue([e.id]);
    tick();
    await spectator.fixture.whenStable();

    // Bug in Angular Material.
    spectator.click('input');

    expect(spectator.query(byTextContent(e.v!.a, {
      exact: false,
      selector: 'mat-chip-row',
    }))).withContext(`should display entity value '${ e.v!.a }' in chip with template`).toBeVisible();
  }));

  it('should call for suggestions', fakeAsync(() => {
    const term = 'general';
    searchSpy.calls.reset();
    searchSpy.and.returnValue(of(suggestions));

    spectator.typeInElement(term, 'input');
    tick(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS);

    expect(searchSpy).toHaveBeenCalledOnceWith(term);
  }));

  it('should display suggestions using template', fakeAsync(async () => {
    const term = 'general';
    searchSpy.calls.reset();
    searchSpy.and.returnValue(of(suggestions));

    spectator.typeInElement(term, 'input');
    tick(SearchableMultiChipEntityInputComponent.SearchDebounceTimeMS);
    await spectator.fixture.whenStable();

    const autocomplete = await harnessLoader.getHarness(MatAutocompleteHarness);
    tick();
    const options = await autocomplete.getOptions();
    const optionTexts = await Promise.all(options.map(o => o.getText()));

    expect(optionTexts).toEqual(suggestions.map(s => s.a));
  }));

  it('should display errors using template', fakeAsync(async () => {
    host.fc.setErrors({ 'charge': 'stair' });

    spectator.detectComponentChanges();
    tick();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Invalid value.', { selector: 'mat-error' }))).toBeVisible();
  }));
});
