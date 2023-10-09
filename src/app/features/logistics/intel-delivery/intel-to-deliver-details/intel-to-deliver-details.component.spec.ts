import { IntelToDeliverDetailsComponent } from './intel-to-deliver-details.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  DetailedOpenIntelDelivery,
  ManualIntelDeliveryService,
} from '../../../../core/services/manual-intel-delivery.service';
import { Importance } from '../../../../core/model/importance';
import { IntelType } from '../../../../core/model/intel';
import { Channel, ChannelType } from '../../../../core/model/channel';
import * as moment from 'moment/moment';
import { IntelDeliveryAttempt, IntelDeliveryAttemptStatus } from '../../../../core/model/intel-delivery';
import { CoreModule } from '../../../../core/core.module';
import { IntelDeliveryModule } from '../intel-delivery.module';
import { ManualIntelDeliveryMockService } from '../../../../core/services/manual-intel-delivery-mock.service';

function genChannel(): Channel {
  return {
    id: 'fair' + Math.round(Math.random() * 10000),
    label: 'ago',
    isActive: true,
    priority: Math.random() * 100,
    entry: 'bleed',
    type: ChannelType.Radio,
    details: {
      info: 'channel 2'
    },
    timeout: moment.duration({ seconds: 1 }),
    minImportance: Importance.Low,
  };
}

function genAttempt(): IntelDeliveryAttempt {
  return {
    id: 'bend',
    channel: 'cap',
    statusTS: new Date(),
    isActive: false,
    status: IntelDeliveryAttemptStatus.Timeout,
    createdAt: new Date(),
    delivery: 'meantime',
  };
}

describe('IntelToDeliverDetailsComponent', () => {
  let spectator: Spectator<IntelToDeliverDetailsComponent>;
  let component: IntelToDeliverDetailsComponent;
  let selected: DetailedOpenIntelDelivery;
  const createComponent = createComponentFactory({
    component: IntelToDeliverDetailsComponent,
    imports: [
      CoreModule,
      IntelDeliveryModule,
    ],
  });
  let manualIntelDeliveryService = new ManualIntelDeliveryMockService();

  beforeEach(async () => {
    selected = {
      delivery: {
        delivery: {
          id: 'smoke',
          intel: 'homemade',
          to: 'bleed',
          note: 'blood',
        },
        intel: {
          id: 'homemade',
          operation: 'stuff',
          importance: Importance.Regular,
          createdAt: new Date(Date.parse('2023-04-24T13:15:20Z')),
          createdBy: 'count',
          isValid: true,
        },
      },
    };
    selected.intel = {
      id: 'homemade',
      operation: 'stuff',
      importance: Importance.Regular,
      createdAt: selected.delivery.intel.createdAt,
      isValid: true,
      createdBy: 'count',
      type: IntelType.PlainTextMessage,
      content: {
        text: 'further',
      },
      searchText: 'boy',
    };
    selected.operation = {
      id: 'stuff',
      start: new Date(),
      end: undefined,
      title: 'band',
      description: 'creep',
      isArchived: false,
    };
    selected.recipientChannels = [
      genChannel(),
      genChannel(),
      genChannel(),
    ];
    selected.intelCreator = {
      id: 'count',
      isActive: true,
      firstName: 'parent',
      lastName: 'tree',
      isAdmin: false,
      username: 'remember',
    };
    selected.recipientEntry = {
      id: 'bleed',
      label: 'find',
      description: 'ticket',
    };
    selected.attempts = [
      genAttempt(),
      genAttempt(),
    ];
    manualIntelDeliveryService = new ManualIntelDeliveryMockService();
    manualIntelDeliveryService.selected.next(selected);

    spectator = createComponent({
      providers: [
        {
          provide: ManualIntelDeliveryService,
          useValue: manualIntelDeliveryService,
        },
      ],
    });
    component = spectator.component;
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display intel type', () => {
    expect(spectator.query('app-intel-type-inline')).toBeVisible();
  });

  it('should display importance', () => {
    expect(spectator.query('app-importance-inline')).toBeVisible();
  });

  it('should display the operation name', () => {
    expect(spectator.query(byTextContent(selected.operation!.title, {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  });

  it('should display the intel creator\'s full name', () => {
    expect(spectator.query(byTextContent(selected.intelCreator!.firstName, {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
    expect(spectator.query(byTextContent(selected.intelCreator!.lastName, {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  });

  it('should display intel summary', () => {
    expect(spectator.query('app-intel-summary')).toBeVisible();
  });
});
