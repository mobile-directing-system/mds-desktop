import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { AngularMaterialModule } from '../../util/angular-material.module';
import { ImportanceInlineComponent } from './importance-inline.component';
import { Importance } from '../../model/importance';

describe('ImportanceInlineComponent', () => {
  let spectator: Spectator<ImportanceInlineComponent>;
  let component: ImportanceInlineComponent;
  const createComponent = createComponentFactory({
    component: ImportanceInlineComponent,
    imports: [CoreModule, AngularMaterialModule],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display unknown-placeholder for no importance being set', () => {
    expect(spectator.query('mat-icon')).withContext('display icon').toBeVisible();
    expect(spectator.query(byTextContent('not set', {
      exact: false,
      selector: 'div',
    }))).withContext('display text').toBeVisible();
  });

  it('should display unknown-placeholder for unknown importance', async () => {
    component.importance = 123456789 as Importance;
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('mat-icon')).withContext('display icon').toBeVisible();
    expect(spectator.query(byTextContent('unknown', {
      exact: false,
      selector: 'div',
    }))).withContext('display text').toBeVisible();
  });

  describe('importance', () => {
    let usedLabels: string[] = [];
    beforeAll(() => {
      usedLabels = [];
    });

    Object.values(Importance).filter(i => !isNaN(+i)).forEach(importance => {
      describe(`${Importance[importance as number]}`, () => {
        beforeEach(async () => {
          component.importance = +importance;
          spectator.detectComponentChanges();
          await spectator.fixture.whenStable();
        });

        it('should display icon', () => {
          expect(spectator.query('mat-icon')).withContext('display icon').toBeVisible();
        });

        it('should display label', () => {
          expect(spectator.query('mat-icon')).withContext('display icon').toBeVisible();
          expect(spectator.query(byTextContent('unknown', {
            exact: false,
            selector: 'div',
          }))).withContext('no unknown text').not.toBeVisible();
        });

        it('should not have same label as others', () => {
          const label = spectator.query('div.importance div span');
          expect(label).withContext('show label').toBeVisible();
          if (!label) {
            return;
          }
          expect(usedLabels).withContext('no duplicate label').not.toContain(label.innerHTML);
          usedLabels.push(label.innerHTML);
        });
      });
    });
  });
});
