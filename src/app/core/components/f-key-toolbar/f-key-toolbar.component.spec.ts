import { FKeyToolbarComponent } from './f-key-toolbar.component';
import { createComponentFactory, Spectator, SpectatorOptions } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import Spy = jasmine.Spy;


interface SampleObject {
  a: string;
}

function sampleHotkeyFunction(value: SampleObject) {
  console.log(value)
}

function genFactoryOptions(): SpectatorOptions<FKeyToolbarComponent<SampleObject>> {
  return {
    component: FKeyToolbarComponent,
    imports: [
      CoreModule,
    ],
  };
}

describe('FKeyToolbarComponent', () => {
  let spectator: Spectator<FKeyToolbarComponent<SampleObject>>;
  let component: FKeyToolbarComponent<SampleObject>;
  let hotKeyTriggerFunctionSpy: Spy;
  const createComponent = createComponentFactory({
    ...genFactoryOptions(),
  });
  beforeEach(() => {
    spectator = createComponent({
        props: {
          hotKeyTriggerFunction: sampleHotkeyFunction,
        },
      },
    );
    component = spectator.component;
    hotKeyTriggerFunctionSpy = spyOn(component, 'hotKeyTriggerFunction');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should display dash, if input array is empty', fakeAsync(() => {
      component.suggestions = [];
      spectator.detectChanges();
      const keyBox = spectator.fixture.debugElement.query(By.css('.key-content'));
      expect(keyBox.nativeElement.textContent.trim()).toEqual('-');
    }));

    it('should call suggestionTextCallBack for each given suggestion', async () => {
      component.suggestions = [{
        suggestionText: 'deserve',
        suggestionObject: { a: 'attract' },
      }, {
        suggestionText: 'the',
        suggestionObject: { a: 'vessel' },
      }, {
        suggestionText: 'fruit',
        suggestionObject: { a: 'polish' },
      }, {
        suggestionText: 'deer',
        suggestionObject: { a: 'tie' },
      }, {
        suggestionText: 'valuable',
        suggestionObject: { a: 'clothe' },
      }];
      for (let i = 0; i < component.suggestions.length; i++) {
        spectator.detectChanges();
        const keyElem = spectator.fixture.debugElement.queryAll(By.css('.key-content'))[i]
        expect(keyElem.nativeElement.textContent.trim()).toEqual(component.suggestions[i].suggestionText);
      }
    });
  });

  describe('key press functionality', () => {
    it('should not call hotKeyTriggerFunction if no suggestions given and key is pressed', async () => {
      component.suggestions = [];
      for (let i = 0; i < 12; i++) {
        const event = new KeyboardEvent('keydown', {
          'key': `F${ i + 1 }`,
        });
        spectator.detectChanges();
        document.dispatchEvent(event);
        await spectator.fixture.whenStable();
        expect(hotKeyTriggerFunctionSpy).not.toHaveBeenCalled();
      }
    });

    it('should call hotKeyTriggerFunction based on pressed key', fakeAsync(() => {
      component.suggestions = [{
        suggestionText: 'deserve',
        suggestionObject: { a: 'attract' },
      }, {
        suggestionText: 'the',
        suggestionObject: { a: 'vessel' },
      }, {
        suggestionText: 'fruit',
        suggestionObject: { a: 'polish' },
      }, {
        suggestionText: 'deer',
        suggestionObject: { a: 'tie' },
      }, {
        suggestionText: 'valuable',
        suggestionObject: { a: 'clothe' },
      }];
      for (let i = 0; i < component.suggestions.length; i++) {
        const event = new KeyboardEvent('keydown', {
          'key': `F${ i + 1 }`,
        });
        document.dispatchEvent(event);
        spectator.detectChanges();
        expect(hotKeyTriggerFunctionSpy).toHaveBeenCalledWith(component.suggestions[i].suggestionObject);
      }
    }));
  });
});
