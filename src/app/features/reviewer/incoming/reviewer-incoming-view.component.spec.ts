
import { Spectator, byTextContent, createComponentFactory } from '@ngneat/spectator';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { MessageService } from 'src/app/core/services/message/message.service';
import { ReviewerModule } from '../reviewer.module';
import { ReviewerIncomingView } from './reviewer-incoming-view.component';
import { Message, MessageDirection, Participant } from 'src/app/core/model/message';
import { By } from '@angular/platform-browser';
import { MatTable } from '@angular/material/table';
import { ChannelType } from 'src/app/core/model/channel';
import { fakeAsync } from '@angular/core/testing';

fdescribe('ReviewerIncomingView', () => {

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
    }
  ];

  let getMessages = new BehaviorSubject<Message[]>(exampleMessages);

  const createComponent = createComponentFactory({
    component: ReviewerIncomingView,
    imports: [ReviewerModule]
  });

  let spectator: Spectator<ReviewerIncomingView>;

  beforeEach(() => {
    let messageService = jasmine.createSpyObj("MessageService", {
      getMessages: getMessages
    });

    spectator = createComponent({
      providers: [
        {
          provide: MessageService,
          useValue: messageService
        }
      ]
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should contain a material table', () => {
    expect(spectator.debugElement.query(By.directive(MatTable))).toBeTruthy();
  })

  it('should load messages on init', fakeAsync(() => {
    getMessages.next(exampleMessages);
    spectator.component.ngOnInit();
    spectator.tick();
    expect(spectator.component.dataSource.data.length).toBe(exampleMessages.length);
    expect(spectator.inject(MessageService).getMessages).toHaveBeenCalled();
  }));

  describe('table', () => {

    beforeEach(() => {
      getMessages.next(exampleMessages);
      spectator.component.ngOnInit();
      spectator.detectChanges();
    });

    it('should display content of messages', () => {
      exampleMessages.forEach(msg => {
        expect(spectator.query(byTextContent(msg.content, {
          selector: "td",
          exact: true
        })
        )).withContext("display message content in table").toBeVisible();
      });
    });

    it('should be sorted initially descending by message creation date', fakeAsync(() => {
      spectator.component.ngAfterViewInit();
      spectator.tick();
      expect(spectator.component.dataSource.sort?.direction).toBe("desc");
      expect(spectator.component.dataSource.sort?.active).toBe("created_at");
    }));

  });
});
