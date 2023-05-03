import { Subscription } from 'rxjs';

interface ActiveSubscription {
  subscribers: number;
  subscription: Subscription;
}

/**
 * Allows keeping subscriptions alive when subscribed multiple times. See {@link subscribe} and {@link unsubscribe}.
 */
export class SingletonSubscriber {
  private activeSubscriptions: { [keys: string]: ActiveSubscription } = {};

  constructor(private subscribeFn: (k: string) => Subscription) {
  }

  /**
   * Subscribes for the given key. If already subscribed, nothing happens, but we keep track of one more subscriber.
   * @param k The key.
   */
  subscribe(k: string): void {
    const subscription = this.activeSubscriptions[k];
    if (subscription && subscription.subscribers > 0) {
      // Already subscribed.
      this.activeSubscriptions[k].subscribers++;
      return;
    }
    // Subscribe.
    this.activeSubscriptions[k] = {
      subscribers: 1,
      subscription: this.subscribeFn(k),
    };
  }

  /**
   * Unsubscribes for the given key. If there are still other subscribers, this one is untracked, but the underlying
   * subscription remains active. If there are none, the underlying subscription will be unsubscribed from.
   * @param k The key.
   */
  unsubscribe(k: string): void {
    const subscription = this.activeSubscriptions[k];
    if (!subscription) {
      return;
    }
    if (subscription.subscribers == 1) {
      // Last one -> unsubscribe.
      subscription.subscription.unsubscribe();
      delete this.activeSubscriptions[k];
      return;
    }
    this.activeSubscriptions[k].subscribers--;
  }
}
