import { Observable } from 'rxjs';
import { Message, MessageDirection } from '../../model/message';

export interface MessageFilters {
  byNeedsReview?: boolean;
  byDirection?: MessageDirection;
}

/**
 * Service that handles all incoming and outgoing messages of the system
 */
export abstract class MessageService {

  /**
   * Fetch messages
   * 
   * @param filters Filter messages by search criteria.
   */
  public abstract getMessages(filters?: MessageFilters): Observable<Message[]>;
  /**
   * Create a new message
   * 
   * @param message 
   */
  public abstract createMessage(message: Message): Observable<Message>;
  /**
   * Get all messages that are addressed to a role in the system.
   * With that, messages of a mailbox for a specific role can be fetched.
   * 
   * @param roleId Role id of the recipient
   * @param read Whether messages have already been read
   * 
   * @returns messages
   */
  public abstract getMailboxMessages(roleId: string, read: boolean): Observable<Message[]>;

}
