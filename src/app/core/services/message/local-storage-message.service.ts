import { Injectable } from '@angular/core';
import { MessageFilters, MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { Message, Participant} from '../../model/message';
import { LocalStorageCRUDRepository } from '../../util/local-storage';

@Injectable()
export class LocalStorageMessageService extends MessageService {

  private repository: LocalStorageCRUDRepository<Message> = new LocalStorageCRUDRepository<Message>("mds-desktop__messages");

  /**
   * Get message by id
   */
  public override getMessageById(id: string): Observable<Message | undefined> {
    return of(this.repository.findById(id));
  }


  public override getMessages(filters?: MessageFilters): Observable<Message[]> {
    let messages: Message[] = this.repository.fetchAll();
    if(filters) {
      if(filters.byNeedsReview !== undefined) messages = messages.filter(m => m.needsReview === filters.byNeedsReview);
      if(filters.byDirection !== undefined) messages = messages.filter(m => m.direction === filters.byDirection);
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
  public override getMailboxMessages(roleId: string, read: boolean): Observable<Message[]> {
    let messages: Message[] = this.repository.fetchAll();

    messages = messages.filter(message => {
      for(let recipient of message.recipients) {
        if(recipient.recipientType === Participant.Role && recipient.recipientId === roleId && recipient.read === read) {
          return true;
        }
      }
      return false;
    });

    return of(messages);
  }

  public override pickUpNextMessageToDeliver(signalerId: string): Observable<Message | undefined> {
    let messages: Message[] = this.repository.fetchAll();
    for(let message of messages){
      // filter for messages that are rdy to pick up
      if(message.direction!= 1 || message.needsReview) continue;
      for(let recipient of message.recipients) {
        // filter for recipients that are rdy to pick up
        if(recipient.recipientType == Participant.AddressBookEntry && !recipient.send && !recipient.signalerId) {
          // Sets signalerId to lock the message
          recipient.signalerId = signalerId;
          let success = this.repository.replace(message);
          if(!success) return of(undefined);

          // Only returns the first recipient. That allows to pick up each recipient individually.
          message.recipients = [recipient];
          return of (message);
        }
      }
    }
    return of(undefined);
  }

  public override releaseMessageToDeliver(messageToRelease: Message): Observable<boolean> {
    let message = this.repository.findById(messageToRelease.id);
    if (!message) return of(false);
    for(let recipient of message.recipients) {
      if(!messageToRelease.recipients[0])  return of(false);
      // filters for same recipient as in messageToRelease.  That allows to release each recipient individually.
      if(recipient.recipientType == messageToRelease.recipients[0].recipientType &&
         recipient.recipientId == messageToRelease.recipients[0].recipientId &&
         recipient.signalerId === messageToRelease.recipients[0].signalerId){
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
    for(let recipient of message.recipients) {
      if(!messageToMarkAsSend.recipients[0])  return of(false);
      // filters for same recipient as in messageToMarkAsDelivered.  That allows to mark each recipient individually.
      if(recipient.recipientType == messageToMarkAsSend.recipients[0].recipientType &&
        recipient.recipientId == messageToMarkAsSend.recipients[0].recipientId &&
        recipient.signalerId === messageToMarkAsSend.recipients[0].signalerId){
        // setting message as delivered to undefined to release the message
        recipient.send = true;
        return of(this.repository.replace(message));
      }
    }
    return of(false);
  }

}
