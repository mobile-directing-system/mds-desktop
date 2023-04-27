import { IntelDeliveryService } from './intel-delivery.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { WebSocketService } from './web-socket.service';
import { NetService } from './net.service';
import { WebSocketMockService } from './web-socket-mock.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { Channel } from '../ws-message/ws-message';
import { OpenIntelDeliveriesMessage } from '../ws-message/open-intel-delivery-notifier';
import { Importance } from '../model/importance';
import { of, throwError } from 'rxjs';

function genDelivery(): {
  delivery: {
    id: string;
    intel: string;
    to: string;
    note?: string;
  },
  intel: {
    id: string;
    created_at: string;
    created_by: string;
    operation: string;
    importance: number;
    is_valid: boolean;
  }
} {
  return {
    delivery: {
      id: `${ Math.round(Math.random() * 10000) }`,
      intel: 'homemade',
      to: 'bleed',
      note: 'blood',
    },
    intel: {
      id: 'homemade',
      operation: 'stuff',
      importance: Importance.Regular,
      created_at: new Date(Date.parse('2023-04-24T13:15:20Z')).toISOString(),
      created_by: 'count',
      is_valid: true,
    },
  };
}

describe('IntelDeliveryService', () => {
  let spectator: SpectatorService<IntelDeliveryService>;
  let service: IntelDeliveryService;
  const createService = createServiceFactory({
    service: IntelDeliveryService,
    mocks: [NetService],
  });
  let wsService = new WebSocketMockService();

  beforeEach(fakeAsync(() => {
      wsService = new WebSocketMockService();
      spectator = createService({
        providers: [
          {
            provide: WebSocketService,
            useValue: wsService,
          },
        ],
      });
      service = spectator.service;
      tick();
    },
  ));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should notify about updated subscribed open intel deliveries', fakeAsync(() => {
    const operations = ['bound', 'roast', 'hurt', 'grass', 'curious'];
    const spy = jasmine.createSpy();
    service.subscribedOpenIntelDeliveryOperationsChange().subscribe(spy);

    wsService.emitIncoming({
      channel: Channel.OpenIntelDeliveryNotifier,
      payload: {
        type: 'subscribed-open-intel-deliveries',
        payload: {
          operations: operations,
        },
      },
    });
    tick();

    expect(spy).toHaveBeenCalledWith(operations);
  }));

  it('should not notify about changed intel deliveries if not subscribed', fakeAsync(() => {
    const message: OpenIntelDeliveriesMessage = {
      type: 'open-intel-deliveries',
      payload: {
        operation: 'frame',
        open_intel_deliveries: [
          genDelivery(),
          genDelivery(),
          genDelivery(),
        ],
      },
    };
    const spy = jasmine.createSpy();

    service.getOpenIntelDeliveries('present').subscribe(spy);
    tick();
    wsService.emitIncoming({
      channel: Channel.OpenIntelDeliveryNotifier,
      payload: message,
    });
    tick();

    expect(spy).toHaveBeenCalledOnceWith([]);
  }));

  it('should notify subscribers about changed intel deliveries', fakeAsync(() => {
    const message: OpenIntelDeliveriesMessage = {
      type: 'open-intel-deliveries',
      payload: {
        operation: 'frame',
        open_intel_deliveries: [
          genDelivery(),
          genDelivery(),
          genDelivery(),
        ],
      },
    };
    const spy = jasmine.createSpy();

    service.getOpenIntelDeliveries('frame').subscribe(spy);
    tick();
    wsService.emitIncoming({
      channel: Channel.OpenIntelDeliveryNotifier,
      payload: message,
    });
    tick();

    expect(spy).toHaveBeenCalledTimes(2);
  }));

  it('should send a subscribe message on subscribe', fakeAsync(() => {
    service.getOpenIntelDeliveries('block').subscribe();
    tick();
    expect(wsService.outbox.length).toEqual(1);
  }));

  it('should send only one subscribe message on multiple subscribe', fakeAsync(() => {
    service.getOpenIntelDeliveries('block').subscribe();
    service.getOpenIntelDeliveries('block').subscribe();
    service.getOpenIntelDeliveries('block').subscribe();
    tick();
    expect(wsService.outbox.length).toEqual(1);
  }));

  it('should send unsubscribe message on unsubscribe', fakeAsync(() => {
    const s = service.getOpenIntelDeliveries('block').subscribe();
    tick();
    s.unsubscribe();
    expect(wsService.outbox.length).toEqual(2);
  }));

  it('should send unsubscribe message only when last one unsubscribes', fakeAsync(() => {
    const s1 = service.getOpenIntelDeliveries('block').subscribe();
    const s2 = service.getOpenIntelDeliveries('block').subscribe();
    const s3 = service.getOpenIntelDeliveries('block').subscribe();
    tick();
    expect(wsService.outbox.length).toEqual(1);
    s1.unsubscribe();
    tick();
    expect(wsService.outbox.length).toEqual(1);
    s2.unsubscribe();
    tick();
    expect(wsService.outbox.length).toEqual(1);
    s3.unsubscribe();
    tick();
    expect(wsService.outbox.length).toEqual(2);
  }));

  describe('scheduleDeliveryAttempt', () => {
    const deliveryId = 'guide';
    const channelId = 'down';

    it('should schedule attempt correctly', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).post.and.returnValue(of(void 0));
      const cbSpy = jasmine.createSpy();

      service.scheduleDeliveryAttempt(deliveryId, channelId).subscribe({ next: cbSpy });
      tick();

      expect(cbSpy).toHaveBeenCalledOnceWith(void 0);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).post.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = jasmine.createSpy();

      service.scheduleDeliveryAttempt(deliveryId, channelId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(cbSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('markDeliveryAsDelivered', () => {
    const deliveryId = 'shoot';

    it('should mark correctly', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).post.and.returnValue(of(void 0));
      const cbSpy = jasmine.createSpy();

      service.markDeliveryAsDelivered(deliveryId).subscribe({ next: cbSpy });
      tick();

      expect(postSpy).toHaveBeenCalledOnceWith('/intel-deliveries/shoot/delivered', {});
      expect(cbSpy).toHaveBeenCalledOnceWith(void 0);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).post.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = jasmine.createSpy();

      service.markDeliveryAsDelivered(deliveryId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(cbSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('markDeliveryAttemptAsDelivered', () => {
    const attemptId = 'stone';

    it('should mark correctly', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).post.and.returnValue(of(void 0));
      const cbSpy = jasmine.createSpy();

      service.markDeliveryAttemptAsDelivered(attemptId).subscribe({ next: cbSpy });
      tick();

      expect(postSpy).toHaveBeenCalledOnceWith('/intel-delivery-attempts/stone/delivered', {});
      expect(cbSpy).toHaveBeenCalledOnceWith(void 0);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).post.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = jasmine.createSpy();

      service.markDeliveryAttemptAsDelivered(attemptId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(cbSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('cancelIntelDeliveryById', () => {
    const deliveryId = 'hook';
    const success = true;
    const note = 'cap';
    const expectCancellation = {
      success: success,
      note: note,
    };

    it('should cancel correctly', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(of(void 0));
      const cbSpy = jasmine.createSpy();

      service.cancelIntelDeliveryById(deliveryId, success, note).subscribe({ next: cbSpy });
      tick();

      expect(cbSpy).toHaveBeenCalledOnceWith(void 0);
      expect(postSpy).toHaveBeenCalledOnceWith('/intel-deliveries/hook/cancel', expectCancellation, {});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = jasmine.createSpy();

      service.cancelIntelDeliveryById(deliveryId, success, note).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(cbSpy).toHaveBeenCalledTimes(1);
    }));
  });
});
