import {
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {MatRipple} from "@angular/material/core";
import {KeyInfoEntry, KeyInfoService} from "../../services/key-info.service";
import {Subject} from "rxjs";

/**
 * Component for showing a key info bar at the bottom.
 * This allows the user to use key-shortcuts for faster usability.
 * Gets the current key-infos via the {@link KeyInfoService}
 */
@Component({
  selector: 'app-key-info-bar',
  templateUrl: './key-info-bar.component.html',
  styleUrls: ['./key-info-bar.component.scss'],
})
export class KeyInfoBarComponent implements OnInit{

  /** Holds key-info elements allowing visual effects on them */
  @ViewChildren(MatRipple,   { read: MatRipple}) infoElements?: QueryList<MatRipple>;

  private keyInfos: (KeyInfoEntry | null)[] = [];

  constructor(private keyInfoService: KeyInfoService) {}

  /**
   * Returns observable Subject of keyInfos. Only for use inside this component
   */
  getKeyInfos(): Subject<(KeyInfoEntry | null)[]>{
    return this.keyInfoService.getKeyInfosSubscription();
  }

  ngOnInit() {
    // load keyInfos from service
    this.getKeyInfos().subscribe((keyInfos) =>{
      this.keyInfos = keyInfos;
    })
  }


  /**
   * Listens on keydown events and calls the action of the corresponding {@link KeyInfoEntry}.
   * In addition, it shows visual ripple effects and prevents default if specified.
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(this.keyInfos){
      for(let i = 0; i < this.keyInfos?.length; i++){
        let keyInfoEntry = this.keyInfos[i];
        if(keyInfoEntry != null && ((keyInfoEntry.withAltKey && event.altKey) || !keyInfoEntry.withAltKey) && event.key == keyInfoEntry.key){

          // show visual effects
          let infoElement = this.infoElements?.get(i);
          if(infoElement){
            const rippleRef = infoElement.launch({
              persistent: true,
              centered: true
            });
            setTimeout(()=>rippleRef.fadeOut(), 300);
          }

          // execute action
          if(keyInfoEntry.action) keyInfoEntry.action();
          // prevent default
          if(keyInfoEntry.preventDefault){
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
          }
        }
      }
    }
  }
}
