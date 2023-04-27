import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

/**
 * Service for global base configuration.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private serverUrlSubject = new BehaviorSubject<string | null>(null);

  /**
   * Base url for connecting to the server.
   */
  get serverUrl(): Observable<string | null> {
    return this.serverUrlSubject.asObservable();
  }

  constructor(private lsService: LocalStorageService) {
    this.setServerUrl(this.lsService.getItem(LocalStorageService.TokenServerURL));
  }

  /**
   * Sets the server url for connecting to the server.
   * @param serverUrl The new server url.
   */
  setServerUrl(serverUrl: string | null): void {
    if (serverUrl === null) {
      this.lsService.removeItem(LocalStorageService.TokenServerURL);
    } else {
      this.lsService.setItem(LocalStorageService.TokenServerURL, serverUrl);
    }
    this.serverUrlSubject.next(serverUrl);
  }
}
