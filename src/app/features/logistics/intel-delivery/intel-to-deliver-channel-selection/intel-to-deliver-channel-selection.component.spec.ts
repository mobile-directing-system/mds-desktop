import { IntelToDeliverChannelSelectionComponent } from './intel-to-deliver-channel-selection.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../../../core/core.module';
import { IntelDeliveryModule } from '../intel-delivery.module';
import { ChannelService } from '../../../../core/services/channel.service';
import { IntelDeliveryService } from '../../../../core/services/intel-delivery.service';
import { ManualIntelDeliveryMockService } from '../../../../core/services/manual-intel-delivery-mock.service';
import {
  DetailedOpenIntelDelivery,
  ManualIntelDeliveryService,
} from '../../../../core/services/manual-intel-delivery.service';
import { Channel, ChannelType } from '../../../../core/model/channel';
import { Importance } from '../../../../core/model/importance';
import * as moment from 'moment';
import { IntelDeliveryAttempt, IntelDeliveryAttemptStatus } from '../../../../core/model/intel-delivery';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

function genChannel(): Channel {
  return {
    id: 'fair' + Math.round(Math.random() * 10000),
    label: 'ago',
    isActive: true,
    priority: Math.random() * 100,
    entry: 'direct',
    type: ChannelType.Radio,
    details: {
      info: 'channel 3'
    },
    timeout: moment.duration({ seconds: 1 }),
    minImportance: Importance.Low,
  };
}

function genAttempt(): IntelDeliveryAttempt {
  return {
    id: 'bend',
    channel: 'cap',
    statusTS: new Date(),
    isActive: false,
    status: IntelDeliveryAttemptStatus.Timeout,
    createdAt: new Date(),
    delivery: 'meantime',
  };
}

