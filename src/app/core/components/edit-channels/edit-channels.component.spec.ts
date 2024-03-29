import { MatDialog } from '@angular/material/dialog';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import * as moment from 'moment';
import { CoreModule } from '../../core.module';
import { Channel, ChannelType, defaultChannel, getChannelDetailsText, localizeChannelType } from '../../model/channel';
import { Importance } from '../../model/importance';
import { newMatDialogRefMock } from '../../testutil/testutil';
import {
  ChannelDetailsDialog,
  ChannelDetailsDialogData,
  ChannelDetailsDialogResult,
} from '../channel-details-dialog/channel-details-dialog.component';
import { EditChannelsComponent } from './edit-channels.component';

describe('ChannelsComponent', () => {
  let spectator: Spectator<EditChannelsComponent>;
  let component: EditChannelsComponent;
  const createComponent = createComponentFactory({
    component: EditChannelsComponent,
    imports: [CoreModule],
    mocks: [MatDialog],
    detectChanges: false,
  });
  const entryId = 'paste';
  const sampleChannels: Channel[] = [
    {
      id: 'omission',
      entry: entryId,
      isActive: true,
      label: 'defeat',
      type: ChannelType.Radio,
      priority: 50,
      timeout: moment.duration({ minutes: 2 }),
      minImportance: Importance.None,
      details: {
        name: 'channel 1',
        info: 'channel 1 info'
      },
    },
    {
      id: 'popular',
      entry: entryId,
      isActive: true,
      label: 'continue',
      type: ChannelType.Email,
      priority: 40,
      timeout: moment.duration({ minutes: 5 }),
      minImportance: Importance.None,
      details: {
        email: 'test@example.com',
      },
    },
    {
      id: 'pour',
      entry: entryId,
      isActive: true,
      label: 'inquire',
      type: ChannelType.Phone,
      priority: 10,
      timeout: moment.duration({
        hours: 2,
        minutes: 10,
      }),
      minImportance: Importance.Strike,
      details: {
        phoneNumber: '124896731248',
      },
    },
  ];

  beforeEach(() => {
    spectator = createComponent({
      props: {
        entryId: entryId,
        loading: false,
        disableCreate: false,
      },
    });
    component = spectator.component;
    component.writeValue(sampleChannels);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply written value', () => {
    expect(component.value).withContext('value').toEqual(sampleChannels);
    expect(component.channelsDataSource.data).withContext('data source').toEqual(sampleChannels);
  });

  describe('openChannel', () => {
    it('should open edit-dialog', () => {
      spectator.inject(MatDialog).open.and.returnValue(newMatDialogRefMock(undefined));
      const expectData: ChannelDetailsDialogData = {
        create: false,
        channel: sampleChannels[1],
      };
      component.openChannel(sampleChannels[1]);
      expect(spectator.inject(MatDialog).open).toHaveBeenCalledOnceWith(ChannelDetailsDialog, {
        data: expectData,
      });
    });

    it('should remove channel on delete-action', () => {
      const result: ChannelDetailsDialogResult = {
        action: 'delete',
      };
      spectator.inject(MatDialog).open.and.returnValue(newMatDialogRefMock(result));

      component.openChannel(sampleChannels[1]);

      expect(component.value.length).toBe(sampleChannels.length - 1);
      expect(component.value.find(v => v.id === sampleChannels[1].id)).toBeFalsy();
    });

    it('should update channel on submit-action', () => {
      const update: Channel = {
        ...sampleChannels[1],
        label: 'succeed',
      };
      const result: ChannelDetailsDialogResult = {
        action: 'submit',
        channel: update,
      };
      spectator.inject(MatDialog).open.and.returnValue(newMatDialogRefMock(result));

      component.openChannel(sampleChannels[1]);

      expect(component.value.length).toBe(sampleChannels.length);
      expect(component.value.find(v => v.id === sampleChannels[1].id)).toEqual(update);
    });
  });


  describe('newChannel', () => {
    it('should throw an error when no entry id is set', () => {
      component.entryId = undefined;
      expect(component.newChannel).toThrowError();
    });

    it('should open edit-dialog', () => {
      spectator.inject(MatDialog).open.and.returnValue(newMatDialogRefMock(undefined));
      const expectData: ChannelDetailsDialogData = {
        create: true,
        channel: defaultChannel(entryId),
      };
      component.newChannel();
      expect(spectator.inject(MatDialog).open).toHaveBeenCalledOnceWith(ChannelDetailsDialog, {
        data: expectData,
      });
    });

    it('should add channel on submit-action', () => {
      const create: Channel = {
        entry: entryId,
        isActive: true,
        label: 'sing',
        type: ChannelType.Radio,
        priority: 100,
        timeout: moment.duration({
          hours: 1,
          minutes: 3,
          milliseconds: 10,
        }),
        minImportance: Importance.Urgent,
        details: {
          name: 'channel 2',
          info: 'channel 2 info'
        },
      };
      const expectChannels: Channel[] = [
        ...sampleChannels,
        create,
      ];
      expectChannels.sort((a, b) => b.priority - a.priority);
      const result: ChannelDetailsDialogResult = {
        action: 'submit',
        channel: create,
      };
      spectator.inject(MatDialog).open.and.returnValue(newMatDialogRefMock(result));

      component.newChannel();

      expect(component.value).toEqual(expectChannels);
      expect(component.channelsDataSource.data).toEqual(expectChannels);
    });
  });

  describe('fixture', () => {
    beforeEach(async () => {
      spectator.detectChanges();
      await spectator.fixture.whenStable();
    });

    it('should show a button for creating channels', () => {
      expect(spectator.query(byTextContent('New channel', {
        exact: false,
        selector: 'button',
      }))).toBeVisible();
    });

    it('should create when create-button is clicked', () => {
      const createSpy = spyOn(component, 'newChannel');
      spectator.click(byTextContent('new', {
        exact: false,
        selector: 'button',
      }));
      expect(createSpy).toHaveBeenCalledOnceWith();
    });

    it('should show channel attributes in table', () => {
      sampleChannels.forEach(expectChannel => {
        const attributes = [
          expectChannel.label,
          localizeChannelType(expectChannel.type),
          getChannelDetailsText(expectChannel)
        ];
        attributes.forEach(expectAttribute => {
          expect(spectator.query(byTextContent(expectAttribute, {
            exact: false,
            selector: 'td',
          }))).withContext(`should show channel attribute ${ expectAttribute } of channel ${ expectChannel.id }`).toBeVisible();
        });
      });
    });

    it('should should open dialog when channel-row is clicked', () => {
      const openChannelSpy = spyOn(component, 'openChannel').and.returnValue();
      spectator.click(byTextContent(sampleChannels[1].label, {
        exact: false,
        selector: 'tr',
      }));
      expect(openChannelSpy).toHaveBeenCalledOnceWith(sampleChannels[1]);
    });

    it('should show active-state when active', async () => {
      component.channelsDataSource.data = component.channelsDataSource.data.map(c => ({
        ...c,
        isActive: true,
      }));

      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(spectator.query('div.active-indicator')).toBeVisible();
    });

    it('should show active-state when inactive', async () => {
      component.channelsDataSource.data = component.channelsDataSource.data.map(c => ({
        ...c,
        isActive: false,
      }));

      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(spectator.query('div.active-indicator')).toBeVisible();
    });
  });
});
