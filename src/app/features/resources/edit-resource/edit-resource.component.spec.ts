import { EditResourceComponent } from './edit-resource.component';
import { SpectatorRouting, SpectatorRoutingOptions, createRoutingFactory } from '@ngneat/spectator';
import { ResourcesModule } from '../resources.module';
import { UserService } from 'src/app/core/services/user.service';
import { OperationService } from 'src/app/core/services/operation.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { LocalStorageResourceService } from 'src/app/core/services/resource/local-storage-resource.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { User } from 'src/app/core/model/user';
import { Operation } from 'src/app/core/model/operation';
import { SearchResult } from 'src/app/core/util/store';
import { of } from 'rxjs';
import { mockLocalStorage } from 'src/app/core/testutil/testutil';
import { ChannelService } from 'src/app/core/services/channel.service';

function genFactoryOptions(): SpectatorRoutingOptions<EditResourceComponent> {
  return {
    component: EditResourceComponent,
    imports: [
      ResourcesModule,
    ],
    mocks: [
      UserService,
      OperationService,
      NotificationService,
      ChannelService
    ],
    providers: [
      {
        provide: ResourceService,
        useClass: LocalStorageResourceService
      }
    ],
    detectChanges: false,
  };
}

const sampleUserData: User[] = [
  {
    id: 'hard',
    username: 'marry',
    firstName: 'well',
    lastName: 'forgive',
    isActive: true,
    isAdmin: false,
  },
  {
    id: 'glass',
    username: 'everyday',
    firstName: 'robbery',
    lastName: 'beak',
    isActive: true,
    isAdmin: false,
  },
  {
    id: 'combine',
    username: 'greet',
    firstName: 'swear',
    lastName: 'real',
    isActive: true,
    isAdmin: false,
  },
];

const sampleOperation: Operation = {
  id: 'parcel',
  title: 'roof',
  description: 'temple',
  start: new Date(),
  isArchived: false,
};

describe('EditResourceComponent', () => {
  let component: EditResourceComponent;
  let spectator: SpectatorRouting<EditResourceComponent>;

  const createComponent = createRoutingFactory(genFactoryOptions());

  beforeEach(async () => {
    spectator = createComponent();
    mockLocalStorage();
    component = spectator.component;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.inject(UserService).getUserById.withArgs('hard').and.returnValue(of(sampleUserData[0]));
    spectator.inject(UserService).getUserById.withArgs('glass').and.returnValue(of(sampleUserData[1]));
    spectator.inject(UserService).getUserById.withArgs('combine').and.returnValue(of(sampleUserData[2]));
    spectator.inject(UserService).searchUsers.and.returnValue(of(new SearchResult(sampleUserData, {
      estimatedTotalHits: 3,
      offset: 0,
      limit: 5,
      query: '',
      processingTime: 10,
    })));
    spectator.inject(OperationService).getOperationById.and.returnValue(of(sampleOperation));
    spectator.inject(OperationService).searchOperations.and.returnValue(of(new SearchResult([sampleOperation], {
      estimatedTotalHits: 1,
      offset: 0,
      limit: 5,
      query: '',
      processingTime: 10,
    })));
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
