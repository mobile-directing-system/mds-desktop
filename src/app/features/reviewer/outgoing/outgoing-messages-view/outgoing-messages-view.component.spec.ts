import { fakeAsync } from '@angular/core/testing';

import { Spectator, SpyObject, byText, createComponentFactory } from '@ngneat/spectator';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { AddressBookEntry } from 'src/app/core/model/address-book-entry';
import { Group } from 'src/app/core/model/group';
import { Incident } from 'src/app/core/model/incident';
import { Message, MessageDirection, Participant } from 'src/app/core/model/message';
import { Resource } from 'src/app/core/model/resource';
import { AddressBookService } from 'src/app/core/services/addressbook.service';
import { GroupService } from 'src/app/core/services/group.service';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { OutgoingMessagesViewComponent } from './outgoing-messages-view.component';
import { ReviewerModule } from '../../reviewer.module';

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
      recipients: [
        {
          recipientType: Participant.Role,
          recipientId: "1",
          send: false
        },
        {
          recipientType: Participant.Resource,
          recipientId: "1",
          send: false
        }
      ]
    },
    {
      id: "1",
      direction: MessageDirection.Outgoing,
      senderId: "1",
      senderType: Participant.Role,
      content: "Another example",
      createdAt: new Date(),
      priority: 1000,
      incidentId: "1",
      recipients: [
        {
          recipientType: Participant.Role,
          recipientId: "1",
          send: false
        },
        {
          recipientType: Participant.Resource,
          recipientId: "2",
          send: true
        }
      ]
    }
  ]

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

  const createComponent = createComponentFactory({
    component: OutgoingMessagesViewComponent,
    imports: [ReviewerModule],
    mocks: [
      AddressBookService,
      GroupService
    ]
  });

  beforeEach(async () => {

    spectator = createComponent({
      providers: [
        {
          provide: MessageService,
          useValue: jasmine.createSpyObj("MessageService", {
            getMessages: of(exampleMessages)
          })
        },
        {
          provide: ResourceService,
          useValue: jasmine.createSpyObj("ResourceService", {
            getResourceById: of(exampleResource)
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

    // Three rows should have been created
    expect(component.dataSource.data.length).toBe(3);
  }));

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
        expect(spectator.query(byText(row.recipient, {
          selector: "td",
          exact: true
        })))
          .withContext(row.recipient)
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

  });
});
