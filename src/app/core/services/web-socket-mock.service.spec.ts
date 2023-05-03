import { TestBed } from '@angular/core/testing';

import { WebSocketMockService } from './web-socket-mock.service';

describe('WebSocketMockService', () => {
  let service: WebSocketMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
