import { KeyInfoBarComponent } from './key-info-bar.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';

describe('KeyInfoBarComponent.integration', () => {
  let spectator: Spectator<KeyInfoBarComponent>;
  const createComponent = createComponentFactory({
    component: KeyInfoBarComponent,
    imports: [
      CoreModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
