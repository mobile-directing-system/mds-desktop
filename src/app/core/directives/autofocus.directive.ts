import {AfterViewInit, ChangeDetectorRef, Directive, ElementRef} from '@angular/core';

/**
 * Sets the focus on the annotated element after the view is initialised.
 * Imitates the behaviour of the html attribute autofocus.
 */
@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit{

  constructor(private host: ElementRef, private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.host.nativeElement.focus();
    this.changeDetectorRef.detectChanges();
  }
}
