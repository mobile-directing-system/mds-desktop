import { IntelToDeliverAttemptsComponent } from './intel-to-deliver-attempts.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { ManualIntelDeliveryMockService } from '../../../../core/services/manual-intel-delivery-mock.service';
import { CoreModule } from '../../../../core/core.module';
import { IntelDeliveryModule } from '../intel-delivery.module';
import {
  DetailedOpenIntelDelivery,
  ManualIntelDeliveryService,
} from '../../../../core/services/manual-intel-delivery.service';
import { IntelDeliveryAttempt, IntelDeliveryAttemptStatus } from '../../../../core/model/intel-delivery';
import { Importance } from '../../../../core/model/importance';
import { ChannelType } from '../../../../core/model/channel';
import * as moment from 'moment';
import { formatDurationLong } from '../../../../core/pipes/duration.pipe';

describe('IntelToDeliverAttemptsComponent', () => {
  let spectator: Spectator<IntelToDeliverAttemptsComponent>;
  let component: IntelToDeliverAttemptsComponent;
  let createComponent = createComponentFactory({
    component: IntelToDeliverAttemptsComponent,
    imports: [
      CoreModule,
      IntelDeliveryModule,
    ],
  });
  let manualIntelDeliveryService = new ManualIntelDeliveryMockService();
  let attempt: IntelDeliveryAttempt;
  let selected: DetailedOpenIntelDelivery;

  beforeEach(async () => {
    manualIntelDeliveryService = new ManualIntelDeliveryMockService();
    attempt = {
      id: 'castle',
      note: 'shop',
      status: IntelDeliveryAttemptStatus.Failed,
      statusTS: new Date(),
      isActive: false,
      createdAt: new Date(),
      channel: 'harvest',
      delivery: 'insure',
    };
    selected = {
      delivery: {
        delivery: {
          id: 'proper',
          intel: 'tremble',
          to: 'rent',
        },
        intel: {
          id: 'proper',
          isValid: true,
          createdAt: new Date(),
          createdBy: 'this',
          importance: Importance.Regular,
          operation: 'blood',
        },
      },
      attempts: [attempt],
      recipientChannels: [
        {
          id: 'harvest',
          type: ChannelType.Radio,
          timeout: moment.duration({ seconds: 23 }),
          minImportance: Importance.Regular,
          entry: 'rent',
          details: {
            name: 'channel 2',
            info: 'channel 2 info'
          },
          isActive: true,
          priority: 144,
          label: 'mix',
        },
      ],
    };
    spectator = createComponent({
      providers: [
        {
          provide: ManualIntelDeliveryService,
          useValue: manualIntelDeliveryService,
        },
      ],
    });
    component = spectator.component;
    manualIntelDeliveryService.selected.next(selected);
    spectator.detectChanges();
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all attempts', async () => {
    selected.attempts = [
      {
        id: 'castle',
        note: 'shop',
        status: IntelDeliveryAttemptStatus.Failed,
        statusTS: new Date(),
        isActive: false,
        createdAt: new Date(),
        channel: 'harvest',
        delivery: 'insure',
      },
      {
        id: 'game',
        status: IntelDeliveryAttemptStatus.Canceled,
        statusTS: new Date(),
        isActive: false,
        createdAt: new Date(),
        channel: 'spit',
        delivery: 'insure',
      },
    ];

    manualIntelDeliveryService.selected.next(selected);
    spectator.detectChanges();
    await spectator.fixture.whenStable();

    expect(spectator.queryAll('.attempt').length).toBe(selected.attempts.length);
  });

  it('should display attempt timestamp', () => {
    expect(spectator.query(byTextContent(component.fromNow(attempt.createdAt), {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  });

  it('should display channel label', () => {
    expect(spectator.query(byTextContent(selected.recipientChannels![0].label, {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  });

  it('should display failed-after duration', () => {
    expect(spectator.query(byTextContent(formatDurationLong(component.attemptFailedAfter(attempt.createdAt, attempt.statusTS)), {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  });

  it('should display attempt note', () => {
    expect(spectator.query(byTextContent(attempt.note!, {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  });
});