describe('IntelToDeliverChannelSelectionComponent', () => {
  let spectator: Spectator<IntelToDeliverChannelSelectionComponent>;
  let component: IntelToDeliverChannelSelectionComponent;
  const createComponent = createComponentFactory({
    component: IntelToDeliverChannelSelectionComponent,
    imports: [
      CoreModule,
      IntelDeliveryModule,
    ],
    mocks: [
      ChannelService,
      IntelDeliveryService,
    ],
    detectChanges: false,
  });
  let manualIntelDeliveryService = new ManualIntelDeliveryMockService();
  let selected: DetailedOpenIntelDelivery;
  let channels: Channel[] = [genChannel()];
  let attempts: IntelDeliveryAttempt[] = [];

  beforeEach(async () => {
    manualIntelDeliveryService = new ManualIntelDeliveryMockService();
    selected = {
      delivery: {
        delivery: {
          id: 'smoke',
          intel: 'homemade',
          to: 'bleed',
          note: 'blood',
        },
        intel: {
          id: 'homemade',
          operation: 'stuff',
          importance: Importance.Regular,
          createdAt: new Date(Date.parse('2023-04-24T13:15:20Z')),
          createdBy: 'count',
          isValid: true,
        },
      },
    };

    spectator = createComponent({
      providers: [
        {
          provide: ManualIntelDeliveryService,
          useValue: manualIntelDeliveryService,
        },
      ],
    });
    component = spectator.component;
    manualIntelDeliveryService.selected.next(selected);
    spectator.inject(ChannelService).getChannelsByAddressBookEntry.and.returnValue(of(channels));
    spectator.inject(IntelDeliveryService).getIntelDeliveryAttemptsByDelivery.and.returnValue(of(attempts));
    spectator.detectChanges();
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should offer all channels', () => {
    expect(component.recommendedChannels).toBeTruthy();
    expect(component.otherChannels).toBeTruthy();
    expect(component.recommendedChannels!.length + component.otherChannels!.length).toEqual(channels.length);
  });

  describe('channel-offer', () => {
    it('should not recommend channels with failed attempts', fakeAsync(() => {
      channels = [genChannel(), genChannel(), genChannel()];
      attempts = [{
        ...genAttempt(),
        channel: channels[1].id!,
      }];
      spectator.inject(ChannelService).getChannelsByAddressBookEntry.and.returnValue(of(channels));
      spectator.inject(IntelDeliveryService).getIntelDeliveryAttemptsByDelivery.and.returnValue(of(attempts));

      manualIntelDeliveryService.selected.next(selected);
      tick();

      const expectRecommended = channels.map(c => c.id).filter(id => id !== channels[1].id);
      const expectOthers = [channels[1].id];
      expect(component.recommendedChannels?.map(c => c.channel.id)).toEqual(jasmine.arrayWithExactContents(expectRecommended));
      expect(component.otherChannels?.map(c => c.channel.id)).toEqual(jasmine.arrayWithExactContents(expectOthers));
    }));

    it('should not recommend channels not matching minimum importance', fakeAsync(() => {
      const expectRecommended: string[] = [];
      const expectOthers: string[] = [];
      channels = [];
      const addChannel = (minImportanceOK: boolean): void => {
        const c: Channel = {
          ...genChannel(),
          minImportance: minImportanceOK ? selected.delivery.intel.importance : selected.delivery.intel.importance + 100,
        };
        channels.push(c);
        if (minImportanceOK) {
          expectRecommended.push(c.id!);
        } else {
          expectOthers.push(c.id!);
        }
      };
      addChannel(false);
      addChannel(true);
      addChannel(false);
      addChannel(true);
      addChannel(false);
      addChannel(false);
      addChannel(true);
      spectator.inject(ChannelService).getChannelsByAddressBookEntry.and.returnValue(of(channels));

      manualIntelDeliveryService.selected.next(selected);
      tick();

      expect(component.recommendedChannels?.map(c => c.channel.id)).toEqual(jasmine.arrayWithExactContents(expectRecommended));
      expect(component.otherChannels?.map(c => c.channel.id)).toEqual(jasmine.arrayWithExactContents(expectOthers));
    }));

    it('should not recommend inactive channels', fakeAsync(() => {
      const expectRecommended: string[] = [];
      const expectOthers: string[] = [];
      channels = [];
      const addChannel = (isActive: boolean): void => {
        const c: Channel = {
          ...genChannel(),
          isActive: isActive,
        };
        channels.push(c);
        if (isActive) {
          expectRecommended.push(c.id!);
        } else {
          expectOthers.push(c.id!);
        }
      };
      addChannel(false);
      addChannel(true);
      addChannel(true);
      addChannel(false);
      addChannel(false);
      addChannel(false);
      addChannel(true);
      spectator.inject(ChannelService).getChannelsByAddressBookEntry.and.returnValue(of(channels));

      manualIntelDeliveryService.selected.next(selected);
      tick();

      expect(component.recommendedChannels?.map(c => c.channel.id)).toEqual(jasmine.arrayWithExactContents(expectRecommended));
      expect(component.otherChannels?.map(c => c.channel.id)).toEqual(jasmine.arrayWithExactContents(expectOthers));
    }));
  });

  describe('select', () => {
    let channelIds: string[] = [];
    beforeEach(fakeAsync(() => {
      channels = [
        genChannel(),
        genChannel(),
        genChannel(),
      ];
      spectator.inject(ChannelService).getChannelsByAddressBookEntry.and.returnValue(of(channels));
      manualIntelDeliveryService.selected.next(selected);
      tick();
      if (!component.recommendedChannels) {
        fail('expected recommended channels to be set');
        return;
      }
      expect(component.recommendedChannels.length).toEqual(channels.length);
      channelIds = component.recommendedChannels.map(c => c.channel.id!);
      component.select(channelIds[0]);
    }));

    it('should select the next one correctly', () => {
      component.select(channelIds[0]);
      component.selectNext();
      expect(component.selected).toEqual(channelIds[1]);
    });

    it('should select the previous one correctly', () => {
      component.select(channelIds[1]);
      component.selectPrev();
      expect(component.selected).toEqual(channelIds[0]);
    });

    it('should handle out of bounds with next correctly', () => {
      component.select(channelIds[0]);
      component.selectNext();
      component.selectNext();
      component.selectNext();
      component.selectNext();
      component.selectNext();
      expect(component.selected).toEqual(channelIds[2]);
    });

    it('should handle out of bounds with previous correctly', () => {
      component.select(channelIds[1]);
      component.selectPrev();
      component.selectPrev();
      component.selectPrev();
      component.selectPrev();
      component.selectPrev();
      expect(component.selected).toEqual(channelIds[0]);
    });

    it('should select first correctly', () => {
      component.select(channelIds[1]);
      component.selectFirst();
      expect(component.selected).toEqual(channelIds[0]);
    });
  });

  it('should deliver correctly', () => {
    component.isFocused = true;
    spectator.inject(IntelDeliveryService).scheduleDeliveryAttempt.and.returnValue(of(void 0));
    const expectSelected = component.selected;

    component.deliver();

    expect(spectator.inject(IntelDeliveryService).scheduleDeliveryAttempt)
      .toHaveBeenCalledOnceWith(selected.delivery.delivery.id, expectSelected);
  });

  describe('fixture', () => {
    beforeEach(fakeAsync(() => {
      channels = [
        genChannel(),
        genChannel(),
        genChannel(),
      ];
      spectator.inject(ChannelService).getChannelsByAddressBookEntry.and.returnValue(of(channels));
      manualIntelDeliveryService.selected.next(selected);
      tick();
    }))

    beforeEach(async () => {
      component.select(channels[0].id);
      // Focus.
      spectator.focus('.c');
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
    });

    it('should display selection instructions', () => {
      expect(spectator.query(byTextContent('arrow keys', {
        exact: false,
        selector: 'div',
      }))).toBeVisible();
      expect(spectator.query(byTextContent('ENTER', {
        exact: false,
        selector: 'div',
      }))).toBeVisible();
    });

    it('should select next on arrow down', async () => {
      component.selectFirst();
      spectator.query('.c')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      await spectator.fixture.whenStable();

      expect(component.selected).toEqual(component.recommendedChannels![1].channel.id)
    });

    it('should select prev on arrow up', async () => {
      component.selectFirst();
      component.selectNext();
      spectator.query('.c')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

      await spectator.fixture.whenStable();

      expect(component.selected).toEqual(component.recommendedChannels![0].channel.id)
    });

    it('should select next on arrow right', async () => {
      component.selectFirst();
      spectator.query('.c')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await spectator.fixture.whenStable();

      expect(component.selected).toEqual(component.recommendedChannels![1].channel.id)
    });

    it('should select prev on arrow left', async () => {
      component.selectFirst();
      component.selectNext();
      spectator.query('.c')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      await spectator.fixture.whenStable();

      expect(component.selected).toEqual(component.recommendedChannels![0].channel.id)
    });
  });
});
