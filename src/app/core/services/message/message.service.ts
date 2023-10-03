import { Observable } from 'rxjs';
import { Message, MessageDirection } from '../../model/message';
import {ChannelType} from "../../model/channel";

export interface MessageFilters {
  byNeedsReview?: boolean;
  byDirection?: MessageDirection;
}

/**
 * Service that handles all incoming and outgoing messages of the system
 */
export abstract class MessageService {

  /**
   * Fetch message
   *
   * @param id Id of the message.
   */
  public abstract getMessageById(id: string): Observable<Message | undefined>;

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
   * Updates an existing message
   *
   * @param message
   * @returns success
   */
  public abstract updateMessage(message: Message): Observable<boolean>;

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

  /**
   * Gets next available outgoing message that a signaler can deliver.
   * Locks the message so that no one can fetch the message until it is released again.
   * If a message has multiple receivers returns a message for each receiver separately.
   *
   * @returns message or undefined if nor message available
   */
  public abstract pickUpNextMessageToDeliver(signalerId: string, filterForChannel?: ChannelType): Observable<Message | undefined>;

  /**
   * Releases the message after it was picked up. That enables it to be picked up again.
   * @returns success
   */
  public abstract releaseMessageToDeliver(message: Message): Observable<boolean>;

  /**
   * Marks the message as send.
   * @returns success
   */
  public abstract markMessageAsSend(messageToMarkAsSend: Message): Observable<boolean>;

}
