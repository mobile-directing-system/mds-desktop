import { ListResourcesComponent } from './list-resources.component';
import { ResourcesModule } from '../resources.module';
import { UserService } from 'src/app/core/services/user.service';
import { OperationService } from 'src/app/core/services/operation.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { LocalStorageResourceService } from 'src/app/core/services/resource/local-storage-resource.service';
import { SpectatorRouting, SpectatorRoutingOptions, createRoutingFactory } from '@ngneat/spectator';
import { mockLocalStorage } from 'src/app/core/util/testing';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { LocalStorageIncidentService } from 'src/app/core/services/incident/local-storage-incident.service';

function genFactoryOptions(): SpectatorRoutingOptions<ListResourcesComponent> {
  return {
    component: ListResourcesComponent,
    imports: [
      ResourcesModule,
    ],
    mocks: [
      UserService,
      OperationService
    ],
    providers: [
      {
        provide: ResourceService,
        useClass: LocalStorageResourceService
      },
      {
        provide: IncidentService,
        useClass: LocalStorageIncidentService
      }
    ],
    detectChanges: false,
  };
}

describe('ListResourcesComponent', () => {
  let component: ListResourcesComponent;
  let spectator: SpectatorRouting<ListResourcesComponent>;

  const createComponent = createRoutingFactory(genFactoryOptions());

  beforeEach(async () => {
    spectator = createComponent();
    mockLocalStorage();
    component = spectator.component;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
