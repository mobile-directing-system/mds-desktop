import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';

/**
 * Delay for showing the overlay.
 */
const ShowOverlayDelayMS = 1800;

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
})
export class LoadingOverlayComponent implements AfterViewInit, OnDestroy {
  private attachDelay?: Subscription;
  showOverlay = false;

  ngAfterViewInit(): void {
    this.showOverlay = false;
    this.attachDelay = timer(ShowOverlayDelayMS).subscribe(() => {
      this.showOverlay = true;
    });
  }

  ngOnDestroy(): void {
    this.attachDelay?.unsubscribe();
  }
}
