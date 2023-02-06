import { ChannelsComponent } from './channels.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../../core/core.module';
import { Channel, ChannelType, defaultChannel, localizeChannelType } from '../../../core/model/channel';
import * as moment from 'moment';
import { Importance, localizeImportance } from '../../../core/model/importance';
import { MatDialog } from '@angular/material/dialog';
import { newMatDialogRefMock } from '../../../core/testutil/testutil';
import {
  ChannelDetailsDialog,
  ChannelDetailsDialogData,
  ChannelDetailsDialogResult,
} from './channel-details-dialog/channel-details-dialog.component';
import { formatEditDuration } from '../../../core/components/duration-picker/duration-picker.component';

describe('ChannelsComponent', () => {
  let spectator: Spectator<ChannelsComponent>;
  let component: ChannelsComponent;
  const createComponent = createComponentFactory({
    component: ChannelsComponent,
    imports: [CoreModule],
    mocks: [MatDialog],
    detectChanges: false,
  });
  const entryId = 'paste';
  const sampleChannels: Channel[] = [
    {
      id: 'omission',
      entry: entryId,
      label: 'defeat',
      type: ChannelType.InAppNotification,
      priority: 50,
      timeout: moment.duration({ minutes: 2 }),
      minImportance: Importance.None,
      details: {},
    },
    {
      id: 'popular',
      entry: entryId,
      label: 'continue',
      type: ChannelType.Radio,
      priority: 40,
      timeout: moment.duration({ minutes: 5 }),
      minImportance: Importance.None,
      details: {
        info: 'inventor',
      },
    },
    {
      id: 'pour',
      entry: entryId,
      label: 'inquire',
      type: ChannelType.Radio,
      priority: 10,
      timeout: moment.duration({
        hours: 2,
        minutes: 10,
      }),
      minImportance: Importance.Strike,
      details: {
        info: 'defeat',
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
        label: 'sing',
        type: ChannelType.Radio,
        priority: 100,
        timeout: moment.duration({
          hours: 1,
          minutes: 3,
          milliseconds: 10,
        }),
        minImportance: Importance.NationalEmergency,
        details: {
          info: 'can',
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
          expectChannel.priority,
          localizeImportance(expectChannel.minImportance),
          formatEditDuration(expectChannel.timeout),
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
  });
});
