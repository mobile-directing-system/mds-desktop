import { IntelligenceLayoutComponent } from './intelligence-layout.component';
import { createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { IntelCreationService } from '../../../core/services/intel-creation.service';
import { IntelligenceModule } from '../intelligence.module';

function genFactoryOptions(): SpectatorRoutingOptions<IntelligenceLayoutComponent> {
  return {
    component: IntelligenceLayoutComponent,
    imports: [
      IntelligenceModule,
    ],
    mocks: [
      IntelCreationService,
    ],
    detectChanges: false,
  };
}

describe('IntelligenceLayoutComponent', () => {
  let component: IntelligenceLayoutComponent;
  let spectator: SpectatorRouting<IntelligenceLayoutComponent>;
  const intelInCreationSideNav = createRoutingFactory(genFactoryOptions());

  beforeEach(async () => {
    spectator = intelInCreationSideNav();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
