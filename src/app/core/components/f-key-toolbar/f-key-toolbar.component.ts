import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subscription, tap } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Describing the data needed for one toolbar hotkey.
 */
export interface SuggestionElement<T>{
  /**
   * Text to show as a suggestion.
   */
  suggestionText: string,
  /**
   * Object used for the input of the {@link hotKeyTriggerFunction}.
   */
  suggestionObject: T,
}

@Component({
  selector: 'app-f-key-toolbar',
  templateUrl: './f-key-toolbar.component.html',
  styleUrls: ['./f-key-toolbar.component.scss'],

})
export class FKeyToolbarComponent<T> implements OnInit, OnDestroy{
  /**
   * List of {@link SuggestionElement}s
   */
  @Input() suggestions: SuggestionElement<T>[] = [];
  /**
   * Function to be called when hot key is pressed.
   * @param value input for the trigger function.
   */
  @Input() hotKeyTriggerFunction: (value: T) => any = (value) => console.log(value);

  s: Subscription[] = []

  hotKeyNumbers: number[] = [...Array(12).keys()]
  ngOnInit() {
    this.s.push(fromEvent<KeyboardEvent>( document, 'keydown').pipe(
      map((event: KeyboardEvent) => {
        event.preventDefault();
        return event.key;
      }),
      tap(key => {
        switch (key) {
          case "F1":
            this.chooseSuggestion(1)
            break;
          case "F2":
            this.chooseSuggestion(2)
            break;
          case "F3":
            this.chooseSuggestion(3)
            break;
          case "F4":
            this.chooseSuggestion(4)
            break;
          case "F5":
            this.chooseSuggestion(5)
            break;
          case "F6":
            this.chooseSuggestion(6)
            break;
          case "F7":
            this.chooseSuggestion(7)
            break;
          case "F8":
            this.chooseSuggestion(8)
            break;
          case "F9":
            this.chooseSuggestion(9)
            break;
          case "F10":
            this.chooseSuggestion(10)
            break;
          case "F11":
            this.chooseSuggestion(11)
            break;
          case "F12":
            this.chooseSuggestion(12)
            break;
        }
      })
    ).subscribe());
  }

  ngOnDestroy() {
    this.s.forEach(s => s.unsubscribe())
  }

  chooseSuggestion(fKeyNum: number): void {
    if(this.suggestions.length < fKeyNum){
      return;
    }
    this.hotKeyTriggerFunction(this.suggestions[fKeyNum-1].suggestionObject)
    return;
  }
}
