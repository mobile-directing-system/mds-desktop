import { fakeAsync, tick } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { byTextContent, createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { of } from "rxjs";
import { WorkspaceService } from 'src/app/core/services/workspace.service';
import { AddressBookEntry } from "../../../core/model/address-book-entry";
import { ChannelType } from "../../../core/model/channel";
import { Group } from "../../../core/model/group";
import { Incident } from "../../../core/model/incident";
import { Message, MessageDirection, Participant } from "../../../core/model/message";
import { Resource } from "../../../core/model/resource";
import { AddressBookService } from "../../../core/services/addressbook.service";
import { GroupService } from "../../../core/services/group.service";
import { IncidentService } from "../../../core/services/incident/incident.service";
import { MessageService } from "../../../core/services/message/message.service";
import { ResourceService } from "../../../core/services/resource/resource.service";
import { MailboxModule } from '../mailbox.module';
import { IncomingMessagesViewComponent } from "./incoming-messages-view.component";

describe('IncomingMessagesViewComponent', () => {
  let spectator: SpectatorRouting<IncomingMessagesViewComponent>;
  let component: IncomingMessagesViewComponent;

  const selectedOperationId = "123";

  const mailboxMessages: Message[] = [
    {
      id: "0",
      direction: MessageDirection.Incoming,
      incomingChannelType: ChannelType.Email,
      senderId: "senderId",
      senderType: Participant.AddressBookEntry,
      content: "Example content",
      createdAt: new Date(),
      operationId: "123",
      priority: 1000,
      needsReview: false,
      recipients: [
        {
          recipientType: Participant.Role,
          recipientId: "loggedInRoleId",
          read: false
        }
      ]
    },
    {
      id: "1",
      direction: MessageDirection.Incoming,
      incomingChannelType: ChannelType.Email,
      senderId: "senderId",
      senderType: Participant.Resource,
      content: "Example content 123",
      createdAt: new Date(),
      operationId: "123",
      needsReview: false,
      priority: 0,
      recipients: [
        {
          recipientType: Participant.Role,
          recipientId: "loggedInRoleId",
          read: false
        },
        {
          recipientType: Participant.Role,
          recipientId: "S3",
          read: false
        }
      ]
    },
    {
      id: "1",
      direction: MessageDirection.Incoming,
      incomingChannelType: ChannelType.Email,
      senderId: "senderId",
      senderType: Participant.Role,
      content: "Example content 123",
      createdAt: new Date(),
      needsReview: false,
      operationId: "123",
      priority: 0,
      recipients: [
        {
          recipientType: Participant.Role,
          recipientId: "loggedInRoleId",
          read: false
        },
        {
          recipientType: Participant.Role,
          recipientId: "recipientId",
          read: false
        },
        {
          recipientType: Participant.Resource,
          recipientId: "recipientId",
          read: false
        },
        {
          recipientType: Participant.AddressBookEntry,
          recipientId: "recipientId",
          read: false
        }
      ]
    },
  ];

  const incident: Incident = {
    id: "incidentId",
    name: "incidentName",
    description: "description",
    operation: "operation",
    isCompleted: false,
  };

  const resource: Resource = {
    id: "resourceId",
    label: "resourceLabel",
    description: "description",
    statusCode: 1,
  };

  const addressBookEntry: AddressBookEntry = {
    id: "addressBookId",
    label: "addressBookLabel",
    description: "description",
  };

  const group: Group = {
    id: "loggedInRoleId",
    title: "S1",
    description: "description",
    members: ["loggedInUserId"]
  };


  const createComponent = createRoutingFactory({
    component: IncomingMessagesViewComponent,
    imports: [
      MailboxModule,
    ],
    mocks: [
      MatDialog
    ]
  });


  beforeEach(() => {
    spectator = createComponent({
      providers: [
          {
            provide: MessageService,
            useValue: jasmine.createSpyObj("MessageService", {
              getMailboxMessages: of(mailboxMessages)
            })
          },
          {
            provide: IncidentService,
            useValue: jasmine.createSpyObj("IncidentService", {
              getIncidentById: of(incident)
            })
          },
          {
            provide: ResourceService,
            useValue: jasmine.createSpyObj("ResourceService", {
              getResourceById: of(resource)
            })
          },
          {
            provide: AddressBookService,
            useValue: jasmine.createSpyObj("AddressBookService", {
              getAddressBookEntryById: of(addressBookEntry)
            })
          },
          {
            provide: GroupService,
            useValue: jasmine.createSpyObj("GroupService", {
              getGroupById: of(group)
            })
          },
          {
            provide: WorkspaceService,
            useValue: jasmine.createSpyObj("WorkspaceService", {
              operationChange: of(selectedOperationId)
            })
          }
      ],
      detectChanges: true
    });
    component = spectator.component;
    component.currentOperationId = selectedOperationId;
    component.loggedInRole = group;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    // Do not run refresh timer in tests
    component.refreshTimer.unsubscribe();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should load messages successfully', fakeAsync(() => {
    component.refreshDataSource();
    tick();
    expect(spectator.component.dataSource.data.length).toEqual(mailboxMessages.length);
    spectator.detectComponentChanges();
    expect(spectator.query(byTextContent('Example content 123', {
      exact: false,
      selector: 'td',
    }))).toBeVisible();
  }));

  it('should set read filter successfully', fakeAsync(() => {
    spectator.component.onFilterReadChange("read");
    expect(spectator.component.filterRead).toEqual(true);
  }));

  it('should set unread filter successfully', fakeAsync(() => {
    spectator.component.onFilterReadChange("unread");
    expect(spectator.component.filterRead).toEqual(false);
  }));

});
