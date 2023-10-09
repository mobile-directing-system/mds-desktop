import { DeliverChannelComponent } from './deliver-channel.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import {
  DeliverChannel,
  DeliverChannelNoRecommendReason,
  IntelDeliveryAttempt,
  IntelDeliveryAttemptStatus,
} from '../../../../core/model/intel-delivery';
import { Importance } from '../../../../core/model/importance';
import * as moment from 'moment';
import { ChannelType } from '../../../../core/model/channel';
import { CoreModule } from '../../../../core/core.module';
import { IntelDeliveryModule } from '../intel-delivery.module';

function genChannel(): DeliverChannel {
  return {
    channel: {
      id: 'forgive',
      label: 'ever',
      isActive: true,
      priority: 24,
      details: {
        info: 'channel 1'
      },
      entry: 'servant',
      minImportance: Importance.Regular,
      timeout: moment.duration({ second: 1 }),
      type: ChannelType.Radio,
    },
    details: {
      intelImportance: Importance.Low,
      channelMinImportance: Importance.Regular,
    },
    noRecommendReason: DeliverChannelNoRecommendReason.MinImportanceNotSatisfied,
  };
}

describe('DeliverChannelComponent', () => {
  let spectator: Spectator<DeliverChannelComponent>;
  let component: DeliverChannelComponent;
  let channel = genChannel();
  const createComponent = createComponentFactory({
    component: DeliverChannelComponent,
    imports: [
      CoreModule,
      IntelDeliveryModule,
    ],
  });

  beforeEach(async () => {
    channel = genChannel();
    spectator = createComponent({
      props: {
        channel: channel,
        highlight: false,
      },
    });
    component = spectator.component;
    spectator.detectChanges();
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display channel type', () => {
    expect(spectator.query('app-channel-type-inline')).toBeVisible();
  });

  it('should display priority', () => {
    expect(spectator.query(byTextContent(`${ channel.channel.priority }`, {
      exact: false,
      selector: 'div',
    }))).toBeVisible();
  });

  it('should display min importance', () => {
    expect(spectator.query('app-importance-inline')).toBeVisible();
  });

  it('should display warning message for minimum importance not satisfied', async () => {
    channel = {
      ...channel,
      noRecommendReason: DeliverChannelNoRecommendReason.MinImportanceNotSatisfied,
      details: {
        channelMinImportance: Importance.Regular,
        intelImportance: Importance.Low,
      },
    };
    component.channel = channel;

    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Minimum importance not satisfied', {
      exact: false,
      selector: 'div.not-recommended',
    }))).toBeVisible();
  });

  it('should display warning message for failed attempt', async () => {
    const failedAttempt: IntelDeliveryAttempt = {
      id: 'idle',
      channel: 'law',
      delivery: 'greed',
      createdAt: new Date(),
      isActive: false,
      status: IntelDeliveryAttemptStatus.Failed,
      statusTS: new Date(),
      note: undefined,
    };
    channel = {
      ...channel,
      noRecommendReason: DeliverChannelNoRecommendReason.FailedAttempt,
      details: {
        attempt: failedAttempt,
      },
    };
    component.channel = channel;

    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('Failed attempt', {
      exact: false,
      selector: 'div.not-recommended',
    }))).toBeVisible();
  });

  it('should display warning message for inactive channel', async () => {
    channel = {
      ...channel,
      noRecommendReason: DeliverChannelNoRecommendReason.ChannelInactive,
      details: {},
    };
    component.channel = channel;

    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent('inactive', {
      exact: false,
      selector: 'div.not-recommended',
    }))).toBeVisible();
  });

  it('should display not warning message if recommended', async () => {
    channel = {
      ...channel,
      noRecommendReason: undefined,
      details: undefined,
    };
    component.channel = channel;

    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('div.not-recommended')).not.toBeVisible();
  });

  it('should not highlight if not enabled', async () => {
    component.highlight = false;
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('.highlight')).not.toBeVisible();
  });

  it('should highlight if enabled', async () => {
    component.highlight = true;
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query('.highlight')).toBeVisible();
  });
});
