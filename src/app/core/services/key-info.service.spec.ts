import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { fakeAsync, tick } from '@angular/core/testing';
import {KeyInfoEntry, KeyInfoService} from "./key-info.service";

describe('KeyInfoService', () => {
  let spectator: SpectatorService<KeyInfoService>;
  const createService = createServiceFactory({
    service: KeyInfoService,
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  it('should set and clear key-infos correctly', fakeAsync(() => {
    const keyInfosToSet: (KeyInfoEntry | null)[]= [
      new KeyInfoEntry("key1", "label1"),
      new KeyInfoEntry("key2", "label2")
    ];
    const keyInfosToExpectOnSet: (KeyInfoEntry | null)[]= [
      new KeyInfoEntry("key1", "label1"),
      new KeyInfoEntry("key2", "label2"),
      null, null, null, null, null, null, null, null, null, null
    ];
    const keyInfosToExpectOnClear: (KeyInfoEntry | null)[]= [
      null, null, null, null, null, null, null, null, null, null, null, null
    ];
    let keyInfosResult: (KeyInfoEntry | null)[] = [];
    spectator.service.getKeyInfosSubscription().subscribe((val)=>{
      keyInfosResult = val;
    })
    tick();
    spectator.service.setKeyInfos(keyInfosToSet, 12);
    tick();
    expect(keyInfosResult).toEqual(keyInfosToExpectOnSet);

    spectator.service.clearKeyInfos(12);
    tick();
    expect(keyInfosResult).toEqual(keyInfosToExpectOnClear);
  }));

  it('should call keyCombinationAsString correctly', fakeAsync(() => {
    const keyInfo1: KeyInfoEntry = new KeyInfoEntry("key1", "label1");
    const keyInfo2: KeyInfoEntry = new KeyInfoEntry("key2", "label2", undefined, false);
    expect(keyInfo1.keyCombinationAsString()).toEqual("alt + key1");
    expect(keyInfo2.keyCombinationAsString()).toEqual("key2");
  }));

});
