import { IntelDeliveryView } from './intel-delivery-view.component';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { WebSocketService } from '../../../../core/services/web-socket.service';
import { ManualIntelDeliveryMockService } from '../../../../core/services/manual-intel-delivery-mock.service';
import { ManualIntelDeliveryService } from '../../../../core/services/manual-intel-delivery.service';
import { IntelDeliveryService } from '../../../../core/services/intel-delivery.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { MatDialog } from '@angular/material/dialog';
import { CoreModule } from '../../../../core/core.module';
import { IntelDeliveryModule } from '../intel-delivery.module';
import { of } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { IntelDeliveryStatusComponent } from '../intel-delivery-status/intel-delivery-status.component';
import { IntelToDeliverAttemptsComponent } from '../intel-to-deliver-attempts/intel-to-deliver-attempts.component';
import {
  IntelToDeliverChannelSelectionComponent,
} from '../intel-to-deliver-channel-selection/intel-to-deliver-channel-selection.component';

describe('IntelDeliveryView', () => {
  let spectator: SpectatorRouting<IntelDeliveryView>;
  let component: IntelDeliveryView;
  let manualIntelDeliveryService = new ManualIntelDeliveryMockService();
  const createComponent = createRoutingFactory({
    component: IntelDeliveryView,
    imports: [
      CoreModule,
      IntelDeliveryModule,
    ],
    mocks: [
      WebSocketService,
      IntelDeliveryService,
      NotificationService,
      MatDialog,
      WorkspaceService,
    ],
    declarations: [
      MockComponent(IntelDeliveryStatusComponent),
      MockComponent(IntelToDeliverAttemptsComponent),
      MockComponent(IntelToDeliverChannelSelectionComponent),
    ],
    detectChanges: false,
  });
  const operationId = 'flood';

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
    spectator.inject(WorkspaceService).operationChange.and.returnValue(of(operationId));
    spectator.detectChanges();
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
