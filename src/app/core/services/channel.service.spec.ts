import { appChannelFromNet, ChannelService, NetChannel, netChannelFromApp } from './channel.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NetService } from './net.service';
import { Channel, ChannelType, RadioChannel } from '../model/channel';
import { Importance } from '../model/importance';
import * as moment from 'moment';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ChannelService', () => {
  let spectator: SpectatorService<ChannelService>;
  let service: ChannelService;
  const createService = createServiceFactory({
    service: ChannelService,
    mocks: [NetService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapping', () => {

    describe('radio-channel', () => {
      const net: NetChannel = {
        id: 'ray',
        entry: 'forgive',
        is_active: false,
        label: 'leg',
        type: ChannelType.Radio,
        priority: 200,
        min_importance: Importance.Strike,
        timeout: 200 * 1000 * 1000 * 1000, // 200 Seconds.
        details: {
          info: 'saddle',
        },
      };
      const app: RadioChannel = {
        id: 'ray',
        entry: 'forgive',
        isActive: false,
        label: 'leg',
        type: ChannelType.Radio,
        priority: 200,
        minImportance: Importance.Strike,
        timeout: moment.duration({
          seconds: 200,
        }),
        details: {
          info: 'saddle',
        },
      };

      it('should map from net to app correctly', () => {
        expect(appChannelFromNet(net)).toEqual(app);
      });

      it('should map from app to net correctly', () => {
        expect(netChannelFromApp(app)).toEqual(net);
      });
    });
  });

  describe('getChannelsByAddressBookEntry', () => {
    const entryId = 'miss';
    const netChannels = [
      {
        id: 'queen',
        entry: entryId,
        is_active: true,
        label: 'rejoice',
        type: ChannelType.Radio,
        priority: 200,
        min_importance: Importance.Strike,
        timeout: 200 * 1000 * 1000, // 200 Milliseconds.
        details: {
          info: 'channel 0',
        },
      },
      {
        id: 'object',
        entry: entryId,
        is_active: false,
        label: 'every',
        type: ChannelType.Radio,
        priority: 50,
        min_importance: Importance.None,
        timeout: 20 * 60 * 1000 * 1000 * 1000, // 20 Minutes.
        details: {
          info: 'channel 1'
        },
      },
    ];
    const expectChannels: Channel[] = [
      {
        id: 'queen',
        entry: entryId,
        isActive: true,
        label: 'rejoice',
        type: ChannelType.Radio,
        priority: 200,
        minImportance: Importance.Strike,
        timeout: moment.duration({
          milliseconds: 200,
        }),
        details: {
          info: 'channel 0',
        },
      },
      {
        id: 'object',
        entry: entryId,
        isActive: false,
        label: 'every',
        type: ChannelType.Radio,
        priority: 50,
        minImportance: Importance.None,
        timeout: moment.duration({
          minutes: 20,
        }),
        details: {
          info: 'channel 1'
        },
      },
    ];

    it('should return correct channels upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netChannels));
      const cbSpy = jasmine.createSpy();

      spectator.service.getChannelsByAddressBookEntry(entryId).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith(`/address-book/entries/${ entryId }/channels`, {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectChannels);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = jasmine.createSpy();

      spectator.service.getChannelsByAddressBookEntry(entryId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });


  describe('updateChannelsByAddressBookEntry', () => {
    const entryId = 'miss';
    const channels: Channel[] = [
      {
        id: 'queen',
        entry: entryId,
        isActive: false,
        label: 'rejoice',
        type: ChannelType.Radio,
        priority: 200,
        minImportance: Importance.Strike,
        timeout: moment.duration({
          milliseconds: 200,
        }),
        details: {
          info: 'army',
        },
      },
      {
        id: 'object',
        entry: entryId,
        isActive: true,
        label: 'every',
        type: ChannelType.Radio,
        priority: 50,
        minImportance: Importance.None,
        timeout: moment.duration({
          minutes: 20,
        }),
        details: {
          info: 'test'
        },
      },
    ];
    const netChannels = [
      {
        id: 'queen',
        entry: entryId,
        is_active: false,
        label: 'rejoice',
        type: ChannelType.Radio,
        priority: 200,
        min_importance: Importance.Strike,
        timeout: 200 * 1000 * 1000, // 200 Milliseconds.
        details: {
          info: 'army',
        },
      },
      {
        id: 'object',
        entry: entryId,
        is_active: true,
        label: 'every',
        type: ChannelType.Radio,
        priority: 50,
        min_importance: Importance.None,
        timeout: 20 * 60 * 1000 * 1000 * 1000, // 20 Minutes.
        details: {
          info: 'test'
        },
      },
    ];

    it('should update channels correctly', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(of(void 0));
      const cbSpy = jasmine.createSpy();

      spectator.service.updateChannelsByAddressBookEntry(entryId, channels).subscribe({ next: cbSpy });
      tick();

      expect(putSpy).withContext('should perform correct net call')
        .toHaveBeenCalledOnceWith(`/address-book/entries/${ entryId }/channels`, netChannels, {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(void 0);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = jasmine.createSpy();

      spectator.service.updateChannelsByAddressBookEntry(entryId, channels).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });
});
