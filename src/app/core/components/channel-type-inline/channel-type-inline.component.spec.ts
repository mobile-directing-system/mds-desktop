import { ChannelTypeInlineComponent } from './channel-type-inline.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { AngularMaterialModule } from '../../util/angular-material.module';
import { ChannelType } from '../../model/channel';

describe('ChannelTypeInlineComponent', () => {
  let spectator: Spectator<ChannelTypeInlineComponent>;
  let component: ChannelTypeInlineComponent;
  const createComponent = createComponentFactory({
    component: ChannelTypeInlineComponent,
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

  it('should display unknown-placeholder for no channel type being set', () => {
    expect(spectator.query('mat-icon')).withContext('display icon').toBeVisible();
    expect(spectator.query(byTextContent('not set', {
      exact: false,
      selector: 'div',
    }))).withContext('display text').toBeVisible();
  });

  it('should display unknown-placeholder for unknown channel type', async () => {
    component.channelType = 'i-am-unknown' as ChannelType;
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('mat-icon')).withContext('display icon').toBeVisible();
    expect(spectator.query(byTextContent('unknown', {
      exact: false,
      selector: 'div',
    }))).withContext('display text').toBeVisible();
  });

  describe('channel types', () => {
    let usedLabels: string[] = [];
    beforeAll(() => {
      usedLabels = [];
    });

    Object.values(ChannelType).forEach(channelType => {
      describe(channelType, () => {
        beforeEach(async () => {
          component.channelType = channelType;
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
          const label = spectator.query('div.channel-type div span');
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
