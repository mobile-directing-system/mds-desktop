import { CreateAddressBookEntryView } from './create-address-book-entry-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';
import { OperationService } from '../../../../core/services/operation.service';
import { AddressBookService } from '../../../../core/services/addressbook.service';
import { LogisticsModule } from '../../logistics.module';
import { User } from '../../../../core/model/user';
import { Operation } from '../../../../core/model/operation';
import { firstValueFrom, of, throwError } from 'rxjs';
import { SearchResult } from '../../../../core/util/store';
import { fakeAsync, tick } from '@angular/core/testing';

function genFactoryOptions(): SpectatorRoutingOptions<CreateAddressBookEntryView> {
  return {
    component: CreateAddressBookEntryView,
    imports: [
      LogisticsModule,
    ],
    mocks: [
      NotificationService,
      AddressBookService,
      UserService,
      OperationService,
    ],
    detectChanges: false,
  };
}

describe('CreateAddressBookLogisticsView', () => {
  let component: CreateAddressBookEntryView;
  let spectator: SpectatorRouting<CreateAddressBookEntryView>;
  const createComponent = createRoutingFactory(genFactoryOptions());

  const label = 'pipe';
  const description = 'remark';
  const operationId = 'parcel';
  const userId = 'hard';

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
    is_archived: false,
  };

  beforeEach(async () => {
    spectator = createComponent();
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

  it('should disable address book entry creation without values', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should allow address book entry creation with only a label set', fakeAsync(() => {
    component.form.setValue({
      label: label,
      description: '',
      operation: null,
      user: null,
    });
    tick();

    expect(component.form.valid).not.toBeFalse();
  }));

  describe('createEntry', () => {
    it('should create address book entry correctly', fakeAsync(() => {
      component.form.setValue({
        label: label,
        description: description,
        operation: operationId,
        user: userId,
      });
      tick();

      spectator.inject(AddressBookService).createAddressBookEntry.and.returnValue(of({
        id: 'engine',
        label: label,
        description: description,
        operation: operationId,
        user: userId,
        userDetails: sampleUserData[0],
      }));

      component.createEntry();
      tick();
      expect(spectator.inject(AddressBookService).createAddressBookEntry).toHaveBeenCalledOnceWith({
        label: label,
        description: description,
        operation: operationId,
        user: userId,
      });
    }));

    it('should should show error when address book entry creation failed', fakeAsync(() => {
      component.form.setValue({
        label: label,
        description: description,
        operation: operationId,
        user: userId,
      });
      tick();

      spectator.inject(AddressBookService).createAddressBookEntry.and.returnValue(throwError(() => ({})));

      component.createEntry();
      tick();
      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));
  });

  describe('searchUsers', () => {
    it('should call UserService and return correct value', fakeAsync(async () => {
      const result = await firstValueFrom(component.searchUsers(''));
      expect(result).toEqual(sampleUserData);

      expect(spectator.inject(UserService).searchUsers).toHaveBeenCalledWith({
        query: '',
        limit: 5,
        offset: 0,
      }, false);
    }));
  });

  describe('searchOperations', () => {
    it('should call OperationService and return correct value', fakeAsync(async () => {
      let searchOperationsResult = await firstValueFrom(component.searchOperations(''));
      expect(searchOperationsResult).toEqual([sampleOperation]);
      expect(spectator.inject(OperationService).searchOperations).toHaveBeenCalledWith({
        query: '',
        limit: 5,
        offset: 0,
      }, {});
    }));
  });

  describe('fixture', () => {
    it('should show create button, when creation is allowed', fakeAsync(async () => {
      component.form.setValue({
        label: label,
        description: description,
        operation: operationId,
        user: userId,
      });
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
      expect(spectator.query(byTextContent('Create', { selector: 'button' }))).not.toBeDisabled();
    }));

    it('should create address book entry when create button is clicked', fakeAsync(async () => {
      component.form.setValue({
        label: label,
        description: description,
        operation: operationId,
        user: userId,
      });
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
      spyOn(component, 'createEntry');

      spectator.click(byTextContent('Create', { selector: 'button' }));

      expect(component.createEntry).toHaveBeenCalledOnceWith();
    }));
  });
});
