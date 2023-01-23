import { Directive, Input, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { LoadingOverlay } from './loading-overlay';
import { LoadingDotsComponent } from '../components/loading-dots/loading-dots.component';

/**
 * Delay for showing the dots.
 */
const AttachDelayMS = 200;

@Directive({
  selector: '[appShowLoadingDots]',
})
export class ShowLoadingDotsDirective extends LoadingOverlay implements OnDestroy {
  private s?: Subscription;

  @Input()
  set appShowLoadingDots(value: boolean | null) {
    if (value) {
      this.attachLoader();
    } else {
      this.detachLoader();
    }
  }

  ngOnDestroy(): void {
    this.detachLoader();
  }

  private attachLoader() {
    this.s?.unsubscribe();
    this.s = timer(AttachDelayMS).subscribe(() => {
      super.attach(overlay => overlay.createWithBackdrop('_loading-dots-backdrop'), LoadingDotsComponent);
    });
  }

  private detachLoader() {
    this.s?.unsubscribe();
    super.detach();
  }
}
