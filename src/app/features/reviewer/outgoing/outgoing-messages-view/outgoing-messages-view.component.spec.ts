import { fakeAsync } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { Spectator, byText, createComponentFactory } from '@ngneat/spectator';
import * as moment from 'moment';
import { EMPTY, of } from 'rxjs';
import { AddressBookEntry } from 'src/app/core/model/address-book-entry';
import { Channel, ChannelType } from 'src/app/core/model/channel';
import { Group } from 'src/app/core/model/group';
import { Importance } from 'src/app/core/model/importance';
import { Incident } from 'src/app/core/model/incident';
import { Message, MessageDirection, Participant } from 'src/app/core/model/message';
import { Resource } from 'src/app/core/model/resource';
import { AddressBookService } from 'src/app/core/services/addressbook.service';
import { GroupService } from 'src/app/core/services/group.service';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { ReviewerModule } from '../../reviewer.module';
import { OutgoingMessagesViewComponent } from './outgoing-messages-view.component';

describe('OutgoingMessagesViewComponent', () => {

  const exampleMessages: Message[] = [
    {
      id: "0",
      direction: MessageDirection.Outgoing,
      senderId: "1",
      senderType: Participant.Role,
      content: "Example content",
      createdAt: new Date(),
      priority: 1000,
      operationId: "123",
      recipients: [
        {
          recipientType: Participant.AddressBookEntry,
          recipientId: "1",
          send: false
        },
        {
          recipientType: Participant.Role,
          recipientId: "2",
          send: false
        }
      ]
    },
    {
      id: "1",
      direction: MessageDirection.Outgoing,
      senderId: "1",
      senderType: Participant.Role,
      operationId: "123",
      content: "Another example",
      createdAt: new Date(),
      priority: 1000,
      incidentId: "1",
      recipients: [
        {
          recipientType: Participant.AddressBookEntry,
          recipientId: "1",
          send: false
        },
        {
          recipientType: Participant.Resource,
          recipientId: "2",
          send: false,
          channelId: "1234"
        }
      ]
    }
  ]

  const exampleChannel: Channel = {
    id: "1",
    entry: "123",
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
  };

  let exampleAddressBookEntry: AddressBookEntry = {
    id: "1",
    label: "Max Mustermann",
    description: "Test"
  }

  let exampleGroup: Group = {
    id: "1",
    title: "Example group",
    description: "Test",
    members: ["1"]
  }

  let exampleResource: Resource = {
    id: "1",
    label: "RTW",
    description: "Example resource",
    statusCode: 0
  }

  let exampleIncident: Incident = {
    id: "1",
    name: "Example incident",
    description: "Test incident",
    operation: "1",
    isCompleted: false
  }

  let spectator: Spectator<OutgoingMessagesViewComponent>;
  let component: OutgoingMessagesViewComponent;
  let messageService: MessageService;
  let matDialog: MatDialog;

  const createComponent = createComponentFactory({
    component: OutgoingMessagesViewComponent,
    imports: [ReviewerModule],
    mocks: [
      MatDialog,
      NotificationService
    ]
  });

  beforeEach(async () => {
    spectator = createComponent({
      providers: [
        {
          provide: MessageService,
          useValue: jasmine.createSpyObj("MessageService", {
            getMessages: of(exampleMessages),
            getMessageById: of(exampleMessages[0]),
            updateMessage: of(true)
          })
        },
        {
          provide: ResourceService,
          useValue: jasmine.createSpyObj("ResourceService", {
            getResourceById: of(exampleResource)
          })
        },
        {
          provide: AddressBookService,
          useValue: jasmine.createSpyObj("AddressBookService", {
            getAddressBookEntryById: of(exampleAddressBookEntry)
          })
        },
        {
          provide: GroupService,
          useValue: jasmine.createSpyObj("GroupService", {
            getGroupById: of(exampleGroup)
          })
        },
        {
          provide: IncidentService,
          useValue: jasmine.createSpyObj("IncidentService", {
            getIncidentById: of(exampleIncident)
          })
        },
      ],
      detectChanges: false
    });
    component = spectator.component;
    messageService = spectator.inject(MessageService);
    matDialog = spectator.inject(MatDialog);
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a table', () => {
    expect(spectator.query("table")).toBeVisible();
  });

  it('should call refreshDataSource() on init', fakeAsync(() => {
    spyOn(component, "refreshDataSource").and.callFake(() => { });
    component.ngOnInit();
    spectator.tick();
    expect(component.refreshDataSource).toHaveBeenCalled();
  }));

  it('should refresh data correctly', fakeAsync(() => {
    component.refreshDataSource();
    spectator.tick();

    expect(messageService.getMessages).toHaveBeenCalled();

    // Two rows should have been created
    expect(component.dataSource.data.length).toBe(2);
  }));

  it('should update channel for recipient correctly', ()=> {
    let msg: Message = {
      id: "0",
      direction: MessageDirection.Outgoing,
      senderId: "1",
      senderType: Participant.Role,
      content: "Example content",
      createdAt: new Date(),
      priority: 1000,
      operationId: "123",
      recipients: [
        {
          recipientType: Participant.Role,
          recipientId: "1",
          send: false
        }
      ]
    };
    let msgServiceSpy = messageService as jasmine.SpyObj<MessageService>;
    msgServiceSpy.getMessageById.and.returnValue(of(msg));
    msgServiceSpy.updateMessage.and.returnValue(of(true));

    let channelId = "123";
    component.setChannelForRecipient(msg.id, msg.recipients[0].recipientId, channelId).subscribe(success =>{
      expect(messageService.updateMessage).toHaveBeenCalledOnceWith(msg);
      expect(success).toBeTrue();
      expect(msg.recipients[0].channelId).toBe(channelId);
    });
  });

  describe('table', () => {
    beforeEach(fakeAsync(() => {
      component.ngOnInit();
      spectator.tick();
      spectator.detectChanges();
    }));

    it('should be visible', () => {
      expect(spectator.query("table")).toBeVisible();
    });

    it('should be initially sorted by date descending', () => {
      expect(component.dataSource.sort?.active).toBe("createdAt");
      expect(component.dataSource.sort?.direction).toBe("desc");
    });

    it('should display content correctly ', () => {
      expect(component.dataSource.data).toBeTruthy();
      component.dataSource.data.forEach(row => {
        expect(spectator.query(byText(row.content, {
          selector: "td",
          exact: true
        })))
          .withContext(row.content)
          .toBeVisible();
      });
    });

    it('should display sender name correctly ', () => {
      expect(component.dataSource.data).toBeTruthy();
      component.dataSource.data.forEach(row => {
        expect(spectator.query(byText(row.senderLabel, {
          selector: "td",
          exact: true
        })))
          .withContext(row.senderLabel)
          .toBeVisible();
      });
    });

    it('should display recipient name correctly ', () => {
      expect(component.dataSource.data).toBeTruthy();
      component.dataSource.data.forEach(row => {
        expect(spectator.query(byText(row.recipientLabel, {
          selector: "td",
          exact: true
        })))
          .withContext(row.recipientLabel)
          .toBeVisible();
      });
    });

    it('should display incident name correctly ', () => {
      expect(component.dataSource.data).toBeTruthy();
      component.dataSource.data.forEach(row => {
        expect(spectator.query(byText(row.incidentLabel, {
          selector: "td",
          exact: true
        })))
          .withContext(row.incidentLabel)
          .toBeVisible();
      });
    });

    it('should open channel selection dialog when row clicked', fakeAsync(()=> {
      spyOn(component, "rowClicked").and.callThrough();
      let dialogRef = jasmine.createSpyObj("MatDialogRef", {
        afterClosed: EMPTY
      });
      (matDialog as jasmine.SpyObj<MatDialog>).open.and.returnValue(dialogRef);

      spectator.click(byText(exampleMessages[0].content));
      spectator.tick();

      expect(component.rowClicked).toHaveBeenCalled();
      expect(matDialog.open).toHaveBeenCalled();
    }));

    it('should not contain message when channel was successfully selected', ()=> {
      let dialogRef = jasmine.createSpyObj("MatDialogRef", {
        afterClosed: of(exampleChannel)
      });
      spyOn(component, "setChannelForRecipient").and.returnValue(of(true));
      (matDialog as jasmine.SpyObj<MatDialog>).open.and.returnValue(dialogRef);

      let selectedRow = component.dataSource.data[0];
      expect(component.dataSource.data).toContain(selectedRow);
      component.rowClicked(selectedRow);
      expect(component.dataSource.data).not.toContain(selectedRow);
    });

    it('should not change when channel selection failed', ()=> {
      let dialogRef = jasmine.createSpyObj("MatDialogRef", {
        afterClosed: of(exampleChannel)
      });
      spyOn(component, "setChannelForRecipient").and.returnValue(of(false));
      (matDialog as jasmine.SpyObj<MatDialog>).open.and.returnValue(dialogRef);

      let selectedRow = component.dataSource.data[0];
      let expectedTableEntrySize = component.dataSource.data.length;
      component.rowClicked(selectedRow);
      expect(component.dataSource.data.length).toBe(expectedTableEntrySize);
    });
  });
});
