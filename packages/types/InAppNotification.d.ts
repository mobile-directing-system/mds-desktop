import type { User } from './User';
import type {IntelType, RadioContent, PlainTextContent} from './Intel';

interface InAppNotification {
  type: 'intel-notification'
  payload: IntelNotification
}

interface IntelNotification {
  intel_to_deliver: {
    attempt: string,
    id: string,
    created_at: Date,
    created_by: string,
    operation: string,
    type: IntelType,
    content: RadioContent[] | PlainTextContent[],
    importance: number,
  },
  delivery_attempt: {
    id: string,
    assigned_to: string,
    assigned_to_label: string,
    assigned_to_user?: string,
    delivery: string,
    channel: string,
    is_active: boolean,
    note?: string,
    status_ts: Date,
    created_at: Date,
    accepted_at: Date,
  },
  channel: {
    id: string,
    entry: string,
    label: string,
    timeout: number
  },
  creator_details: User,
  recipient_details?: User
}

export { IntelNotification, InAppNotification };