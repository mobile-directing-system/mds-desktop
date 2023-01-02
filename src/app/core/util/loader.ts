import { FormGroup } from '@angular/forms';
import { BehaviorSubject, delay, finalize, Observable, of, Subscription, switchMap, tap } from 'rxjs';

export class Loader {
  /**
   * Emits when loading change states.
   * @private
   */
  private loadingChangeSubject = new BehaviorSubject<boolean>(false);
  /**
   * Number of in progress requests.
   * @private
   */
  private inProgress = 0;
  private boundFormGroups: FormGroup[] = [];

  bindFormGroup(fg: FormGroup): void {
    this.boundFormGroups.push(fg);
  }

  /**
   * Emits the current loading state.
   */
  loadingChange(): Observable<boolean> {
    return this.loadingChangeSubject.asObservable();
  }

  private emitLoadingChangeIfRequired(): void {
    const lastWasLoading = this.loadingChangeSubject.getValue();
    if (lastWasLoading && this.inProgress === 0) {
      this.loadingChangeSubject.next(false);
      this.boundFormGroups.forEach(fg => fg.enable());
    } else if (!lastWasLoading && this.inProgress > 0) {
      this.loadingChangeSubject.next(true);
      this.boundFormGroups.forEach(fg => fg.disable());
    }
  }

  /**
   * Registers the given {@link Observable} and adjusts {@link loadingChange} accordingly. Once the {@link Observable}
   * is finished, the observable will emit accordingly again.
   * @param o The Observable that performs some loading operation.
   */
  load<T>(o: Observable<T>): Observable<T> {
    this.inProgress++;
    this.emitLoadingChangeIfRequired();
    return o.pipe(
      finalize(() => {
        this.inProgress--;
        this.emitLoadingChangeIfRequired();
      }),
    );
  }

  /**
   * Registers the given {@link Observable} and adjusts {@link loadingChange} accordingly. Once the {@link Observable}
   * is finished, the observable will emit accordingly again.
   * @param o The Observable that performs some loading operation.
   */
  loadFrom<T>(o: () => Observable<T>): Observable<T> {
    return of(void 0).pipe(
      delay(0),
      tap(() => {
        this.inProgress++;
        this.emitLoadingChangeIfRequired();
      }),
      switchMap(o),
      delay(0),
      finalize(() => {
        this.inProgress--;
        this.emitLoadingChangeIfRequired();
      }),
    )
  }

  private taken: { [keys: string]: Subscription } = {};

  take(s: Subscription, key: string = ''): void {
    this.inProgress++;
    this.emitLoadingChangeIfRequired();
    s.add(() => {
      this.inProgress--;
      this.emitLoadingChangeIfRequired();
      if (key !== undefined) {
        this.taken[key]?.unsubscribe();
      }
    });
    if (key !== undefined) {
      this.taken[key]?.unsubscribe();
    }
    // I currently don't know how the event loop is handled, but I hope that the finalizer from above is executed with
    // the previous unsubscribe so that this does not overwrite and is then unintentionally unsubscribed.
    this.taken[key] = s;
  }

  takeFrom(s: () => Subscription, key: string = '') {
    this.take(s());
  }
}
