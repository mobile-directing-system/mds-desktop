import { fakeAsync, tick } from '@angular/core/testing';

import { EditAddressBookEntryView } from './edit-address-book-entry-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { LogisticsModule } from '../../logistics.module';
import { NotificationService } from '../../../../core/services/notification.service';
import { AddressBookService } from '../../../../core/services/addressbook.service';
import { UserService } from '../../../../core/services/user.service';
import { OperationService } from '../../../../core/services/operation.service';
import { User } from '../../../../core/model/user';
import { Operation } from '../../../../core/model/operation';
import { firstValueFrom, of, throwError } from 'rxjs';
import { SearchResult } from '../../../../core/util/store';
import { MatDialog } from '@angular/material/dialog';
import { newMatDialogRefMock } from '../../../../core/testutil/testutil';
import { Router } from '@angular/router';
import { ChannelService } from '../../../../core/services/channel.service';
import { Channel, ChannelType } from '../../../../core/model/channel';
import { Importance } from '../../../../core/model/importance';
import * as moment from 'moment';
import { AccessControlService } from '../../../../core/services/access-control.service';
import { AccessControlMockService } from '../../../../core/services/access-control-mock.service';
import { MockComponent } from 'ng-mocks';
import {
  AddressBookEntryAutoIntelDeliveryComponent,
} from '../address-book-entry-auto-intel-delivery/address-book-entry-auto-intel-delivery.component';
import { CoreModule } from '../../../../core/core.module';
import anything = jasmine.anything;

function genFactoryOptions(): SpectatorRoutingOptions<EditAddressBookEntryView> {
  return {
    component: EditAddressBookEntryView,
    imports: [
      CoreModule,
      LogisticsModule,
    ],
    mocks: [
      NotificationService,
      AddressBookService,
      ChannelService,
      UserService,
      OperationService,
      MatDialog,
    ],
    providers: [
      {
        provide: AccessControlService,
        useClass: AccessControlMockService,
      },
    ],
    declarations: [
      MockComponent(AddressBookEntryAutoIntelDeliveryComponent),
    ],
    params: {
      entryId: 'develop',
    },
    detectChanges: false,
  };
}

describe('EditAddressBookLogisticsView', () => {
  let component: EditAddressBookEntryView;
  let spectator: SpectatorRouting<EditAddressBookEntryView>;
  const createComponent = createRoutingFactory(genFactoryOptions());

  const label = 'pipe';
  const description = 'remark';
  const operationId = 'parcel';
  const userId = 'hard';
  const channels: Channel[] = [
    {
      entry: 'develop',
      isActive: true,
      label: 'replace',
      type: ChannelType.Radio,
      priority: 24,
      minImportance: Importance.Regular,
      timeout: moment.duration({ seconds: 45 }),
      details: {
        info: 'critic',
      },
    },
  ];

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
      isActive: false,
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
    spectator.inject(AddressBookService).getAddressBookEntryById.and.returnValue(of({
      id: 'develop',
      label: label,
      description: description,
      operation: operationId,
      user: userId,
    }));
    spectator.inject(ChannelService).getChannelsByAddressBookEntry.and.returnValue(of(channels));
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateEntry', () => {
    it('should update address book entry correctly', fakeAsync(() => {
      component.form.patchValue({
        label: label,
        description: description,
        operation: operationId,
        user: userId,
      });
      tick();

      spectator.inject(AddressBookService).updateAddressBookEntry.and.returnValue(of(void 0));

      component.updateEntry();
      tick();
      expect(spectator.inject(AddressBookService).updateAddressBookEntry).toHaveBeenCalledOnceWith({
        id: component.entryId,
        label: label,
        description: description,
        operation: operationId,
        user: userId,
      });
    }));

    it('should update channels correctly', fakeAsync(() => {
      component.form.patchValue({
        label: label,
        description: description,
        operation: operationId,
        user: userId,
        channels: channels,
      });
      tick();

      spectator.inject(AddressBookService).updateAddressBookEntry.and.returnValue(of(void 0));

      component.updateEntry();
      tick();
      expect(spectator.inject(ChannelService).updateChannelsByAddressBookEntry)
        .toHaveBeenCalledOnceWith(component.entryId, channels);
    }));

    it('should should show error when updating address book entry failed', fakeAsync(() => {
      component.form.setValue({
        label: label,
        description: description,
        operation: operationId,
        user: userId,
        channels: [],
      });
      tick();

      spectator.inject(AddressBookService).updateAddressBookEntry.and.returnValue(throwError(() => ({})));
      spectator.inject(ChannelService).updateChannelsByAddressBookEntry.and.returnValue(of(void 0));

      component.updateEntry();
      tick();
      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));

    it('should should show error when updating channels failed', fakeAsync(() => {
      component.form.setValue({
        label: label,
        description: description,
        operation: operationId,
        user: userId,
        channels: [],
      });
      tick();

      spectator.inject(AddressBookService).updateAddressBookEntry.and.returnValue(of(void 0));
      spectator.inject(ChannelService).updateChannelsByAddressBookEntry.and.returnValue(throwError(() => ({})));

      component.updateEntry();
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
    it('should show update button, when updating is allowed', fakeAsync(async () => {
      component.form.setValue({
        label: label,
        description: description,
        operation: operationId,
        user: userId,
        channels: channels,
      });
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
      expect(spectator.query(byTextContent('Update', { selector: 'button' }))).not.toBeDisabled();
    }));

    it('should update address book entry, when update button is clicked', fakeAsync(async () => {
      component.form.setValue({
        label: label,
        description: description,
        operation: operationId,
        user: userId,
        channels: channels,
      });
      tick();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
      spyOn(component, 'updateEntry');

      spectator.click(byTextContent('Update', { selector: 'button' }));

      expect(component.updateEntry).toHaveBeenCalledOnceWith();
    }));

    it('should delete the entry when delete button is clicked', async () => {
      spectator.inject(MatDialog).open.and.returnValue(newMatDialogRefMock(true));
      spectator.inject(AddressBookService).deleteAddressBookEntry.and.returnValue(of(void 0));

      spectator.click(byTextContent('Delete', {
        exact: false,
        selector: 'button',
      }));
      await spectator.fixture.whenStable();

      expect(spectator.inject(AddressBookService).deleteAddressBookEntry).toHaveBeenCalledOnceWith('develop');
      expect(spectator.inject(Router).navigate).toHaveBeenCalledOnceWith(['..'], anything());
    });
  });
});
