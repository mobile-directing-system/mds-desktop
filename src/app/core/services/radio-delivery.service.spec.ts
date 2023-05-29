import {fakeAsync, tick} from '@angular/core/testing';

import { RadioDeliveryService, NetRadioDelivery } from './radio-delivery.service';
import {createServiceFactory, SpectatorService} from "@ngneat/spectator";
import {NetService} from "./net.service";
import {RadioDelivery} from "../model/radio-delivery";
import {of} from "rxjs";
import createSpy = jasmine.createSpy;

describe('RadioDeliveryService', () => {
  let spectator: SpectatorService<RadioDeliveryService>;
  const createService = createServiceFactory({
    service: RadioDeliveryService,
    mocks: [NetService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  const date = new Date(2020, 8, 3, 10, 10, 10, 10);

  const radioDelivery :RadioDelivery = {
    id: "id",
    intel: "intel",
    intel_operation: "intel_operation",
    intel_importance: 2,
    assigned_to: "assigned_to",
    assigned_to_label: "assigned_to_label",
    delivery: "delivery",
    channel: "channel",
    created_at: date,
    status_ts: date,
    note: "note",
    accepted_at: date,
  }

  const netRadioDelivery: NetRadioDelivery = {
    id: "id",
    intel: "intel",
    intel_operation: "intel_operation",
    intel_importance: 2,
    assigned_to: "assigned_to",
    assigned_to_label: "assigned_to_label",
    delivery: "delivery",
    channel: "channel",
    created_at: date.toISOString(),
    status_ts: date.toISOString(),
    note: "note",
    accepted_at: date.toISOString(),
  }

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  it('should get next radio delivery', fakeAsync(() => {
    expect(spectator).toBeTruthy();
    const getSpy = spectator.inject(NetService).get.and.returnValue(of(netRadioDelivery));
    const cbSpy = createSpy();

    spectator.service.getNextRadioDelivery("operation").subscribe({ next: cbSpy });
    tick();

    expect(getSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/radio-deliveries/operations/operation/next', {});
    expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(radioDelivery);
  }));

  it('should release radio delivery', fakeAsync(() => {
    expect(spectator).toBeTruthy();
    const postSpy = spectator.inject(NetService).post.and.returnValue(of(void 0));
    const cbSpy = createSpy();

    spectator.service.releaseRadioDelivery("attemptId").subscribe({ next: cbSpy });
    tick();

    expect(postSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/radio-deliveries/attemptId/release', {});
    expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(void 0);
  }));

  it('should finish radio delivery as successfully', fakeAsync(() => {
    expect(spectator).toBeTruthy();
    const postSpy = spectator.inject(NetService).postJSON.and.returnValue(of(void 0));
    const cbSpy = createSpy();

    spectator.service.finishRadioDelivery("attemptId", true).subscribe({ next: cbSpy });
    tick();

    expect(postSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/radio-deliveries/attemptId/finish', {
      "success": true,
      "note": ""
    }, {});
    expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(void 0);
  }));

  it('should finish radio delivery as not successfully', fakeAsync(() => {
    expect(spectator).toBeTruthy();
    const postSpy = spectator.inject(NetService).postJSON.and.returnValue(of(void 0));
    const cbSpy = createSpy();

    spectator.service.finishRadioDelivery("attemptId", false).subscribe({ next: cbSpy });
    tick();

    expect(postSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/radio-deliveries/attemptId/finish', {
      "success": false,
      "note": ""
    }, {});
    expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(void 0);
  }));
});
