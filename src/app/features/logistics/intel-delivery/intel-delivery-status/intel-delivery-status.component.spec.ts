import { IntelDeliveryStatusComponent } from './intel-delivery-status.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { WebSocketService } from '../../../../core/services/web-socket.service';
import { IntelDeliveryService } from '../../../../core/services/intel-delivery.service';
import { of } from 'rxjs';
import { ManualIntelDeliveryService } from '../../../../core/services/manual-intel-delivery.service';
import { ManualIntelDeliveryMockService } from '../../../../core/services/manual-intel-delivery-mock.service';

describe('IntelDeliveryStatusComponent', () => {
  let spectator: Spectator<IntelDeliveryStatusComponent>;
  let component: IntelDeliveryStatusComponent;
  let manualIntelDeliveryService = new ManualIntelDeliveryMockService();
  const createComponent = createComponentFactory({
    component: IntelDeliveryStatusComponent,
    mocks: [WebSocketService, IntelDeliveryService],
    detectChanges: false,
  });
  const subscribed = ['greed'];

  beforeEach(async () => {
    manualIntelDeliveryService = new ManualIntelDeliveryMockService();
    spectator = createComponent({
      providers: [
        {
          provide: ManualIntelDeliveryService,
          useValue: manualIntelDeliveryService,
        },
      ],
    });
    component = spectator.component;
    spectator.inject(WebSocketService).connectedChange.and.returnValue(of(true));
    spectator.inject(IntelDeliveryService).subscribedOpenIntelDeliveryOperationsChange.and.returnValue(of(subscribed));
    spectator.detectChanges();
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show indicator for no websocket connection', async () => {
    spectator.inject(WebSocketService).connectedChange.and.returnValue(of(false));

    component.ngOnDestroy();
    component.ngOnInit();
    spectator.detectChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('No realtime updates', {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  });

  it('should show indicator for websocket connection', async () => {
    expect(spectator.query(byTextContent('Realtime updates for', {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  });

  it('should show subscribed operation count', async () => {
    expect(spectator.query(byTextContent(`${ component.subscribedOperations.length }`, {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  });

  it('should show warning for one-person operation', () => {
    expect(spectator.query(byTextContent('one person at a time', {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  });
});
