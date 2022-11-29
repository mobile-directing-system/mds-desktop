import { ViewComponent } from './view.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';

describe('ViewComponent.integration', () => {
  let spectator: Spectator<ViewComponent>;
  const createComponent = createComponentFactory({
    component: ViewComponent,
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
