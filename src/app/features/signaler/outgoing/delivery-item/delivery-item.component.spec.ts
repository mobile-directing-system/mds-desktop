import {fakeAsync, tick} from '@angular/core/testing';

import {DeliveryItemComponent} from './delivery-item.component';
import {CoreModule} from "../../../../core/core.module";
import {Message, MessageDirection, Participant} from "../../../../core/model/message";
import {Channel, ChannelType} from "../../../../core/model/channel";
import {duration} from "moment";
import {DeliveryItemDialogAction, DeliveryItemDialogData} from "../signaler-outgoing-view.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {byTextContent, createRoutingFactory, SpectatorRouting} from "@ngneat/spectator";

describe('DeliveryItemComponent', () => {
  const message: Message = {
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
  };
  const channel: Channel = {
    id: "channelId1",
    details: {info:"info"},
    entry: "address-bookId",
    isActive: false,
    label: "label",
    minImportance: 0,
    priority: 0,
    timeout: duration(10000),
    type:  ChannelType.Radio
  };

  const data: DeliveryItemDialogData= {
    message: message,
    senderLabel: "senderLabel",
    incidentLabel: "incidentLabel",
    recipientLabel: "recipientLabel",
    recipientChannel: channel
  }
  let closed = false;

  let spectator: SpectatorRouting<DeliveryItemComponent>;
  let component: DeliveryItemComponent;

  const createComponent = createRoutingFactory({
    component: DeliveryItemComponent,
    imports: [
      CoreModule,
    ],
    providers: [
      {
        provide: MatDialogRef<DeliveryItemComponent>,
        useValue: {
          close: ()=> {
            closed = true;
          },
        },
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          data: ()=> data
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(fakeAsync(() => {
    spectator = createComponent();
    component = spectator.component;
    component.data = data;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.detectComponentChanges();
    tick();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close', () => {
    expect(closed).toBeFalse();
    component.closeDialog(DeliveryItemDialogAction.Cancel);
    expect(closed).toBeTrue();
  });

  it('should show data successfully', fakeAsync(() => {
    expect(spectator.query(byTextContent(data.message.content, {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  }));
});
