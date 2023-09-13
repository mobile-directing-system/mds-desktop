import {fakeAsync, tick} from '@angular/core/testing';

import {createRoutingFactory, SpectatorRouting} from "@ngneat/spectator";
import {CoreModule} from "../../../core/core.module";
import {AccessControlService} from "../../../core/services/access-control.service";
import {AccessControlMockService} from "../../../core/services/access-control-mock.service";
import {Subject} from "rxjs";
import {GroupService} from "../../../core/services/group.service";
import {Group} from "../../../core/model/group";
import {AuthService} from "../../../core/services/auth.service";
import {MessageService} from "../../../core/services/message/message.service";
import {IncidentService} from "../../../core/services/incident/incident.service";
import {ResourceService} from "../../../core/services/resource/resource.service";
import {AddressBookService} from "../../../core/services/addressbook.service";
import {Message, MessageDirection, Participant} from "../../../core/model/message";
import {Incident} from "../../../core/model/incident";
import {Resource} from "../../../core/model/resource";
import {AddressBookEntry} from "../../../core/model/address-book-entry";
import {ChannelType} from "../../../core/model/channel";
import {CreateMessageComponent, Recipient, RecipientId} from "./create-message.component";
import {NotificationService} from "../../../core/services/notification.service";
import {
  SearchableEntityInputComponent
} from "../../../core/components/searchable-entity-input/searchable-entity-input.component";
import {MockComponent} from "ng-mocks";
import {
  SearchableMultiChipEntityInputComponent
} from "../../../core/components/searchable-multi-chip-input-field/searchable-multi-chip-entity-input.component";
import {By} from "@angular/platform-browser";
import {Paginated, SearchResult} from "../../../core/util/store";

