import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { LocalStorageMessageService } from './local-storage-message.service';
import { MessageService } from './message.service';
import { Message, MessageDirection, Participant } from '../../model/message';
import { ChannelType } from '../../model/channel';
import { mockLocalStorage } from '../../util/testing';

describe('LocalStorageMessageService', () => {
  let service: MessageService;

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
      recipients: [
        {
          recipientType: Participant.Role,
          recipientId: "S4",
          read: false
        },
        {
          recipientType: Participant.AddressBookEntry,
          recipientId: "12345",
          send: false
        },
      ]
    }
  ];

  beforeEach(() => {
    mockLocalStorage();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MessageService,
          useClass: LocalStorageMessageService
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
});
