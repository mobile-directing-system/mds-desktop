import { IntelCreationService } from './intel-creation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { IntelService } from './intel.service';
import { AddressBookService } from './addressbook.service';
import { CreateIntel, IntelType } from '../model/intel';
import { Importance } from '../model/importance';
import { fakeAsync, tick } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { OperationService } from './operation.service';
import { CoreModule } from '../core.module';
import { SearchResult } from '../util/store';
import { AddressBookEntry } from '../model/address-book-entry';

describe('IntelCreationService', () => {
  let spectator: SpectatorService<IntelCreationService>;
  const createService = createServiceFactory({
    service: IntelCreationService,
    imports: [
      CoreModule,
    ],
    mocks: [
      IntelService,
      AddressBookService,
      OperationService,
    ],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('addCreateIntel', () => {
    const sampleCreateIntel: CreateIntel = {
      type: IntelType.PlainTextMessage,
      importance: Importance.Regular,
      initialDeliverTo: ['army'],
      operation: 'poor',
      content: {
        text: 'age',
      },
    };

    const sampleAddressBookEntry: AddressBookEntry = {
      id: 'army',
      label: 'support',
      description: 'down',
      operation: 'poor',
    };

    it('should add the given intel to the list and retrieve the contained address book entry', fakeAsync(() => {
      const getSpy = spectator.inject(AddressBookService).getAddressBookEntryById.and.returnValue(of(sampleAddressBookEntry));
      spectator.service.addCreateIntel(sampleCreateIntel);
      tick();

      expect(spectator.service.intelInCreation.length === 1);
      expect(spectator.service.intelInCreation.includes(sampleCreateIntel));
      expect(getSpy).toHaveBeenCalledOnceWith('army');
      expect(spectator.service.loadedEntries.includes(sampleAddressBookEntry));
    }));
  });

  describe('sendIntelInCreation', () => {
    const sampleCreateIntel: CreateIntel[] = [{
      type: IntelType.PlainTextMessage,
      importance: Importance.Regular,
      initialDeliverTo: ['army'],
      operation: 'poor',
      content: {
        text: 'age',
      },
    }, {
      type: IntelType.AnalogRadioMessage,
      importance: Importance.Regular,
      initialDeliverTo: ['army'],
      operation: 'poor',
      content: {
        callsign: 'balance',
        head: 'fair',
        channel: 'mixture',
        content: 'soon',
      },
    }];

    it('should call intel service and clear list of createIntel', fakeAsync(() => {
      const postSpy = spectator.inject(IntelService).createIntel.and.returnValue(of(void 0));
      spectator.service.intelInCreation = sampleCreateIntel;
      spectator.service.sendIntelInCreation();
      tick();

      expect(postSpy).toHaveBeenCalledTimes(2);
      expect(spectator.service.intelInCreation.length === 0);
    }));
  });

  describe('getLoadedAddressBookEntryById', () => {
    const sampleLoadedAddressBookEntries: AddressBookEntry[] = [{
      id: 'captain',
      label: 'aside',
      description: 'consider',
    }, {
      id: 'pet',
      label: 'list',
      description: 'roll',
      operation: 'veil',
    }, {
      id: 'captain',
      label: 'warm',
      description: 'trap',
      user: 'mystery',
    }];

    it('should return the address book entry with the given id', fakeAsync(() => {
      spectator.service.loadedEntries = sampleLoadedAddressBookEntries;
      let foundEntry = spectator.service.getLoadedAddressBookEntryById('captain');
      tick();
      expect(foundEntry).toBeTruthy();
      expect(foundEntry).toEqual({
        id: 'captain',
        label: 'aside',
        description: 'consider',
      });
    }));

    it('should return undefined if no address book entry has been loaded with the given id', fakeAsync(() => {
      spectator.service.loadedEntries = sampleLoadedAddressBookEntries;
      let foundEntry = spectator.service.getLoadedAddressBookEntryById('bite');
      tick();
      expect(foundEntry).not.toBeTruthy();
    }));
  });

  describe('searchAddressBookEntries', () => {
    const sampleEntry: AddressBookEntry = {
      id: 'skirt',
      label: 'educator',
      description: 'temple',
    };

    it('should call AddressBookService and return correct value', fakeAsync(async () => {
      spectator.inject(AddressBookService).searchAddressBookEntries.and.returnValue(of(new SearchResult([sampleEntry], {
        estimatedTotalHits: 1,
        offset: 0,
        limit: 5,
        query: '',
        processingTime: 10,
      })));
      let searchAddressBookEntryResult = await firstValueFrom(spectator.service.searchAddressBookEntry(''));
      expect(searchAddressBookEntryResult).toEqual([sampleEntry]);
      expect(spectator.inject(AddressBookService).searchAddressBookEntries).toHaveBeenCalledWith({
        query: '',
        limit: 5,
        offset: 0,
      }, {});
    }));
  });
});
