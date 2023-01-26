import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';

/**
 * Delay for showing the dots.
 */
const ShowDotsDelayMS = 200;

/**
 * Animated loading dots.
 */
@Component({
  selector: 'app-loading-dots',
  templateUrl: './loading-dots.component.html',
  styleUrls: ['./loading-dots.component.scss'],
})
export class LoadingDotsComponent implements AfterViewInit, OnDestroy {
  private attachDelay?: Subscription;
  showDots = false;

  ngAfterViewInit(): void {
    this.showDots = false;
    this.attachDelay = timer(ShowDotsDelayMS).subscribe(() => {
      this.showDots = true;
    });
  }

  ngOnDestroy(): void {
    this.attachDelay?.unsubscribe();
  }
}
