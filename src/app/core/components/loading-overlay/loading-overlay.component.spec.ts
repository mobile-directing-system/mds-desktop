import { LoadingOverlayComponent } from './loading-overlay.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';

describe('LoadingOverlayComponent', () => {
  let spectator: Spectator<LoadingOverlayComponent>;
  let component: LoadingOverlayComponent;
  const createComponent = createComponentFactory({
    component: LoadingOverlayComponent,
    imports: [CoreModule],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
