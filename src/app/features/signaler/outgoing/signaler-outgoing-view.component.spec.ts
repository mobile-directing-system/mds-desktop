import {fakeAsync, flush, tick} from '@angular/core/testing';
import {DeliveryItemDialogAction, SignalerOutgoingView} from './signaler-outgoing-view.component';
import {createRoutingFactory, SpectatorRouting} from "@ngneat/spectator";
import {Subject} from "rxjs";
import {Message, MessageDirection, Participant} from "../../../core/model/message";
import {Group} from "../../../core/model/group";
import {Channel, ChannelType} from "../../../core/model/channel";
import {CoreModule} from "../../../core/core.module";
import {MatDialogModule} from "@angular/material/dialog";
import {AccessControlService} from "../../../core/services/access-control.service";
import {AccessControlMockService} from "../../../core/services/access-control-mock.service";
import {MessageService} from "../../../core/services/message/message.service";
import {NotificationService} from "../../../core/services/notification.service";
import {AuthService} from "../../../core/services/auth.service";
import {ResourceService} from "../../../core/services/resource/resource.service";
import {AddressBookService} from "../../../core/services/addressbook.service";
import {GroupService} from "../../../core/services/group.service";
import {IncidentService} from "../../../core/services/incident/incident.service";
import {ChannelService} from "../../../core/services/channel.service";
import {Resource} from "../../../core/model/resource";
import {AddressBookEntry} from "../../../core/model/address-book-entry";
import {Incident} from "../../../core/model/incident";
import {WorkspaceService} from "../../../core/services/workspace.service";
import {duration} from "moment/moment";

