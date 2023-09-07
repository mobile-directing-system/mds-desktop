import { Injectable } from '@angular/core';
import { MessageFilters, MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { Message, Participant} from '../../model/message';
import { LocalStorageCRUDRepository } from '../../util/local-storage';

@Injectable()
export class LocalStorageMessageService extends MessageService {

  private repository: LocalStorageCRUDRepository<Message> = new LocalStorageCRUDRepository<Message>("mds-desktop__messages");

  public override createMessage(message: Message): Observable<Message> {
    return of(this.repository.save(message));
  }

  public override getMessages(filters?: MessageFilters): Observable<Message[]> {
    let messages: Message[] = this.repository.fetchAll();
    if(filters) {
      if(filters.byNeedsReview !== undefined) messages = messages.filter(m => m.needsReview === filters.byNeedsReview);
      if(filters.byDirection !== undefined) messages = messages.filter(m => m.direction === filters.byDirection);
    }
    return of(messages);
  }

  //TODO filter out messages that need review
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

}
