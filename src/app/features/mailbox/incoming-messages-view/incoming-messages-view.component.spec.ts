import { fakeAsync, tick } from '@angular/core/testing';

import { byTextContent, createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { BehaviorSubject, Subject } from "rxjs";
import { WorkspaceService } from 'src/app/core/services/workspace.service';
import { CoreModule } from "../../../core/core.module";
import { AddressBookEntry } from "../../../core/model/address-book-entry";
import { ChannelType } from "../../../core/model/channel";
import { Group } from "../../../core/model/group";
import { Incident } from "../../../core/model/incident";
import { Message, MessageDirection, Participant } from "../../../core/model/message";
import { Resource } from "../../../core/model/resource";
import { AccessControlMockService } from "../../../core/services/access-control-mock.service";
import { AccessControlService } from "../../../core/services/access-control.service";
import { AddressBookService } from "../../../core/services/addressbook.service";
import { AuthService } from "../../../core/services/auth.service";
import { GroupService } from "../../../core/services/group.service";
import { IncidentService } from "../../../core/services/incident/incident.service";
import { MessageService } from "../../../core/services/message/message.service";
import { ResourceService } from "../../../core/services/resource/resource.service";
import { IncomingMessagesViewComponent } from "./incoming-messages-view.component";

describe('IncomingMessagesViewComponent', () => {
  let spectator: SpectatorRouting<IncomingMessagesViewComponent>;
  let component: IncomingMessagesViewComponent;

  const messagesSubject: Subject<Message[]> = new Subject();
  const incidentSubject: Subject<Incident> = new Subject()
  const resourceSubject: Subject<Resource|undefined> = new Subject();
  const addressBookSubject: Subject<AddressBookEntry> = new Subject();
  const groupSubject: Subject<Group> = new Subject();

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
    members:["loggedInUserId"]
  };


  const createComponent = createRoutingFactory({
    component: IncomingMessagesViewComponent,
    imports: [
      CoreModule,
    ],
    providers: [
      {
        provide: AccessControlService,
        useExisting: AccessControlMockService,
      },
      {
        provide: MessageService,
        useValue: {
          getMailboxMessages: ()=> messagesSubject,
        },
      },
      {
        provide: IncidentService,
        useValue: {
          getIncidentById: ()=> incidentSubject,
        },
      },
      {
        provide: ResourceService,
        useValue: {
          getResourceById: ()=> resourceSubject,
        },
      },
      {
        provide: AddressBookService,
        useValue: {
          getAddressBookEntryById: ()=> addressBookSubject,
        },
      },
      {
        provide: GroupService,
        useValue: {
          getGroupById: ()=> groupSubject,
        },
      },
      {
        provide: WorkspaceService,
        useValue: jasmine.createSpyObj("WorkspaceService", {
          operationChange: new BehaviorSubject(selectedOperationId)
        })
      }
    ],
    mocks: [
      AuthService,
    ],
    detectChanges: false,
  });


  beforeEach(fakeAsync(() => {
    spectator = createComponent();
    component = spectator.component;
    component.currentOperationId = selectedOperationId;
    component.loggedInRole = group;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.detectComponentChanges();
    tick();
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should load messages successfully', fakeAsync(() => {
    component.ngOnInit();
    messagesSubject.next(mailboxMessages);
    incidentSubject.next(incident);
    resourceSubject.next(resource);
    addressBookSubject.next(addressBookEntry);
    groupSubject.next(group);
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
