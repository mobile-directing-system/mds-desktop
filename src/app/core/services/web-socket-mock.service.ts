import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Channel, MessagePayload, WebSocketMessage } from '../ws-message/ws-message';

@Injectable({
  providedIn: 'root',
})
export class WebSocketMockService {

  private _incomingMessages = new Subject<WebSocketMessage>();

  outbox: {
    channel: string,
    payload: any,
  }[] = [];

  incomingMessages(): Observable<WebSocketMessage> {
    return this._incomingMessages.asObservable();
  }

  send(channel: Channel, payload: MessagePayload): void {
    this.outbox.push({
      channel: channel,
      payload: payload,
    });
  }

  emitIncoming(message: WebSocketMessage): void {
    this._incomingMessages.next(message);
  }
}
