import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {KeyInfoBarComponent} from "../components/key-info-bar/key-info-bar.component";

/**
 * Service for key-info management. Allows creation and changing key-infos / shortcuts.
 * They can be shown to the user via the {@link KeyInfoBarComponent}
 */
@Injectable({
  providedIn: 'root',
})
export class KeyInfoService {

  /**
   * A {@link Subject} of the currently saved key-infos.
   */
  private keyInfosSubscription: Subject<(KeyInfoEntry | null)[]> = new Subject<(KeyInfoEntry | null)[]>();

  constructor() {
    this.keyInfosSubscription.next([]);
  }

  /**
   * Sets and overrides the current key-infos.
   *
   * @param keyInfos - The array of {@link KeyInfoEntry} to set. A {@link KeyInfoEntry} in the array can also be null
   * to represent an empty key-info on this index.
   * @param minSize - Fills up the keyInfos array with null values to reach the passed minSize
   * to allow a consistent user interface
   */
  setKeyInfos(keyInfos: (KeyInfoEntry | null)[], minSize: number = 12){
    this.fillUpKeyInfoItems(keyInfos, minSize);
    // timeout prevents ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(()=> this.keyInfosSubscription.next(keyInfos));
  }

  /**
   * Clears the current key-infos to an empty array
   *
   * @param minSize - Fills the keyInfos array up to the minSize with null values to represent empty key-infos
   * allowing a consistent user interface
   */
  clearKeyInfos(minSize: number = 12){
    let keyInfos: KeyInfoEntry[] = [];
    this.fillUpKeyInfoItems(keyInfos,minSize);
    setTimeout(()=> this.keyInfosSubscription.next(keyInfos));
  }

  /**
   * Returns a {@link Subject} of the currently saved key-infos.
   */
  getKeyInfosSubscription(): Subject<(KeyInfoEntry | null)[]>{
    return this.keyInfosSubscription;
  }

  /**
   *  Fills the keyInfos array with null values to represent empty key-infos
   * allowing a consistent user interface
   *
   * @param keyInfos - The keyInfos array to fill up
   * @param minSize - The size to fill up to
   */
  private fillUpKeyInfoItems(keyInfos: (KeyInfoEntry | null)[], minSize: number){
    if(keyInfos){
      const startSize= keyInfos?.length;
      if(startSize < minSize)
        for(let i = 0; i < minSize; i++){
          if(!keyInfos[i]) keyInfos[i]=null;
        }
    }
  }

}

/**
 *  Represents a key-info / shortcut allowing a user to use a key combination to reach an action.
 */
export class KeyInfoEntry {


  /**
   *  Creates a new instance of {@link KeyInfoEntry}
   *
   *  @param key - The key the user has to press to activate the {@link action}
   *  @param label - A description of the {@link action} the user can perform with this shortcut
   *  @param action - The action to be performed after clicking the {@link key}
   *  @param withAltKey - When true the user has to press the alt-key in addition to the {@link key}
   *  to activate {@link action}. If false the user has to press only the {@link key}
   *  @param preventDefault - If true prevents default behaviour and propagation of the click event
   *  after performing the {@link action}
   */
  constructor(public key: string, public label: string, public action?: Function,
              public withAltKey: boolean = true, public preventDefault:boolean = true) {}

  /**
   *  Returns a human-readable string of the key combination the user has to press to activate the {@link action}
   */
  keyCombinationAsString() : string{
    if(this.withAltKey){
      return "alt + " + this.key;
    }else{
      return this.key;
    }
  }
}
