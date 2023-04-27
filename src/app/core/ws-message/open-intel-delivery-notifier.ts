import { Channel, MessagePayload } from './ws-message';

export interface OpenIntelDeliveriesChannelMessage {
  channel: Channel.OpenIntelDeliveryNotifier;
  payload: SubscribeOpenIntelDeliveriesMessage |
    SubscribedOpenIntelDeliveries |
    OpenIntelDeliveriesMessage |
    UnsubscribeOpenIntelDeliveriesMessage;
}

/**
 * Message for subscribing to open intel deliveries for the given operation.
 */
export interface SubscribeOpenIntelDeliveriesMessage extends MessagePayload {
  type: 'subscribe-open-intel-deliveries';
  payload: {
    operation: string;
  };
}

/**
 * Message that is received as a confirmation for subscription changes.
 */
export interface SubscribedOpenIntelDeliveries extends MessagePayload {
  type: 'subscribed-open-intel-deliveries',
  payload: {
    operations: string[];
  }
}

/**
 * Message that is received when open intel deliveries change for the subscribed ones.
 */
export interface OpenIntelDeliveriesMessage extends MessagePayload {
  type: 'open-intel-deliveries',
  payload: {
    operation: string;
    open_intel_deliveries: {
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
    }[]
  }
}

/**
 * Message for unsubscribing from open intel deliveries for the given operation.
 */
export interface UnsubscribeOpenIntelDeliveriesMessage {
  type: 'unsubscribe-open-intel-deliveries';
  payload: {
    operation: string;
  };
}
