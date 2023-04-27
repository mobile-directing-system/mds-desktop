import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { AngularMaterialModule } from '../../util/angular-material.module';
import { IntelTypeInlineComponent } from './intel-type-inline.component';
import { IntelType } from '../../model/intel';

describe('IntelTypeInlineComponent', () => {
  let spectator: Spectator<IntelTypeInlineComponent>;
  let component: IntelTypeInlineComponent;
  const createComponent = createComponentFactory({
    component: IntelTypeInlineComponent,
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

  it('should display unknown-placeholder for no intelType being set', () => {
    expect(spectator.query('mat-icon')).withContext('display icon').toBeVisible();
    expect(spectator.query(byTextContent('not set', {
      exact: false,
      selector: 'div',
    }))).withContext('display text').toBeVisible();
  });

  it('should display unknown-placeholder for unknown intelType', async () => {
    component.intelType = '123456789' as IntelType;
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('mat-icon')).withContext('display icon').toBeVisible();
    expect(spectator.query(byTextContent('unknown', {
      exact: false,
      selector: 'div',
    }))).withContext('display text').toBeVisible();
  });

  describe('intelType', () => {
    let usedLabels: string[] = [];
    beforeAll(() => {
      usedLabels = [];
    });

    Object.values(IntelType).filter(i => isNaN(+i)).forEach(intelType => {
      describe(`${ intelType }`, () => {
        beforeEach(async () => {
          component.intelType = intelType;
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
          const label = spectator.query('div.intel-type div span');
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
