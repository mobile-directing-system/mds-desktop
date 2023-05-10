import {Component, HostListener, Input, TemplateRef} from '@angular/core';

/**
 * General component for views with optional navigation menu.
 */
@Component({
  selector: 'app-key-info-bar',
  templateUrl: './key-info-bar.component.html',
  styleUrls: ['./key-info-bar.component.scss'],
})
export class KeyInfoBarComponent {
  @Input() sideNav?: TemplateRef<any>;
  @Input() test?: String;
  @Input() keyInfos?: (KeyInfoEntry | null)[];

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    this.keyInfos?.forEach((keyInfoEntry)=>{
      if(keyInfoEntry != null && ((keyInfoEntry.withAltKey && event.altKey) || !keyInfoEntry.withAltKey) && event.key == keyInfoEntry.key){
       keyInfoEntry.action();
       event.preventDefault();
       event.stopImmediatePropagation();
       event.stopPropagation();
      }
    });
  }
}

export class KeyInfoEntry {
  key: string;
  label: string;
  action: Function;
  withAltKey: boolean;


  constructor(key: string, label: string, action: Function, withAltKey?: boolean) {
    this.key = key;
    this.label = label;
    this.action = action;
    this.withAltKey = withAltKey == undefined ? true : withAltKey;
  }

   shortcutAsString() : string{
    if(this.withAltKey){
      return "alt + " + this.key;
    }else{
      return this.key;
    }
  }
}
