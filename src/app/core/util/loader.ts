import { BehaviorSubject, finalize, Observable } from 'rxjs';

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
    } else if (!lastWasLoading && this.inProgress > 0) {
      this.loadingChangeSubject.next(true);
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
}
