import { Injectable } from '@angular/core';
import { MessageFilters, MessageService } from './message.service';
import { forkJoin, from, Observable, of } from 'rxjs';
import { Message, MessageDirection, Participant, Recipient } from '../../model/message';
import { LocalStorageCRUDRepository } from '../../util/local-storage';
import { ChannelType } from "../../model/channel";
import { ChannelService } from "../channel.service";
import { map, mergeMap } from "rxjs/operators";

@Injectable()
export class LocalStorageMessageService extends MessageService {

  private repository: LocalStorageCRUDRepository<Message> = new LocalStorageCRUDRepository<Message>("mds-desktop__messages");

  constructor(private channelService: ChannelService) {
    super();
  }

  /**
   * Get message by id
   */
  public override getMessageById(id: string): Observable<Message | undefined> {
    return of(this.repository.findById(id));
  }


  public override getMessages(filters?: MessageFilters): Observable<Message[]> {
    let messages: Message[] = this.repository.fetchAll();
    if (filters) {
      if (filters.byNeedsReview !== undefined) messages = messages.filter(m => m.needsReview === filters.byNeedsReview);
      if (filters.byDirection !== undefined) messages = messages.filter(m => m.direction === filters.byDirection);
      if (filters.byOperationId !== undefined) messages = messages.filter(m => m.operationId === filters.byOperationId);
    }
    return of(messages);
  }

  public override createMessage(message: Message): Observable<Message> {
    return of(this.repository.save(message));
  }

  public override updateMessage(message: Message): Observable<boolean> {
    return of(this.repository.replace(message));
  }

  //TODO filter out messages that need review and right direction
  public override getMailboxMessages(roleId: string, read: boolean, operationId?: string): Observable<Message[]> {
    let messages: Message[] = this.repository.fetchAll();

    messages = messages.filter(message => {
      for (let recipient of message.recipients) {
        if (recipient.recipientType === Participant.Role
          && recipient.recipientId === roleId
          && recipient.read === read)
          return true;
      }
      return false;
    });

    if (operationId) {
      messages = messages.filter(message => message.operationId === operationId);
    }

    return of(messages);
  }


  public override pickUpNextMessageToDeliver(signalerId: string, filterForChannel?: ChannelType, operationId?: string): Observable<Message | undefined> {
    let possibleMessages: Observable<{ message: Message, recipient: Recipient } | undefined>[] = [];
    let messages: Message[] = this.repository.fetchAll().filter(message => {
      // Exclude messages that should not be delivered
      if (message.direction !== MessageDirection.Outgoing || message.needsReview) return false;
      if (operationId && message.operationId !== operationId) return false;

      return true;
    });

    for (let message of messages) {
      for (let recipient of message.recipients) {
        // Do not pick up messages for roles because they are directly delivered to the inbox without the signaler
        // Exclude message that are already sent to the recipient and messages thare are currecntly processed by another signaler
        if (recipient.recipientType == Participant.Role || recipient.send || recipient.signalerId) continue;

        // filter for channel type if passed
        if (filterForChannel) {
          possibleMessages.push(this.channelService.getChannelsByAddressBookEntry(recipient.recipientId).pipe(map(channels => {
            channels = channels.filter(channel => channel.id === recipient.channelId && channel.type === filterForChannel);
            if (channels.length) {
              return { message: message, recipient: recipient };
            } else {
              return undefined;
            }
          })));
        } else {
          // if no filter for channel type passed no further checks needed
          possibleMessages.push(of({ message: message, recipient: recipient }));
        }
      }
    }

    // returns first possibleMessage. If no possible message returns undefined
    if (possibleMessages.length <= 0) return of(undefined);

    return forkJoin(possibleMessages).pipe(map(messages => {
      for (let m of messages) {
        if (m) return this.lockSignalerAndReturnMessage(m.message, m.recipient, signalerId)
      }
      return undefined;
    }));

  }

  /**
   * Help method for pickUpNextMessageToDeliver
   */
  private lockSignalerAndReturnMessage(message: Message, recipient: Recipient, signalerId: string) {
    // Sets signalerId to lock the message
    recipient.signalerId = signalerId;
    let success = this.repository.replace(message);
    if (!success) return undefined;

    // Only returns the first recipient. That allows to pick up each recipient individually.
    message.recipients = [recipient];
    return message;
  }
  public override releaseMessageToDeliver(messageToRelease: Message): Observable<boolean> {
    let message = this.repository.findById(messageToRelease.id);
    if (!message) return of(false);
    for (let recipient of message.recipients) {
      if (!messageToRelease.recipients[0]) return of(false);
      // filters for same recipient as in messageToRelease.  That allows to release each recipient individually.
      if (recipient.recipientType == messageToRelease.recipients[0].recipientType &&
        recipient.recipientId == messageToRelease.recipients[0].recipientId &&
        recipient.signalerId === messageToRelease.recipients[0].signalerId) {
        // setting signalerId to undefined to release the message
        recipient.signalerId = undefined;
        return of(this.repository.replace(message));
      }
    }
    return of(false);
  }

  markMessageAsSend(messageToMarkAsSend: Message): Observable<boolean> {
    let message = this.repository.findById(messageToMarkAsSend.id);
    if (!message) return of(false);
    for (let recipient of message.recipients) {
      if (!messageToMarkAsSend.recipients[0]) return of(false);
      // filters for same recipient as in messageToMarkAsDelivered.  That allows to mark each recipient individually.
      if (recipient.recipientType == messageToMarkAsSend.recipients[0].recipientType &&
        recipient.recipientId == messageToMarkAsSend.recipients[0].recipientId &&
        recipient.signalerId === messageToMarkAsSend.recipients[0].signalerId) {
        // setting message as delivered to undefined to release the message
        recipient.send = true;
        return of(this.repository.replace(message));
      }
    }
    return of(false);
  }

}
