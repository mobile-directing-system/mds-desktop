import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { NotificationService } from './notification.service';
import urlJoin from 'url-join';
import { Channel, MessagePayload, WebSocketMessage } from '../ws-message/ws-message';

const DesktopAppGate = 'desktop-app';

interface RawMessage {
  channel: Channel,
  payload: MessagePayload,
}

/**
 * Service for websocket communication.
 */
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private ws?: WebSocket;
  private messageQueue: RawMessage[] = [];
  /**
   * Subject for notifying about connected state.
   * @private
   */
  private connectedSubject = new BehaviorSubject(false);

  /**
   * Subject for all incoming messages.
   * @private
   */
  private incomingMessagesSubject = new Subject<WebSocketMessage>();

  constructor(authService: AuthService, configService: ConfigService, private notifyService: NotificationService) {
    combineLatest({
      serverUrl: configService.serverUrl,
      userId: authService.userChange(),
      authToken: authService.authTokenChange(),
    }).subscribe(res => {
      if (res.serverUrl !== null && res.userId !== undefined && res.authToken !== undefined) {
        this.connect(WebSocketService.connectUrl(res.serverUrl), res.authToken);
      } else {
        this.disconnect();
      }
    });
  }

  private static connectUrl(serverUrl: string): string {
    serverUrl = serverUrl.replace('http://', 'ws://');
    serverUrl = serverUrl.replace('https://', 'wss://');
    return urlJoin(serverUrl, 'ws', DesktopAppGate);
  }

  /**
   * Disconnects the {@link ws}.
   * @private
   */
  private disconnect(): void {
    if (!this.ws) {
      return;
    }
    // Normal close.
    this.ws.close(1000);
    this.ws = undefined;
    this.connectedSubject.next(false);
  }

  /**
   * Opens a WebSocket connection to the target url and authenticates with the given authentication token.
   * @param url The url to connect to.
   * @param authToken The authentication token to authenticate with.
   * @private
   */
  private connect(url: string, authToken: string) {
    this.disconnect();
    this.ws = new WebSocket(url);
    this.ws.onopen = _ => {
      // Authenticate.
      this.ws?.send(authToken);
      this.flushMessageQueue();
      this.connectedSubject.next(true);
      this.flushMessageQueue();
    };
    this.ws.onerror = ev => {
      this.notifyService.notifyUninvasiveShort($localize`WebSocket connection error`);
      this.disconnect();
    };
    this.ws.onclose = _ => {
      this.disconnect();
    };
    this.ws.onmessage = ev => this.handleIncomingMessage(ev);
  }

  private handleIncomingMessage(ev: MessageEvent): void {
    const message: WebSocketMessage = JSON.parse(ev.data);
    this.incomingMessagesSubject.next(message);
  }

  send(channel: Channel, payload: MessagePayload): void {
    this.messageQueue.push({
      channel: channel,
      payload: payload,
    });
    this.flushMessageQueue();
  }

  private flushMessageQueue(): void {
    if (!this.connectedSubject.getValue()) {
      return;
    }
    while (this.messageQueue.length > 0) {
      this.ws?.send(JSON.stringify(this.messageQueue.shift()));
    }
  }

  /**
   * Receives the current connected-state. The underlying subject is a {@link BehaviorSubject}, so the current state is
   * emitted immediately.
   */
  connectedChange(): Observable<boolean> {
    return this.connectedSubject.asObservable();
  }


  /**
   * Receives new incoming messages.
   */
  incomingMessages(): Observable<WebSocketMessage> {
    return this.incomingMessagesSubject.asObservable();
  }
}
