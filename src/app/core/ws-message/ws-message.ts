import { OpenIntelDeliveriesChannelMessage } from './open-intel-delivery-notifier';

export enum Channel {
  OpenIntelDeliveryNotifier = 'open-intel-delivery-notifier'
}

export interface MessageContainer {
  channel: Channel,
  payload: MessagePayload
}

export interface MessagePayload {
  type: string,
  payload: any,
}

export type WebSocketMessage = OpenIntelDeliveriesChannelMessage
