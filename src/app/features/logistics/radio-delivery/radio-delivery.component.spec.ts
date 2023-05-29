import {fakeAsync, tick} from '@angular/core/testing';

import { RadioDeliveryComponent } from './radio-delivery.component';
import {createRoutingFactory, SpectatorRouting} from "@ngneat/spectator";
import {CoreModule} from "../../../core/core.module";
import {AccessControlService} from "../../../core/services/access-control.service";
import {AccessControlMockService} from "../../../core/services/access-control-mock.service";
import {LogisticsModule} from "../logistics.module";
import {Subject} from "rxjs";
import {RadioDeliveryService} from "../../../core/services/radio-delivery.service";
import {WorkspaceService} from "../../../core/services/workspace.service";
import {NotificationService} from "../../../core/services/notification.service";
import {IntelService} from "../../../core/services/intel.service";
import {RadioDelivery} from "../../../core/model/radio-delivery";
import {Intel, IntelType, PlaintextMessageIntel} from "../../../core/model/intel";

describe('RadioDeliveryComponent', () => {
  let spectator: SpectatorRouting<RadioDeliveryComponent>;
  let component: RadioDeliveryComponent;

  const operationSubject = new Subject<string | undefined>();
  const radioDeliverySubject: Subject<RadioDelivery | undefined> = new Subject<RadioDelivery | undefined>();
  const radioDelivery :RadioDelivery = {
    id: "id",
    intel: "intel",
    intel_operation: "intel_operation",
    intel_importance: 2,
    assigned_to: "assigned_to",
    assigned_to_label: "assigned_to_label",
    delivery: "delivery",
    channel: "channel",
    created_at: new Date(),
    status_ts: new Date(),
    note: "note",
    accepted_at: new Date(),
  }

  const intelSubject: Subject<Intel> = new Subject<Intel>();
  const intel: PlaintextMessageIntel = {
    createdAt: new Date(),
    createdBy: "createdBy",
    id: "id",
    importance: 0,
    isValid: true,
    operation: "operation",
    searchText: "searchText",
    type: IntelType.PlainTextMessage,
    content: {text: "text"},
  }

  const voidSubject: Subject<void> = new Subject<void>();




  const createComponent = createRoutingFactory({
    component: RadioDeliveryComponent,
    imports: [
      CoreModule,
      LogisticsModule,
    ],
    providers: [
      {
        provide: AccessControlService,
        useExisting: AccessControlMockService,
      },
      {
        provide: WorkspaceService,
        useValue: {
          operationChange: ()=> operationSubject,
        },
      },
    ],
    mocks: [
      RadioDeliveryService,
      NotificationService,
      IntelService
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

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should pick up and release radio delivery', fakeAsync(() => {
    // prepare
    operationSubject.next("operation");
    spectator.inject(RadioDeliveryService).getNextRadioDelivery.and.returnValue(radioDeliverySubject)
    spectator.inject(IntelService).getIntelById.andReturn(intelSubject);
    spectator.inject(RadioDeliveryService).releaseRadioDelivery.andReturn(voidSubject);
    tick();

    // pick up
    component.pickUpNextRadioDelivery()
    tick();
    radioDeliverySubject.next(radioDelivery);
    tick();
    intelSubject.next(intel);
    tick();
    expect(spectator.component.detailedRadioDelivery?.radioDelivery.id).toEqual(radioDelivery.id);

    // release
    component.releaseCurrentRadioDelivery()
    tick();
    voidSubject.next();
    tick();
    expect(spectator.component.detailedRadioDelivery?.radioDelivery).toBeUndefined()
  }));

  it('should pick up and finish delivery', fakeAsync(() => {
    // prepare
    operationSubject.next("operation");
    spectator.inject(RadioDeliveryService).getNextRadioDelivery.and.returnValue(radioDeliverySubject)
    spectator.inject(IntelService).getIntelById.andReturn(intelSubject);
    spectator.inject(RadioDeliveryService).finishRadioDelivery.andReturn(voidSubject);
    tick();

    // pick up
    component.pickUpNextRadioDelivery()
    tick();
    radioDeliverySubject.next(radioDelivery);
    tick();
    intelSubject.next(intel);
    tick();
    expect(spectator.component.detailedRadioDelivery?.radioDelivery.id).toEqual(radioDelivery.id);

    // finish
    component.finishCurrentRadioDelivery(true);
    tick();
    voidSubject.next();
    tick();
    expect(spectator.component.detailedRadioDelivery?.radioDelivery).toBeUndefined()
  }));

  it('should release radio delivery on destroy', fakeAsync(() => {
    // prepare
    operationSubject.next("operation");
    spectator.inject(RadioDeliveryService).getNextRadioDelivery.and.returnValue(radioDeliverySubject)
    spectator.inject(IntelService).getIntelById.andReturn(intelSubject);
    spectator.inject(RadioDeliveryService).releaseRadioDelivery.andReturn(voidSubject);
    tick();

    // pick up
    component.pickUpNextRadioDelivery()
    tick();
    radioDeliverySubject.next(radioDelivery);
    tick();
    intelSubject.next(intel);
    tick();
    expect(spectator.component.detailedRadioDelivery?.radioDelivery.id).toEqual(radioDelivery.id);

    // should release on destroy
    component.ngOnDestroy()
    tick();
    voidSubject.next();
    tick();
    expect(spectator.component.detailedRadioDelivery?.radioDelivery).toBeUndefined()
  }));
});
