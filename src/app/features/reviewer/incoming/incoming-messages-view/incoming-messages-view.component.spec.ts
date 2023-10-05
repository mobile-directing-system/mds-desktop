
import { fakeAsync } from '@angular/core/testing';
import { MatTable } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { Spectator, byText, byTextContent, createComponentFactory } from '@ngneat/spectator';
import { of } from 'rxjs';
import { ChannelTypeInlineComponent } from 'src/app/core/components/channel-type-inline/channel-type-inline.component';
import { ChannelType } from 'src/app/core/model/channel';
import { Incident } from 'src/app/core/model/incident';
import { Message, MessageDirection, Participant } from 'src/app/core/model/message';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { ReviewerModule } from '../../reviewer.module';
import { IncomingMessagesViewComponent, ReviewerIncomingMessageRow } from './incoming-messages-view.component';

describe('IncomingMessagesViewComponent', () => {

  const exampleMessages: Message[] = [
    {
      id: "0",
      direction: MessageDirection.Incoming,
      incomingChannelType: ChannelType.Email,
      senderId: "123",
      senderType: Participant.AddressBookEntry,
      content: "Example content",
      needsReview: true,
      createdAt: new Date(),
      recipients: []
    },
    {
      id: "1",
      direction: MessageDirection.Incoming,
      incomingChannelType: ChannelType.Email,
      senderId: "1234",
      senderType: Participant.Resource,
      content: "Example content 123",
      incidentId: "0",
      createdAt: new Date(),
      needsReview: true,
      recipients: []
    }
  ];

  const exampleIncident: Incident = {
    id: "0",
    name: "Example incident",
    description: "Incident description",
    operation: "1",
    isCompleted: false
  };

  const createComponent = createComponentFactory({
    component: IncomingMessagesViewComponent,
    imports: [ReviewerModule],
    detectChanges: false
  });

  let spectator: Spectator<IncomingMessagesViewComponent>;
  let component: IncomingMessagesViewComponent;

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
      providers: [
        {
          provide: MessageService,
          useValue: jasmine.createSpyObj("MessageService", {
            getMessages: of(exampleMessages)
          })
        },
        {
          provide: IncidentService,
          useValue: jasmine.createSpyObj("IncidentService", {
            getIncidentById: of(exampleIncident)
          })
        },
      ]
    });
    component = spectator.component;
    spectator.detectChanges();
    // Do not run refresh timer in tests
    component.refreshTimer.unsubscribe();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should contain a material table', () => {
    expect(spectator.debugElement.query(By.directive(MatTable))).toBeTruthy();
  });

  it('should load messages on init', () => {
    spectator.detectChanges();
    expect(spectator.component.dataSource.data.length).toBe(exampleMessages.length);
    expect(spectator.inject(MessageService).getMessages).toHaveBeenCalled();
  });

  it('should fetch message rows correctly', fakeAsync(()=> {
    component.refreshDataSource();
    spectator.tick();
    expect(component.dataSource.data.length).toBe(exampleMessages.length);
    exampleMessages.forEach(msg => {

      let msgRow: ReviewerIncomingMessageRow  = {
        message: msg,
      };
      if(msg.incidentId) msgRow.incident = exampleIncident;

      expect(component.dataSource.data).toContain(jasmine.objectContaining(msgRow));
    });
  }));

  describe('table', () => {

    beforeEach(() => {
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

    it('should display ids of messages', () => {
      exampleMessages.forEach(msg => {
        expect(spectator.query(byTextContent(msg.id, {
          selector: "td",
          exact: true
        })
        )).withContext("display message id in table").toBeVisible();
      });
    });

    it('should display channel types', () => {
      expect(spectator.query(ChannelTypeInlineComponent)).toBeVisible();
      exampleMessages.forEach(msg => {
        expect(spectator.query(byText(msg.incomingChannelType!, {
          exact: false,
        }))).toBeVisible();
      })
    });

    it('should display incident names if available', () => {
      component.dataSource.data.forEach(row => {
        expect(spectator.query(byText(row.incident?.name ?? "", {
          selector: "td",
          exact: true
        }))).toBeVisible();
      });
    });

    it('should be sorted initially descending by message creation date', fakeAsync(() => {
      spectator.component.ngAfterViewInit();
      spectator.tick();
      expect(spectator.component.dataSource.sort?.direction).toBe("desc");
      expect(spectator.component.dataSource.sort?.active).toBe("created_at");
    }));

    it('should call rowClicked() when row was clicked', ()=> {
      spyOn(component, "rowClicked");
      let row = component.dataSource.data[0];
      spectator.click(byText(row.message.id));
      expect(component.rowClicked).toHaveBeenCalledWith(row);
    })
  });
});