describe('SignalerOutgoingView', () => {
  let spectator: SpectatorRouting<SignalerOutgoingView>;
  let component: SignalerOutgoingView;

  let workSpaceSubject =new Subject<String | undefined>();
  let pickUpNextMessageToDeliverSubject  = new Subject<Message | undefined>();
  let releaseMessageToDeliverSubject = new Subject<boolean>();
  let markMessageAsSendSubject = new Subject<boolean>();
  let getResourceSubject = new Subject<Resource>();
  let getAddressBookEntrySubject = new Subject<AddressBookEntry>();
  let getGroupSubject = new Subject<Group>();
  let getIncidentSubject = new Subject<Incident>();
  let getChannelsSubject = new Subject<Channel []>();


  const pickedUpMessage: Message = {
    id: "4",
    direction: MessageDirection.Outgoing,
    senderType: Participant.Role,
    senderId: "S2",
    content: "A message from S2",
    createdAt: new Date(),
    needsReview: false,
    operationId: "123",
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

  const group: Group = {
    id: "loggedInRoleId",
    title: "S1",
    description: "description",
    members:["loggedInUserId"]
  };

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

  const channels: Channel[] = [
    {
      id: "channelId1",
      details: {name: "channel 1", info:"channel 2 info"},
      entry: "address-bookId",
      isActive: false,
      label: "label",
      minImportance: 0,
      priority: 0,
      timeout: duration(10000),
      type:  ChannelType.Radio
    },
    {
      id: "channelId2",
      details: {name: "channel 2", info:"channel 2info"},
      entry: "address-bookId",
      isActive: false,
      label: "label",
      minImportance: 0,
      priority: 0,
      timeout: duration(10000),
      type:  ChannelType.Radio
    }
  ]




  const createComponent = createRoutingFactory({
    component: SignalerOutgoingView,
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
          pickUpNextMessageToDeliver: ()=> pickUpNextMessageToDeliverSubject,
          releaseMessageToDeliver: ()=> releaseMessageToDeliverSubject,
          markMessageAsSend: () => markMessageAsSendSubject,
        },
      },
      {
        provide: ResourceService,
        useValue: {
          getResourceById: ()=> getResourceSubject,
        },
      },
      {
        provide: AddressBookService,
        useValue: {
          getAddressBookEntryById: ()=> getAddressBookEntrySubject,
        },
      },
      {
        provide: GroupService,
        useValue: {
          getGroupById: ()=> getGroupSubject,
        },
      },
      {
        provide: IncidentService,
        useValue: {
          getIncidentById: ()=> getIncidentSubject,
        },
      },
      {
        provide: ChannelService,
        useValue: {
          getChannelsByAddressBookEntry: ()=> getChannelsSubject,
        },
      },
      {
        provide: WorkspaceService,
        useValue: {
          operationChange: ()=> workSpaceSubject,
        },
      },
      {
        provide: AuthService,
        useValue: {
          loggedInUser: ()=> "loggedInUserId",
        },
      },
    ],
    mocks: [
      NotificationService
    ],
    detectChanges: false,
  });


  beforeEach(fakeAsync(() => {

     workSpaceSubject =new Subject<String | undefined>();
     pickUpNextMessageToDeliverSubject  = new Subject<Message | undefined>();
     releaseMessageToDeliverSubject = new Subject<boolean>();
     markMessageAsSendSubject = new Subject<boolean>();
     getResourceSubject = new Subject<Resource>();
     getAddressBookEntrySubject = new Subject<AddressBookEntry>();
     getGroupSubject = new Subject<Group>();
     getIncidentSubject = new Subject<Incident>();
     getChannelsSubject = new Subject<Channel []>();

    spectator = createComponent();
    component = spectator.component;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.detectComponentChanges();
    tick();
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should release message on destroy', fakeAsync(() => {
    component.pickedUpMessage = pickedUpMessage;
    component.ngOnDestroy();
    expect(releaseMessageToDeliverSubject.observed).toBeTrue();
    releaseMessageToDeliverSubject.next(true);
    releaseMessageToDeliverSubject.complete();
    tick();
    expect(component.pickedUpMessage).toBeUndefined();
  }));

  it('should pick up next message to deliver', fakeAsync(() => {
    workSpaceSubject.next("workSpaceId");
    component.pickUpNextMessageToDeliver()
    pickUpNextMessageToDeliverSubject.next(pickedUpMessage);
    pickUpNextMessageToDeliverSubject.complete();
    tick();
    expect(component.pickedUpMessage?.id).toEqual(pickedUpMessage.id)
  }));

  it('should release current message', fakeAsync(() => {
    component.pickedUpMessage = pickedUpMessage;

    component.releaseCurrentMessage();
    expect(releaseMessageToDeliverSubject.observed).toBeTrue();
    releaseMessageToDeliverSubject.next(true);
    releaseMessageToDeliverSubject.complete();
    tick();
    expect(component.pickedUpMessage).toBeUndefined();
  }));

  it('should mark current message as send', fakeAsync(() => {
    component.pickedUpMessage = pickedUpMessage;

    component.markCurrentMessageAsSend();
    expect(markMessageAsSendSubject.observed).toBeTrue();
    markMessageAsSendSubject.next(true);
    markMessageAsSendSubject.complete();
    tick();
    expect(component.pickedUpMessage).toBeUndefined();
  }));

  it('should get participant label of resource', fakeAsync(() => {
    component.getParticipantLabel(Participant.Resource, "id").subscribe(val=>{
      expect(val).toEqual(resource.label)
    });
    getResourceSubject.next(resource);
    getResourceSubject.complete();
  }));

  it('should get participant label of address book entry', fakeAsync(() => {
    component.getParticipantLabel(Participant.AddressBookEntry, "id").subscribe(val=>{
      expect(val).toEqual(addressBookEntry.label)
    });
    getAddressBookEntrySubject.next(addressBookEntry);
    getAddressBookEntrySubject.complete();
  }));

  it('should get participant label of role', fakeAsync(() => {
    component.getParticipantLabel(Participant.Role, "id").subscribe(val=>{
      expect(val).toEqual(group.title)
    });
    getGroupSubject.next(group);
    getGroupSubject.complete();
  }));

  it('should return undefined for get participant label of undefined', fakeAsync(() => {
    component.getParticipantLabel(undefined, "id").subscribe(val=>{
      expect(val).toBeUndefined()
    });
  }));

  it('should get incident label', fakeAsync(() => {
    component.getIncidentLabel("id").subscribe(val=>{
      expect(val).toEqual(incident.name)
    });
    getIncidentSubject.next(incident);
    getIncidentSubject.complete();
  }));

  it('should return undefined for getting undefined incident label', fakeAsync(() => {
    component.getIncidentLabel(undefined).subscribe(val=>{
      expect(val).toBeUndefined()
    });
  }));

  it('should get channel', fakeAsync(() => {
    component.getChannel(pickedUpMessage.recipients.at(0)).subscribe(val=>{
      expect(val?.id).toEqual(pickedUpMessage.recipients.at(0)?.channelId)
    });
    getChannelsSubject.next(channels);
    getChannelsSubject.complete();
  }));

  it('should return undefined for undefined get channel', fakeAsync(() => {
    component.getChannel(undefined).subscribe(val=>{
      expect(val).toBeUndefined();
    });
  }));

  it('should open and close dialog', fakeAsync(() => {
    component.openDeliveryItemDialog({
        message: pickedUpMessage,
        senderLabel: "senderLabel",
        incidentLabel: "incidentLabel",
        recipientLabel: "recipientLabel",
        recipientChannel: channels.at(0)
    });
    expect(component.dialog.openDialogs.length).toBe(1);
    component.dialog.openDialogs[0].close(DeliveryItemDialogAction.MarkAsSend);
    flush();
  }));
});
