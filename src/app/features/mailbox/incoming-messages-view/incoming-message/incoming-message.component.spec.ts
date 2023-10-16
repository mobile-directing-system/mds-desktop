import {fakeAsync, tick} from '@angular/core/testing';

import {byTextContent, createRoutingFactory, SpectatorRouting} from "@ngneat/spectator";
import {AccessControlService} from "../../../../core/services/access-control.service";
import {AccessControlMockService} from "../../../../core/services/access-control-mock.service";
import {Subject} from "rxjs";
import {Group} from "../../../../core/model/group";
import {MessageService} from "../../../../core/services/message/message.service";
import {Message, MessageDirection, Participant} from "../../../../core/model/message";
import {ChannelType} from "../../../../core/model/channel";
import {CoreModule} from "../../../../core/core.module";
import {IncomingMessageComponent} from "./incoming-message.component";
import {DialogData, MessageRow} from "../incoming-messages-view.component";
import {NotificationService} from "../../../../core/services/notification.service";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";

describe('IncomingMessageComponent', () => {
  let spectator: SpectatorRouting<IncomingMessageComponent>;
  let component: IncomingMessageComponent;

  const getMessageSubject: Subject<Message> = new Subject();
  const updateMessageSubject: Subject<boolean> = new Subject();

  const group: Group = {
    id: "loggedInRoleId",
    title: "S1",
    description: "description",
    members:["loggedInUserId"]
  };

  const messageRow: MessageRow = {
    id: "id",
    priority: 1000,
    createdAt: new Date(),
    incomingChannelType: "channelType",
    sender: "sender",
    recipients: "recipients",
    content: "example content",
    incident: "incident",
  }

  const dataUnread: DialogData = {
    messageRow: messageRow,
    loggedInRole: group,
    isRead: false,
  }

  const dataRead: DialogData = {
    messageRow: messageRow,
    loggedInRole: group,
    isRead: true,
  }

  const message: Message = {
      id: "id",
      direction: MessageDirection.Incoming,
      incomingChannelType: ChannelType.Email,
      senderId: "senderId",
      senderType: Participant.AddressBookEntry,
      content: "Example content",
      operationId: "123",
      createdAt: new Date(),
      priority: 1000,
      needsReview: false,
      recipients: [
        {
          recipientType: Participant.Role,
          recipientId: "loggedInRoleId",
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
  };





  const createComponent = createRoutingFactory({
    component: IncomingMessageComponent,
    imports: [
      CoreModule,MatDialogModule
    ],
    providers: [
      {
        provide: AccessControlService,
        useExisting: AccessControlMockService,
      },
      {
        provide: MessageService,
        useValue: {
          getMessageById: ()=> getMessageSubject,
          updateMessage: ()=> updateMessageSubject,
        },
      },
      { provide: MatDialogRef, useValue: {} },
      { provide: MAT_DIALOG_DATA, useValue: {dataUnread} },
    ],
    mocks: [
      NotificationService,
    ],
    detectChanges: false,
  });


  beforeEach(fakeAsync(() => {
    spectator = createComponent();
    component = spectator.component;
    component.data = dataUnread;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.detectComponentChanges();
    tick();
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should load unread messages successfully', fakeAsync(() => {
    expect(component.data.messageRow.content).toEqual(dataUnread.messageRow.content);
    spectator.detectComponentChanges();
    expect(spectator.query(byTextContent(dataUnread.messageRow.content, {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
    expect(spectator.query(byTextContent("Mark as read", {
      exact: false,
      selector: 'button',
    }))).toBeVisible();
  }));

  it('should load read messages successfully', fakeAsync(() => {
    component.data = dataRead;
    expect(component.data.messageRow.content).toEqual(dataRead.messageRow.content);
    spectator.detectComponentChanges();
    expect(spectator.query(byTextContent(dataRead.messageRow.content, {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
    expect(spectator.query(byTextContent("Mark as unread", {
      exact: false,
      selector: 'button',
    }))).toBeVisible();
  }));

  it('should call updateMessage after toggle read state successfully', fakeAsync(() => {
    component.toggleReadState();
    getMessageSubject.next(message);
    tick();
    expect(updateMessageSubject.observed).toBeTrue();
  }));
});
