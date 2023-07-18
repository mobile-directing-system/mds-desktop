
import { SpectatorRouting, SpectatorRoutingOptions, createRoutingFactory } from '@ngneat/spectator';
import { of } from 'rxjs';
import { Operation } from 'src/app/core/model/operation';
import { User } from 'src/app/core/model/user';
import { AddressBookService } from 'src/app/core/services/addressbook.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { OperationService } from 'src/app/core/services/operation.service';
import { LocalStorageResourceService } from 'src/app/core/services/resource/local-storage-resource.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { UserService } from 'src/app/core/services/user.service';
import { SearchResult } from 'src/app/core/util/store';
import { mockLocalStorage } from 'src/app/core/util/testing';
import { ResourcesModule } from '../resources.module';
import { CreateResourceView } from './create-resource.component';

function genFactoryOptions(): SpectatorRoutingOptions<CreateResourceView> {
  return {
    component: CreateResourceView,
    imports: [
      ResourcesModule,
    ],
    mocks: [
      NotificationService,
      AddressBookService,
      UserService,
      OperationService
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

describe('CreateResourceView', () => {
  let component: CreateResourceView;
  let spectator: SpectatorRouting<CreateResourceView>;

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

  it('should create resource from form correctly', () => {
    component.form.setValue({
      label: "Max",
      description: "Test",
      user: null,
      operation: null
    });

    component.createEntry();
    spectator.inject(ResourceService).getResources().subscribe(resources => {
      expect(resources.length).toBe(1);
      expect(resources[0].label).toBe("Max");
      expect(resources[0].description).toBe("Test");
      expect(resources[0].operation).toBeUndefined();
      expect(resources[0].user).toBeUndefined();
    });
  });
});
