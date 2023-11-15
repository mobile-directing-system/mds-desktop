import { Location } from '@angular/common';
import { fakeAsync, tick } from '@angular/core/testing';
import { SpectatorRouting, SpectatorRoutingOptions, createRoutingFactory } from '@ngneat/spectator';
import moment from 'moment';
import { of } from 'rxjs';
import { Channel, ChannelType } from 'src/app/core/model/channel';
import { Importance } from 'src/app/core/model/importance';
import { Operation } from 'src/app/core/model/operation';
import { Resource } from 'src/app/core/model/resource';
import { User } from 'src/app/core/model/user';
import { ChannelService } from 'src/app/core/services/channel.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { OperationService } from 'src/app/core/services/operation.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { UserService } from 'src/app/core/services/user.service';
import { SearchResult } from 'src/app/core/util/store';
import { ResourcesModule } from '../resources.module';
import { EditResourceComponent } from './edit-resource.component';

describe('EditResourceComponent', () => {

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
        ChannelService,
        Location
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

  const sampleResource: Resource = {
    id: "123",
    label: "Car 123",
    description: "Car resource description",
    operation: sampleOperation.id,
    user: sampleUserData[0].id,
    statusCode: 1,
    incident: "0"
  }

  const sampleChannels: Channel[] = [
    {
      entry: 'develop',
      isActive: true,
      label: 'replace',
      type: ChannelType.Radio,
      priority: 24,
      minImportance: Importance.Regular,
      timeout: moment.duration({ seconds: 45 }),
      details: {
        name: 'channel 1',
        info: 'critic',
      },
    },
  ];

  let component: EditResourceComponent;
  let spectator: SpectatorRouting<EditResourceComponent>;
  let resourceService: ResourceService;

  const createComponent = createRoutingFactory(genFactoryOptions());

  beforeEach(() => {
    spectator = createComponent({
      params: { id: sampleResource.id },
      providers: [
        {
          provide: ResourceService,
          useValue: jasmine.createSpyObj("ResourceService", {
            getResourceById: of(sampleResource),
            updateResource: of(true),
            deleteResourceById: of(true)
          })
        },
        {
          provide: ChannelService,
          useValue: jasmine.createSpyObj("ChannelService", {
            getChannelsByResource: of(sampleChannels),
            updateChannelByResource: of(sampleChannels)
          })
        }
      ],
    });

    component = spectator.component;
    resourceService = spectator.inject(ResourceService);

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

  it('should update resource correctly', fakeAsync(() => {
    let newResource: Resource = {
      ...sampleResource,
      label: "Car 123",
      description: "Car resource description",
      operation: sampleOperation.id,
      user: sampleUserData[0].id,
      statusCode: 2
    }

    component.form.setValue({
      label: newResource.label,
      description: newResource.description,
      operation: newResource.operation!,
      user: newResource.user!,
      statusCode: newResource.statusCode,
      channels: sampleChannels
    });

    component.updateEntry();
    tick();
    expect(resourceService.updateResource).toHaveBeenCalledWith(newResource);
    expect(spectator.inject(ChannelService).updateChannelByResource).toHaveBeenCalledOnceWith(sampleResource.id, sampleChannels);
    expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
  }));

  it('should not update if resource id does not exist', fakeAsync(()=> {
    spectator.inject(ResourceService).getResourceById.and.returnValue(of(undefined));
    component.updateEntry();
    tick();
    expect(resourceService.updateResource).not.toHaveBeenCalled();
  }));

  it('should navigate back when deletion was successful', fakeAsync(()=> {
    spectator.inject(ResourceService).deleteResourceById.and.returnValue(of(true));
    component.delete();
    tick();
    expect(spectator.inject(Location).back).toHaveBeenCalled();
    expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
  }));

  it('should not navigate back when deletion was not successful', fakeAsync(()=> {
    spectator.inject(ResourceService).deleteResourceById.and.returnValue(of(false));
    component.delete();
    tick();
    expect(spectator.inject(Location).back).not.toHaveBeenCalled();
    expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
  }));

  it('should navigate back when close was called', ()=> {
    component.close();
    expect(spectator.inject(Location).back).toHaveBeenCalled();
  });

});