describe('CreateMessageComponent', () => {
  let spectator: SpectatorRouting<CreateMessageComponent>;
  let component: CreateMessageComponent;

  const messageSubject: Subject<Message> = new Subject();
  const incidentSubject: Subject<Incident> = new Subject();
  const incidentsSubject: Subject<Incident[]> = new Subject()
  const resourceSubject: Subject<Resource|undefined> = new Subject();
  const resourcesSubject: Subject<Resource[]> = new Subject();
  const addressBookSubject: Subject<AddressBookEntry> = new Subject();
  const addressBookEntriesSubject: Subject<SearchResult<AddressBookEntry>> = new Subject();
  const groupSubject: Subject<Group> = new Subject();
  const groupsSubject: Subject<Paginated<Group>> = new Subject();



  const message: Message = {
    id: "",
    direction: MessageDirection.Outgoing,
    incomingChannelType: ChannelType.InAppNotification,
    senderId: "loggedInRoleId",
    senderType: Participant.Role,
    content: "Example content",
    createdAt: new Date(),
    priority: 1000,
    needsReview: false,
    recipients: [
      {
        recipientType: Participant.Role,
        recipientId: "id",
        read: false
      },
      {
        recipientType: Participant.Resource,
        recipientId: "id",
        read: false
      },
      {
        recipientType: Participant.AddressBookEntry,
        recipientId: "id",
        read: false
      }
    ]
  };

  const incident: Incident = {
    id: "incidentId",
    name: "incidentName",
    description: "description",
    operation: "operation",
    isCompleted: false,
  };

  const incidents: Incident[] = [incident];

  const resource: Resource = {
    id: "resourceId",
    label: "resourceLabel",
    description: "description",
    statusCode: 1,
  };

  const resources: Resource[] = [resource];

  const addressBookEntry: AddressBookEntry = {
    id: "addressBookId",
    label: "addressBookLabel",
    description: "description",
  };

  const addressBookEntries: AddressBookEntry[] = [addressBookEntry];

  const group: Group = {
    id: "loggedInRoleId",
    title: "S1",
    description: "description",
    members:["loggedInUserId"]
  };

  const groups: Group[] = [group];

  const recipientId: RecipientId = {
    id: "recId",
    type: Participant.Role,
  }

  const recipient: Recipient = {
    label: "rec-label",
    id: recipientId
  }

  const createComponent = createRoutingFactory({
    component: CreateMessageComponent,
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
          createMessage: ()=> messageSubject,
        },
      },
      {
        provide: IncidentService,
        useValue: {
          getIncidentById: ()=> incidentSubject,
          getIncidents: ()=> incidentsSubject,
        },
      },
      {
        provide: ResourceService,
        useValue: {
          getResourceById: ()=> resourceSubject,
          getResources: ()=> resourcesSubject,
        },
      },
      {
        provide: AddressBookService,
        useValue: {
          getAddressBookEntryById: ()=> addressBookSubject,
          searchAddressBookEntries:  ()=> addressBookEntriesSubject,
        },
      },
      {
        provide: GroupService,
        useValue: {
          getGroupById: ()=> groupSubject,
          getGroups: ()=> groupsSubject,
        },
      },
      {
        provide: AuthService,
        useValue: {
          loggedInRole: ()=> groupSubject,
        },
      },

    ],
    mocks: [
      NotificationService
    ],
    declarations:[
      MockComponent(SearchableEntityInputComponent),
      MockComponent(SearchableMultiChipEntityInputComponent)
    ],
    detectChanges: false,
  });


  beforeEach(fakeAsync(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.detectComponentChanges();
    tick();
  }));


  it('should create', fakeAsync(() => {
    expect(spectator.component).toBeTruthy();
  }));

  it('should load role successfully', fakeAsync(() => {
    expect(component.loggedInRole).toBeUndefined();
    groupSubject.next(group);
    tick();
    expect(component.loggedInRole).toEqual(group);
  }));

  it('should send message successfully', fakeAsync(() => {
    const messageService = spectator.inject(MessageService);
    const createMessageSpy = spyOn(messageService, 'createMessage').and.returnValue(messageSubject);

    groupSubject.next(group);
    tick();
    component.form.setValue({
      recipients: [{id:"id", type: Participant.Role} as RecipientId, {id:"id", type: Participant.AddressBookEntry} as RecipientId, {id:"id", type: Participant.Resource} as RecipientId],
      priority: 1000,
      incident: "incidentId",
      content: "content",
    });
    spectator.detectComponentChanges();
    let sendButton = spectator.fixture.debugElement.query(By.css('.send-button'));
    expect(sendButton).toBeVisible();
    expect(sendButton.nativeElement.disabled).toBeFalse();
    sendButton.nativeElement.click();
    expect(createMessageSpy).toHaveBeenCalled();
  }));

  it('should send message without incident successfully', fakeAsync(() => {
    const messageService = spectator.inject(MessageService);
    const createMessageSpy = spyOn(messageService, 'createMessage').and.returnValue(messageSubject);

    groupSubject.next(group);
    tick();
    component.form.setValue({
      recipients: [{id:"id", type: Participant.Role} as RecipientId, {id:"id", type: Participant.AddressBookEntry} as RecipientId, {id:"id", type: Participant.Resource} as RecipientId],
      priority: 1000,
      incident: null,
      content: "content",
    });
    spectator.detectComponentChanges();
    let sendButton = spectator.fixture.debugElement.query(By.css('.send-button'));
    expect(sendButton).toBeVisible();
    expect(sendButton.nativeElement.disabled).toBeFalse();
    sendButton.nativeElement.click();
    expect(createMessageSpy).toHaveBeenCalled();
  }));

  it('should not send message without recipients', fakeAsync(() => {
    const messageService = spectator.inject(MessageService);
    const createMessageSpy = spyOn(messageService, 'createMessage').and.returnValue(messageSubject);

    groupSubject.next(group);
    tick();
    component.form.setValue({
      recipients: [],
      priority: 1000,
      incident: null,
      content: "content",
    });
    spectator.detectComponentChanges();
    let sendButton = spectator.fixture.debugElement.query(By.css('.send-button'));
    expect(sendButton.nativeElement.disabled).toBeTrue();
    sendButton.nativeElement.click();
    expect(createMessageSpy).not.toHaveBeenCalled();
  }));

  it('should not send message without content', fakeAsync(() => {
    const messageService = spectator.inject(MessageService);
    const createMessageSpy = spyOn(messageService, 'createMessage').and.returnValue(messageSubject);

    groupSubject.next(group);
    tick();
    component.form.setValue({
      recipients: [{id:"id", type: Participant.Role} as RecipientId, {id:"id", type: Participant.AddressBookEntry} as RecipientId, {id:"id", type: Participant.Resource} as RecipientId],
      priority: 1000,
      incident: "incident-id",
      content: "",
    });
    spectator.detectComponentChanges();
    let sendButton = spectator.fixture.debugElement.query(By.css('.send-button'));
    expect(sendButton.nativeElement.disabled).toBeTrue();
    sendButton.nativeElement.click();
    expect(createMessageSpy).not.toHaveBeenCalled();
  }));

  it('should get incident by id', fakeAsync(() => {
    expect(component.getIncidentById("id")).toEqual(incidentSubject);
  }));

  it('should get resource recipient by id', fakeAsync(() => {
    let recipientObs = component.getRecipientById({id: "id", type: Participant.Resource});
    let recipient: Recipient | undefined;
    recipientObs.subscribe(val=>recipient=val);
    resourceSubject.next(resource);
    tick();
    expect(recipient?.label).toEqual(resource.label);
  }));

  it('should get address book recipient by id', fakeAsync(() => {
    let recipientObs = component.getRecipientById({id: "id", type: Participant.AddressBookEntry});
    let recipient: Recipient | undefined;
    recipientObs.subscribe(val=>recipient=val);
    addressBookSubject.next(addressBookEntry);
    tick();
    expect(recipient?.label).toEqual(addressBookEntry.label);
  }));

  it('should get role recipient by id', fakeAsync(() => {
    let recipientObs = component.getRecipientById({id: "id", type: Participant.Role});
    let recipient: Recipient | undefined;
    recipientObs.subscribe(val=>recipient=val);
    groupSubject.next(group);
    tick();
    expect(recipient?.label).toEqual(group.title);
  }));

  it('asRecipient', fakeAsync(() => {
    expect(component.asRecipient(recipient)).toEqual(recipient);
  }));

  it('asIncident', fakeAsync(() => {
    expect(component.asIncident(incident)).toEqual(incident);
  }));

  it('searchIncidents', fakeAsync(() => {
    let incidentsObserved: Incident[] = [];
    component.searchIncidents("query").subscribe(val=>incidentsObserved=val);
    incidentsSubject.next(incidents);
    tick();
    expect(incidentsObserved).toEqual(incidents);
  }));

  it('searchRecipients', fakeAsync(() => {
    let recipientsObserved: Recipient[] = [];
    component.searchRecipients("").subscribe(val=>recipientsObserved=val);
    resourcesSubject.next(resources);
    resourcesSubject.complete();
    addressBookEntriesSubject.next(new SearchResult<AddressBookEntry>(addressBookEntries,{estimatedTotalHits:1, offset:0, limit:1, processingTime:1, query:""}));
    addressBookEntriesSubject.complete();
    groupsSubject.next(new Paginated<Group>(groups, {total: 1, limit: 1, offset: 0, retrieved: 1}));
    groupsSubject.complete();
    tick();
    expect(recipientsObserved[0].label).toEqual(resources[0].label);
    expect(recipientsObserved[1].label).toEqual(addressBookEntries[0].label);
    expect(recipientsObserved[2].label).toEqual(groups[0].title);
  }));

});
