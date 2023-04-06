import { IntelFilter, IntelService } from './intel.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NetService } from './net.service';
import { CreateIntel, Intel, IntelType } from '../model/intel';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {
  testGenNetPaginated,
  testGenNetPaginationParams,
  testGenPaginatedFromNet,
  testGenRandomPaginationParams,
} from '../testutil/test-pagination';
import { PaginationParams } from '../util/store';
import createSpy = jasmine.createSpy;

describe('IntelService', () => {
  let spectator: SpectatorService<IntelService>;
  const createService = createServiceFactory({
    service: IntelService,
    mocks: [NetService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  describe('create Intel', () => {
    const create: CreateIntel = {
      operation: 'worship',
      type: IntelType.PlainTextMessage,
      importance: 983,
      content: {
        text: 'purpose',
      },
      initialDeliverTo: ['very', 'health'],
    };

    const netCreated = {
      id: 'bad',
      type: IntelType.PlainTextMessage,
      created_at: new Date(257, 8, 3),
      created_by: 'stroke',
      operation: 'worship',
      content: {
        text: 'purpose',
      },
      search_text: 'homemade',
      importance: 983,
      is_valid: true,
    };

    const expectedIntel: Intel = {
      id: 'bad',
      type: IntelType.PlainTextMessage,
      createdAt: new Date(257, 8, 3),
      createdBy: 'stroke',
      operation: 'worship',
      content: {
        text: 'purpose',
      },
      searchText: 'homemade',
      importance: 983,
      isValid: true,
    };

    it('should create intel correctly', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(of(netCreated));
      const cbSpy = createSpy();

      spectator.service.createIntel(create).subscribe({ next: cbSpy });
      tick();

      expect(postSpy).withContext('should perform correct next call').toHaveBeenCalledOnceWith('/intel', {
        operation: create.operation,
        type: create.type,
        content: create.content,
        importance: create.importance,
        initial_deliver_to: create.initialDeliverTo,
      }, {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectedIntel);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(throwError(() => new Error('something went wrong')));
      const cbSpy = createSpy();

      spectator.service.createIntel(create).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('invalidateIntel', () => {
    const intelId = 'resign';

    it('should invalidate intel correctly', fakeAsync(() => {
      const deleteSpy = spectator.inject(NetService).postJSON.and.returnValue(of(undefined));

      spectator.service.invalidateIntel(intelId).subscribe();
      tick();

      expect(deleteSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/intel/resign/invalidate', {}, {});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const deleteSpy = spectator.inject(NetService).postJSON.and.returnValue(throwError(() => new Error('something went wrong')));
      const cbSpy = createSpy();

      spectator.service.invalidateIntel(intelId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('getIntelById', () => {
    const intelId = 'have';

    const netIntel = {
      id: 'have',
      type: IntelType.AnalogRadioMessage,
      created_at: new Date(257, 8, 3),
      created_by: 'stroke',
      operation: 'worship',
      content: {
        channel: 'liberty',
        callsign: 'push',
        head: 'electric',
        content: 'drag',
      },
      search_text: 'homemade',
      importance: 983,
      is_valid: true,
    };


    const expectedIntel: Intel = {
      id: 'have',
      createdAt: new Date(257, 8, 3),
      createdBy: 'stroke',
      operation: 'worship',
      type: IntelType.AnalogRadioMessage,
      content: {
        channel: 'liberty',
        callsign: 'push',
        head: 'electric',
        content: 'drag',
      },
      searchText: 'homemade',
      importance: 983,
      isValid: true,
    };
    it('should return the correct intel upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netIntel));
      const cbSpy = createSpy();

      spectator.service.getIntelById(intelId).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/intel/have', {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectedIntel);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('something went wrong')));
      const cbSpy = createSpy();

      spectator.service.getIntelById(intelId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });
  describe('getGroups', () => {
    const netIntel = [
      {
        id: 'comfort',
        type: IntelType.PlainTextMessage,
        created_at: new Date(2596, 8, 3),
        created_by: 'new',
        operation: 'dry',
        content: {
          text: 'bend',
        },
        search_text: 'lid',
        importance: 983,
        is_valid: true,
      },
      {
        id: 'bad',
        type: IntelType.PlainTextMessage,
        created_at: new Date(2527, 8, 4),
        created_by: 'stroke',
        operation: 'worship',
        content: {
          text: 'purpose',
        },
        search_text: 'homemade',
        importance: 944,
        is_valid: true,
      },
      {
        id: 'have',
        type: IntelType.AnalogRadioMessage,
        created_at: new Date(2517, 12, 3),
        created_by: 'stroke',
        operation: 'worship',
        content: {
          channel: 'liberty',
          callsign: 'push',
          head: 'electric',
          content: 'drag',
        },
        search_text: 'homemade',
        importance: 366,
        is_valid: true,
      },
    ];

    const params = testGenRandomPaginationParams<any>();
    const filter: IntelFilter = {
      createdBy: 'bath',
      operation: 'amuse',
      intelType: IntelType.AnalogRadioMessage,
      minImportance: 350,
      includeInvalid: false,
      oneOfDeliveryForEntries: ['tongue', 'empire', 'today', 'plaster', 'vote'],
      oneOfDeliveredToEntries: ['tongue', 'empire', 'today', 'plaster', 'vote'],
    };
    const netParams = {
      orderBy: params.orderBy,
      limit: params.limit,
      offset: params.offset,
      orderDir: params.orderDir,
      createdBy: filter.createdBy,
      operation: filter.operation,
      intelType: filter.intelType,
      minImportance: filter.minImportance,
      includeInvalid: filter.includeInvalid,
      oneOfDeliveryForEntries: filter.oneOfDeliveryForEntries,
      oneOfDeliveredToEntries: filter.oneOfDeliveredToEntries,
    };
    const netPaginatedFilter = testGenNetPaginated(PaginationParams.from(netParams), undefined, netIntel);
    const netPaginated = testGenNetPaginated(params, undefined, netIntel);

    it('should return correct group list upon retrieval, with filter active', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginatedFilter));
      const cbSpy = createSpy();

      spectator.service.getIntel(params, filter).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).toHaveBeenCalledOnceWith('/intel', {
        ...testGenNetPaginationParams(PaginationParams.from(netParams), undefined),
        created_by: 'bath',
        operation: 'amuse',
        intel_type: IntelType.AnalogRadioMessage,
        min_importance: 350,
        include_invalid: false,
        one_of_delivery_for_entries: ['tongue', 'empire', 'today', 'plaster', 'vote'],
        one_of_delivered_to_entries: ['tongue', 'empire', 'today', 'plaster', 'vote'],
      });
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenPaginatedFromNet<any>(netPaginatedFilter, undefined, [
        {
          id: 'comfort',
          type: IntelType.PlainTextMessage,
          createdAt: new Date(2596, 8, 3),
          createdBy: 'new',
          operation: 'dry',
          content: {
            text: 'bend',
          },
          searchText: 'lid',
          importance: 983,
          isValid: true,
        },
        {
          id: 'bad',
          type: IntelType.PlainTextMessage,
          createdAt: new Date(2527, 8, 4),
          createdBy: 'stroke',
          operation: 'worship',
          content: {
            text: 'purpose',
          },
          searchText: 'homemade',
          importance: 944,
          isValid: true,
        },
        {
          id: 'have',
          type: IntelType.AnalogRadioMessage,
          createdAt: new Date(2517, 12, 3),
          createdBy: 'stroke',
          operation: 'worship',
          content: {
            channel: 'liberty',
            callsign: 'push',
            head: 'electric',
            content: 'drag',
          },
          searchText: 'homemade',
          importance: 366,
          isValid: true,
        },
      ]));
    }));

    it('should return correct group list upon retrieval, without filter active', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginated));
      const cbSpy = createSpy();

      spectator.service.getIntel(params, {}).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).toHaveBeenCalledOnceWith('/intel', {
        ...testGenNetPaginationParams(params, undefined),
        created_by: undefined,
        operation: undefined,
        intel_type: undefined,
        min_importance: undefined,
        include_invalid: undefined,
        one_of_delivery_for_entries: undefined,
        one_of_delivered_to_entries: undefined,
      });
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenPaginatedFromNet<Intel>(netPaginated, undefined, [
        {
          id: 'comfort',
          type: IntelType.PlainTextMessage,
          createdAt: new Date(2596, 8, 3),
          createdBy: 'new',
          operation: 'dry',
          content: {
            text: 'bend',
          },
          searchText: 'lid',
          importance: 983,
          isValid: true,
        },
        {
          id: 'bad',
          type: IntelType.PlainTextMessage,
          createdAt: new Date(2527, 8, 4),
          createdBy: 'stroke',
          operation: 'worship',
          content: {
            text: 'purpose',
          },
          searchText: 'homemade',
          importance: 944,
          isValid: true,
        },
        {
          id: 'have',
          type: IntelType.AnalogRadioMessage,
          createdAt: new Date(2517, 12, 3),
          createdBy: 'stroke',
          operation: 'worship',
          content: {
            channel: 'liberty',
            callsign: 'push',
            head: 'electric',
            content: 'drag',
          },
          searchText: 'homemade',
          importance: 366,
          isValid: true,
        },
      ]));
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.getIntel(params, {}).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

});
