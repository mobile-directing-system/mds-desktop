import backendInstance from './backendInstance';
import { addInAppNotification } from '../ipcHandlers';
import type { InAppNotification } from '../../../types';

export function setupWebsocketListeners() {
  backendInstance.websocket?.on('message', async (e) => {
    const data = JSON.parse(e.toString());
    if(data.channel === 'in-app-notifier') {
      const notification = data.payload as InAppNotification;
      if(data.payload.type === 'intel-notification') {
        notification.payload.delivery_attempt.accepted_at = new Date(notification.payload.delivery_attempt.accepted_at);
        notification.payload.delivery_attempt.created_at = new Date(notification.payload.delivery_attempt.created_at);
        notification.payload.intel_to_deliver.created_at = new Date(notification.payload.intel_to_deliver.created_at);
      }
      addInAppNotification(notification);
    }
  });
}