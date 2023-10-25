import { OpenIntelDeliveriesTableComponent } from './open-intel-deliveries-table.component';
import { Channel, ChannelType } from '../../../../core/model/channel';
import * as moment from 'moment';
import { Importance } from '../../../../core/model/importance';
import { IntelDeliveryAttempt, IntelDeliveryAttemptStatus } from '../../../../core/model/intel-delivery';
import { byTextContent, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { DetailedOpenIntelDelivery } from '../../../../core/services/manual-intel-delivery.service';
import { CoreModule } from '../../../../core/core.module';
import { IntelDeliveryModule } from '../intel-delivery.module';
import { ManualIntelDeliveryMockService } from '../../../../core/services/manual-intel-delivery-mock.service';
import { IntelType } from '../../../../core/model/intel';

function genChannel(): Channel {
  return {
    id: 'fair' + Math.round(Math.random() * 10000),
    label: 'ago',
    isActive: true,
    priority: Math.random() * 100,
    entry: 'bleed',
    type: ChannelType.Radio,
    details: {
      info: 'channel 4'
    },
    timeout: moment.duration({ seconds: 1 }),
    minImportance: Importance.Regular,
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

describe('OpenIntelDeliveriesTableComponent', () => {
  let spectator: SpectatorRouting<OpenIntelDeliveriesTableComponent>;
  let component: OpenIntelDeliveriesTableComponent;
  let selected: DetailedOpenIntelDelivery;
  const createComponent = createRoutingFactory({
    component: OpenIntelDeliveriesTableComponent,
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

    spectator = createComponent({
      detectChanges: false,
    });
    component = spectator.component;
    component.openIntelDeliveries = [selected];
    spectator.detectChanges();
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show open intel deliveries table', () => {
    expect(spectator.query('table')).toBeVisible();
  });

  it('should show user attributes in table', () => {
    const attributes = [
      `${ selected.intelCreator!.firstName } ${ selected.intelCreator!.lastName }`,
      selected.recipientEntry!.label,
    ];
    attributes.forEach(expectAttribute => {
      expect(spectator.query(byTextContent(expectAttribute, {
        exact: false,
        selector: 'td',
      }))).withContext(`should show delivery attribute ${ expectAttribute }`).toBeVisible();
    });
  });

  it('should emit an event when row is clicked', async () => {
    const spy = jasmine.createSpy();
    component.deliverySelected.subscribe(spy);

    spectator.click(byTextContent(selected.recipientEntry!.label, {
      exact: false,
      selector: 'td',
    }));
    spectator.detectChanges();
    await spectator.fixture.whenStable();

    expect(spy).toHaveBeenCalledOnceWith(selected.delivery.delivery.id);
  });
});
