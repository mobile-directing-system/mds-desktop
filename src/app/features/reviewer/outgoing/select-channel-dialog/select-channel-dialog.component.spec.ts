
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Spectator, byText, byTextContent, createComponentFactory } from '@ngneat/spectator';
import * as moment from 'moment';
import { of } from 'rxjs';
import { ImportanceInlineComponent } from 'src/app/core/components/importance-inline/importance-inline.component';
import { CoreModule } from 'src/app/core/core.module';
import { Channel, ChannelType } from 'src/app/core/model/channel';
import { Importance } from 'src/app/core/model/importance';
import { Participant } from 'src/app/core/model/message';
import { ChannelService } from 'src/app/core/services/channel.service';
import { MessageRow } from '../outgoing-messages-view/outgoing-messages-view.component';
import { SelectChannelDialog } from './select-channel-dialog.component';

fdescribe('SelectChannelDialog', () => {
  let spectator: Spectator<SelectChannelDialog>;
  let component: SelectChannelDialog;
  let channelService: ChannelService;
  let dialogRef: MatDialogRef<SelectChannelDialog>;

  let exampleRow: MessageRow = {
    messageId: "123",
    priority: 1000,
    createdAt: new Date(),
    content: "New content",
    senderLabel: "Sender label",
    recipientType: Participant.AddressBookEntry,
    recipientId: "12345",
    recipientLabel: "Peter",
    incidentLabel: "Incident label"
  };

  const exampleChannels: Channel[] = [
    {
      id: "1",
      entry: exampleRow.recipientId,
      isActive: true,
      label: "Radio channel 1",
      type: ChannelType.Radio,
      priority: 200,
      minImportance: Importance.Strike,
      timeout: moment.duration({
        seconds: 200,
      }),
      details: {
        info: "some details",
      },
    },
    {
      id: "2",
      entry: exampleRow.recipientId,
      isActive: true,
      label: "Radio channel 2",
      type: ChannelType.Radio,
      priority: 100,
      minImportance: Importance.Strike,
      timeout: moment.duration({
        seconds: 200,
      }),
      details: {
        info: "some other details",
      },
    }
  ];

  const createComponent = createComponentFactory({
    component: SelectChannelDialog,
    imports: [CoreModule],
    mocks: [MatDialogRef<SelectChannelDialog>, ChannelService],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: exampleRow
      }
    ],
    detectChanges: true
  });

  beforeEach(async () => {
    spectator = createComponent({
      providers: [
        {
          provide: ChannelService,
          useValue: jasmine.createSpyObj("ChannelService", {
            getChannelsByAddressBookEntry: of(exampleChannels)
          })
        }
      ]
    });
    component = spectator.component;
    channelService = spectator.inject(ChannelService);
    dialogRef = spectator.inject(MatDialogRef);
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch selectable channels onInit()', () => {
    expect(channelService.getChannelsByAddressBookEntry).toHaveBeenCalled();
    expect(component.selectableChannels.length).toBe(2);
  });

  it('should display title of message', () => {
    expect(spectator.query(byText(component.data.messageId, {
      selector: "div.header span",
      exact: false
    }))).toBeVisible();
  });

  it('should display sender of message', () => {
    expect(spectator.query(byText(component.data.senderLabel, {
      exact: false
    }))).toBeVisible();
  });

  it('should display recipient of message', () => {
    expect(spectator.query(byText(component.data.recipientLabel, {
      exact: false
    }))).toBeVisible();
  });

  it('should display date correctly', ()=> {
    let dateString = new DatePipe("en").transform(component.data.createdAt, "medium");
    expect(spectator.query(byText(dateString!, {
      exact: false
    }))).toBeVisible();
  });

  it('should display priority of message correctly', ()=> {
    let importanceComponent = spectator.query(ImportanceInlineComponent);
    expect(importanceComponent).toBeVisible();
    expect(importanceComponent?.importance).toBe(component.data.priority);
  });

  it('should display content of message', () => {
    expect(spectator.query(byText(component.data.content))).toBeVisible();
  });

  it('should display label, channel type and info of channels', () => {
    exampleChannels.forEach(channel => {

      // Channel label visible
      expect(spectator.query(byText(channel.label, {
        exact: true,
        selector: "td"
      }))).toBeVisible();

      // Channel type visible
      expect(spectator.query(byText(channel.type, {
        exact: false,
        selector: "td"
      }))).toBeVisible();

      // Channel info visible
      expect(spectator.query(byText((channel.details as any).info, {
        exact: true,
        selector: "td"
      }))).toBeVisible();
    })
  });

  it('should select channel when channel row is clicked', ()=> {
    spyOn(component, "channelSelected").and.callThrough();
    spectator.click(byText(exampleChannels[0].label));
    expect(component.channelSelected).toHaveBeenCalled();
    expect(component.selectedChannel).toBe(exampleChannels[0]);
  });

  it('should close dialog when cancel button is clicked', ()=> {
    spectator.click(byTextContent("Cancel", {
      selector: "button"
    }));
    expect(dialogRef.close).toHaveBeenCalled();
  });

  describe('submit button', ()=> {
    it('should not be submittable when no channel is slected', ()=> {
      component.selectedChannel = null;
      component.submitClicked();
  
      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  
    it('should display error message when no channel is selected', ()=> {
      component.selectedChannel = null;
      component.submitClicked();
      spectator.detectChanges();
      expect(spectator.query(".select-channel-error-label")).toBeVisible();
    });
  
    it('should close dialog and return selected channel', ()=> {
      component.selectedChannel = exampleChannels[0];
      component.submitClicked();
      expect(dialogRef.close).toHaveBeenCalledOnceWith(component.selectedChannel);
    });
  });

});
