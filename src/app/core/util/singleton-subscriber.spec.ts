import { SingletonSubscriber } from './singleton-subscriber';

describe('SingletonSubscriber', () => {
  let sSubscriber: SingletonSubscriber;
  let subscribeSpy: jasmine.Spy;
  let unsubscribeSpy: jasmine.Spy;

  beforeEach(() => {
    subscribeSpy = jasmine.createSpy();
    unsubscribeSpy = jasmine.createSpy();
    sSubscriber = new SingletonSubscriber(subscribeSpy);
    subscribeSpy.and.callFake((k: string) => ({
      unsubscribe: () => unsubscribeSpy(k),
    }));
  });

  it('should subscribe if no subscriptions', () => {
    sSubscriber.subscribe('pot');

    expect(subscribeSpy).toHaveBeenCalledOnceWith('pot');
    expect(unsubscribeSpy).not.toHaveBeenCalled();
  });

  it('should not subscribe multiple times for same key', () => {
    sSubscriber.subscribe('pot');
    sSubscriber.subscribe('pot');
    sSubscriber.subscribe('pot');

    expect(subscribeSpy).toHaveBeenCalledOnceWith('pot');
    expect(unsubscribeSpy).not.toHaveBeenCalled();
  });

  it('should unsubscribe when no subscribers are left', () => {
    sSubscriber.subscribe('pot');
    sSubscriber.unsubscribe('pot');

    expect(unsubscribeSpy).toHaveBeenCalledOnceWith('pot');
  });

  it('should not unsubscribe when subscribers are left', () => {
    sSubscriber.subscribe('pot');
    sSubscriber.subscribe('pot');
    sSubscriber.unsubscribe('pot');

    expect(unsubscribeSpy).not.toHaveBeenCalled();
  });

  it('should handle different keys correctly', () => {
    sSubscriber.subscribe('pot');
    sSubscriber.subscribe('pot');
    sSubscriber.subscribe('join');
    sSubscriber.subscribe('join');
    sSubscriber.unsubscribe('join');
    sSubscriber.subscribe('bank');
    sSubscriber.subscribe('bank');
    sSubscriber.subscribe('join');
    sSubscriber.unsubscribe('pot');
    sSubscriber.unsubscribe('bank');
    sSubscriber.unsubscribe('bank');
    sSubscriber.unsubscribe('join');
    sSubscriber.subscribe('bank');
    sSubscriber.unsubscribe('join');
    sSubscriber.unsubscribe('bank');

    expect(subscribeSpy).toHaveBeenCalledTimes(4);
    expect(subscribeSpy).toHaveBeenCalledWith('pot');
    expect(subscribeSpy).toHaveBeenCalledWith('join');
    expect(subscribeSpy).toHaveBeenCalledWith('bank');
    expect(unsubscribeSpy).toHaveBeenCalledTimes(3);
    expect(unsubscribeSpy).toHaveBeenCalledWith('join');
    expect(unsubscribeSpy).toHaveBeenCalledWith('bank');
  });
});
