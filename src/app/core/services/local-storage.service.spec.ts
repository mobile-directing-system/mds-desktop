import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LocalStorageService,
          useValue: mockLocalStorageService()
        }
      ]
    });
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should read same key/value pair that has been written', () => {
    service.setItem("Key123", "Value12");

    expect(service.getItem("Key123")).toBe("Value12");
  });
});

export function mockLocalStorageService(): LocalStorageService {
  let store: any = {};
  const mockLocalStorage = {
    getItem: (key: string): string | null => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };

  let lss: LocalStorageService = new LocalStorageService();
  spyOn(lss, 'getItem')
    .and.callFake(mockLocalStorage.getItem);
  spyOn(lss, 'setItem')
    .and.callFake(mockLocalStorage.setItem);
  spyOn(lss, 'removeItem')
    .and.callFake(mockLocalStorage.removeItem);
  return lss;
}
