import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {LocalStorageMessageService} from './local-storage-message.service';
import {MessageService} from './message.service';
import {Message, MessageDirection, Participant} from '../../model/message';
import {Channel, ChannelType} from '../../model/channel';
import {mockLocalStorage} from '../../util/testing';
import {ChannelService} from "../channel.service";
import {Subject} from "rxjs";
import {duration} from "moment";


const exampleMessages: Message[] = [
  {
    id: "0",
    direction: MessageDirection.Incoming,
    incomingChannelType: ChannelType.Email,
    senderId: "123",
    senderType: Participant.AddressBookEntry,
    content: "Example content",
    createdAt: new Date(),
    recipients: [
      {
        recipientType: Participant.Role,
        recipientId: "S1",
        read: false
      }
    ]
  },
  {
    id: "1",
    direction: MessageDirection.Incoming,
    incomingChannelType: ChannelType.Email,
    senderId: "1234",
    senderType: Participant.Resource,
    content: "Example content 123",
    createdAt: new Date(),
    needsReview: true,
    recipients: [
      {
        recipientType: Participant.Role,
        recipientId: "S1",
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
    id: "2",
    direction: MessageDirection.Outgoing,
    senderType: Participant.Role,
    senderId: "S1",
    content: "A message from S1",
    createdAt: new Date(),
    needsReview: true,
    recipients: [
      {
        recipientType: Participant.Role,
        recipientId: "S2",
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
    id: "3",
    direction: MessageDirection.Outgoing,
    senderType: Participant.Role,
    senderId: "S2",
    content: "A message from S2",
    createdAt: new Date(),
    needsReview: false,
    "priority": 1000,
    recipients: [
      {
        recipientType: Participant.Role,
        recipientId: "S1",
      },
      {
        recipientType: Participant.AddressBookEntry,
        recipientId: "Jan",
        channelId: "channelId1"
      },
      {
        recipientType: Participant.AddressBookEntry,
        recipientId: "Gustav",
        channelId: "channelId2"
      },
    ],
    incidentId:"id"
  },
  {
    id: "4",
    direction: MessageDirection.Outgoing,
    senderType: Participant.Role,
    senderId: "S2",
    content: "A message from S2",
    createdAt: new Date(),
    needsReview: false,
    "priority": 1000,
    recipients: [
      {
        recipientType: Participant.Role,
        recipientId: "S1",
      },
      {
        recipientType: Participant.AddressBookEntry,
        recipientId: "Jan",
        channelId: "channelId1",
        signalerId: "lockedBySignaler",
      },
      {
        recipientType: Participant.AddressBookEntry,
        recipientId: "Gustav",
        channelId: "channelId2"
      },
    ],
    incidentId:"id"
  },

];

let channelsSubject = new Subject<Channel []>();
const channelInApp: Channel = {
  id: "channelId1",
  details: {info:"info"},
  entry: "address-bookId",
  isActive: false,
  label: "label",
  minImportance: 0,
  priority: 0,
  timeout: duration(10000),
  type:  ChannelType.InAppNotification
};
const channelRadio: Channel = {
  id: "channelId2",
  details: {info:"info"},
  entry: "address-bookId",
  isActive: false,
  label: "label",
  minImportance: 0,
  priority: 0,
  timeout: duration(10000),
  type:  ChannelType.Radio
};
const channelsInAppAndRadio: Channel[] = [
  channelInApp, channelRadio
]
const channelsInApp: Channel[] = [
  channelInApp
]

describe('LocalStorageMessageService', () => {
  let service: MessageService;


  beforeEach(() => {
    mockLocalStorage();
    channelsSubject = new Subject<Channel []>()
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MessageService,
          useClass: LocalStorageMessageService
        },
        {
          provide: ChannelService,
          useValue: {
            getChannelsByAddressBookEntry: ()=> channelsSubject
          },
        }
      ]
    });
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all items correctly', fakeAsync(()=> {
    service.createMessage(exampleMessages[0]).subscribe();
    service.createMessage(exampleMessages[1]).subscribe();
    tick();
    service.getMessages().subscribe(messages => {
      expect(messages[0].senderId).toBe(exampleMessages[0].senderId);
      expect(messages[1].senderId).toBe(exampleMessages[1].senderId);
    });
  }));

  it('should fetch messages correctly with byDirection filter', fakeAsync(() => {
    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();
    service.getMessages({byDirection: MessageDirection.Incoming}).subscribe(messages => {
      expect(messages.length).toBe(2);
      expect(messages[0].direction).toBe(MessageDirection.Incoming);
      expect(messages[1].direction).toBe(MessageDirection.Incoming);
    });
  }));

  it('should fetch messages correctly with byNeedsReview filter', fakeAsync(() => {
    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();
    service.getMessages({byNeedsReview: true}).subscribe(messages => {
      expect(messages.length).toBe(2);
      for(let msg of messages) {
        expect(msg.needsReview).toBeTrue();
      }
    });
  }));

  it('should fetch messages for mailbox that are not read correctly', fakeAsync(() => {
    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();
    service.getMailboxMessages("S1", false).subscribe(messages => {
      expect(messages.length).toBe(2);
      for(let msg of messages) {
        expect(msg.recipients).toContain(jasmine.objectContaining({recipientId: "S1"}));
      }
    });
  }));


  it('should pick up next message to deliver without filtering for channel type', fakeAsync(() => {

    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();

    let signalerId = "signalerId";
    let pickedUpMessage: Message|undefined;
    service.pickUpNextMessageToDeliver(signalerId).subscribe(message => {
      pickedUpMessage = message;
    });
    tick();
    expect(pickedUpMessage?.direction).toBe(MessageDirection.Outgoing);
    expect(pickedUpMessage?.needsReview).toBe(false);
    expect(pickedUpMessage?.recipients.length).toBe(1);
    expect(pickedUpMessage?.recipients.at(0)?.recipientType).toBe(Participant.AddressBookEntry);
    expect(pickedUpMessage?.recipients.at(0)?.send).not.toBe(true);
    expect(pickedUpMessage?.recipients.at(0)?.signalerId).toBe(signalerId);
    expect(pickedUpMessage?.recipients.at(0)?.channelId).toBeDefined();
  }));

  it('should pick up next message to deliver with filtering for channel type', fakeAsync(() => {
    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();

    let signalerId = "signalerId";
    let pickedUpMessage: Message|undefined;
    service.pickUpNextMessageToDeliver(signalerId, ChannelType.Radio).subscribe(message => {
      pickedUpMessage = message;
    });
    tick();
    channelsSubject.next(channelsInAppAndRadio);
    channelsSubject.complete();
    tick();
    tick();
    tick();
    expect(pickedUpMessage?.direction).toBe(MessageDirection.Outgoing);
    expect(pickedUpMessage?.needsReview).toBe(false);
    expect(pickedUpMessage?.recipients.length).toBe(1);
    expect(pickedUpMessage?.recipients.at(0)?.recipientType).toBe(Participant.AddressBookEntry);
    expect(pickedUpMessage?.recipients.at(0)?.send).not.toBe(true);
    expect(pickedUpMessage?.recipients.at(0)?.signalerId).toBe(signalerId);
    expect(pickedUpMessage?.recipients.at(0)?.channelId).toBeDefined();
  }));

  it('should return undefined if no available message for channel filter', fakeAsync(() => {
    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();

    let signalerId = "signalerId";
    let pickedUpMessage: Message|undefined;
    service.pickUpNextMessageToDeliver(signalerId, ChannelType.Radio).subscribe(message => {
      pickedUpMessage = message;
    });

    channelsSubject.next(channelsInApp);
    channelsSubject.complete();
    tick();
    expect(pickedUpMessage).toBeUndefined();
  }));

  it('should return undefined if no available messages', fakeAsync(() => {
    let signalerId = "signalerId";
    let pickedUpMessage: Message|undefined;
    service.pickUpNextMessageToDeliver(signalerId, ChannelType.Radio).subscribe(message => {
      pickedUpMessage = message;
    });

    channelsSubject.next(channelsInAppAndRadio);
    channelsSubject.complete();
    tick();
    expect(pickedUpMessage).toBeUndefined();
  }));

  it('should release messageToDeliver', fakeAsync(() => {
    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();

    let messageToRelease: Message = {
      id: "4",
      direction: MessageDirection.Outgoing,
      senderType: Participant.Role,
      senderId: "S2",
      content: "A message from S2",
      createdAt: new Date(),
      needsReview: false,
      "priority": 1000,
      recipients: [
        {
          recipientType: Participant.AddressBookEntry,
          recipientId: "Jan",
          channelId: "channelId1",
          signalerId: "lockedBySignaler",
        },
      ],
      incidentId:"id"
    }
    service.releaseMessageToDeliver(messageToRelease).subscribe((success=>{
      expect(success).toBe(true);
    }))
  }));

  it('release messageToDeliver: should return false if no message found', fakeAsync(() => {
    let messageToRelease: Message = {
      id: "4",
      direction: MessageDirection.Outgoing,
      senderType: Participant.Role,
      senderId: "S2",
      content: "A message from S2",
      createdAt: new Date(),
      needsReview: false,
      "priority": 1000,
      recipients: [
        {
          recipientType: Participant.AddressBookEntry,
          recipientId: "Jan",
          channelId: "channelId1",
          signalerId: "lockedBySignaler",
        },
      ],
      incidentId:"id"
    }
    service.releaseMessageToDeliver(messageToRelease).subscribe((success=>{
      expect(success).toBe(false);
    }))
  }));

  it('release messageToDeliver: should return false if no recipient found', fakeAsync(() => {
    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();

    let messageToRelease: Message = {
      id: "4",
      direction: MessageDirection.Outgoing,
      senderType: Participant.Role,
      senderId: "S2",
      content: "A message from S2",
      createdAt: new Date(),
      needsReview: false,
      "priority": 1000,
      recipients: [],
      incidentId:"id"
    }
    service.releaseMessageToDeliver(messageToRelease).subscribe((success=>{
      expect(success).toBe(false);
    }))
  }));

  it('release message to deliver: should return false if no suitable recipient found', fakeAsync(() => {
    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();

    let messageToRelease: Message = {
      id: "4",
      direction: MessageDirection.Outgoing,
      senderType: Participant.Role,
      senderId: "S2",
      content: "A message from S2",
      createdAt: new Date(),
      needsReview: false,
      "priority": 1000,
      recipients: [
        { recipientType: Participant.AddressBookEntry,
          recipientId: "noExistingId",
          channelId: "channelId1",
          signalerId: "lockedBySignaler"}
      ],
      incidentId:"id"
    }
    service.releaseMessageToDeliver(messageToRelease).subscribe((success=>{
      expect(success).toBe(false);
    }))
  }));

  it('should mark message as send', fakeAsync(() => {
    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();

    let messageToSend: Message = {
      id: "4",
      direction: MessageDirection.Outgoing,
      senderType: Participant.Role,
      senderId: "S2",
      content: "A message from S2",
      createdAt: new Date(),
      needsReview: false,
      "priority": 1000,
      recipients: [
        {
          recipientType: Participant.AddressBookEntry,
          recipientId: "Jan",
          channelId: "channelId1",
          signalerId: "lockedBySignaler",
        },
      ],
      incidentId:"id"
    }
    service.markMessageAsSend(messageToSend).subscribe((success=>{
      expect(success).toBe(true);
    }))
  }));

  it('mark message as send: should return false if no message found', fakeAsync(() => {
    let messageToSend: Message = {
      id: "4",
      direction: MessageDirection.Outgoing,
      senderType: Participant.Role,
      senderId: "S2",
      content: "A message from S2",
      createdAt: new Date(),
      needsReview: false,
      "priority": 1000,
      recipients: [
        {
          recipientType: Participant.AddressBookEntry,
          recipientId: "Jan",
          channelId: "channelId1",
          signalerId: "lockedBySignaler",
        },
      ],
      incidentId:"id"
    }
    service.markMessageAsSend(messageToSend).subscribe((success=>{
      expect(success).toBe(false);
    }))
  }));

  it('mark message as send: should return false if no recipient found', fakeAsync(() => {
    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();

    let messageToSend: Message = {
      id: "4",
      direction: MessageDirection.Outgoing,
      senderType: Participant.Role,
      senderId: "S2",
      content: "A message from S2",
      createdAt: new Date(),
      needsReview: false,
      "priority": 1000,
      recipients: [
        { recipientType: Participant.AddressBookEntry,
          recipientId: "noExistingId",
          channelId: "channelId1",
          signalerId: "lockedBySignaler"}
      ],
      incidentId:"id"
    }
    service.markMessageAsSend(messageToSend).subscribe((success=>{
      expect(success).toBe(false);
    }))
  }));

  it('mark message as send: should return false if no suitable recipient found', fakeAsync(() => {
    for(let msg of exampleMessages) {
      service.createMessage(msg).subscribe();
    }
    tick();

    let messageToSend: Message = {
      id: "4",
      direction: MessageDirection.Outgoing,
      senderType: Participant.Role,
      senderId: "S2",
      content: "A message from S2",
      createdAt: new Date(),
      needsReview: false,
      "priority": 1000,
      recipients: [],
      incidentId:"id"
    }
    service.markMessageAsSend(messageToSend).subscribe((success=>{
      expect(success).toBe(false);
    }))
  }));
});
