import {MemberSort, OperationService, OperationSort} from './operation.service';
import {createServiceFactory, SpectatorService} from '@ngneat/spectator';
import {NetService} from './net.service';
import {fakeAsync, tick} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {
  testGenNetPaginated,
  testGenNetPaginationParams,
  testGenPaginatedFromNet,
  testGenRandomPaginationParams,
} from '../testutil/test-pagination';
import {CreateOperation, Operation} from "../model/operation";
import createSpy = jasmine.createSpy;
import {testGenNetSearchResult, testGenRandomSearchParams, testGenSearchResultFromNet} from "../testutil/test-search";
import {netSearchParams} from "../util/net";
import {User} from "../model/user";

describe('OperationService', () => {
  let spectator: SpectatorService<OperationService>;
  const createService = createServiceFactory({
    service: OperationService,
    mocks: [NetService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  describe('createOperation', () => {
    const create: CreateOperation = {
      title: 'Honky',
      description: 'Tonky',
      start: new Date(),
      end: new Date(new Date().getDate() +1),
      is_archived: false,
    };
    const netCreated = {
      id: 'strange things',
      title: 'Cyber',
      description: 'bonk',
      start: create.start,
      end: create.end,
      is_archived: false,
    };
    const expectCreated: Operation = {
      id: 'strange things',
      title: 'Cyber',
      description: 'bonk',
      start: create.start,
      end: create.end,
      is_archived: false,
    };

    it('should create an operation correctly', fakeAsync( () => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(of(netCreated));
      const cbSpy = createSpy();

      spectator.service.createOperation(create).subscribe({next: cbSpy});
      tick();

      expect(postSpy).withContext('should perform correct next call').toHaveBeenCalledOnceWith('/operations', {
        title: 'Honky',
        description: 'Tonky',
        start: create.start,
        end: create.end,
        is_archived: false,
      }, {});
      expect(cbSpy ).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectCreated);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(throwError(() => new Error('get bonked')));
      const cbSpy = createSpy();

      spectator.service.createOperation(create).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }))
  })

  describe('updateOperation', () => {
    const update: Operation = {
      id: 'strange_things',
      title: 'no more',
      description: 'honky tonky',
      start: new Date(),
      end: new Date(new Date().getDate() +1),
      is_archived: false,
    };

    it('should update an operation correctly', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(of(undefined));

      spectator.service.updateOperation(update).subscribe();
      tick();

      expect(putSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/operations/strange_things',{
        id: update.id,
        title: update.title,
        description: update.description,
        start: update.start,
        end: update.end,
        is_archived: update.is_archived,
      }, {});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(throwError(() => new Error('get bonked')));
      const cbSpy = createSpy();

      spectator.service.updateOperation(update).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('getOperationById', () => {
    const operationId = 'randoMcRandom'
    const netOperation = {
      id: operationId,
      title: 'Golden Eye',
      description: 'James Bond',
      start: new Date(),
      end: new Date(new Date().getDate() +1),
      is_archived: false,
    };
    const expectOperation: Operation = {
      id: operationId,
      title: 'Golden Eye',
      description: 'James Bond',
      start:  netOperation.start,
      end: netOperation.end,
      is_archived: false,
    };

    it('should return correct operation upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netOperation));
      const cbSpy = createSpy();

      spectator.service.getOperationById(operationId).subscribe({next: cbSpy});
      tick();

      expect(getSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/operations/randoMcRandom', {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectOperation);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('get bonked')));
      const cbSpy = createSpy();

      spectator.service.getOperationById(operationId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('getOperations', () => {
    const netOperations = [
      {
        id: 'randoMcRandom',
        title: 'From Russia with love',
        description: 'James Bond',
        start: new Date(),
        end: new Date(new Date().getDate() +1),
        is_archived: false,
      },
      {
        id: 'evenMoreRandom',
        title: 'Live and let die',
        description: 'James Bond',
        start: new Date(),
        end: new Date(new Date().getDate() +1),
        is_archived: false,
      },
    ];
    const params = testGenRandomPaginationParams<OperationSort>();
    const netPaginated = testGenNetPaginated(params,undefined, netOperations);

    it('should return correct operation list upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginated));
      const cbSpy = createSpy();

      spectator.service.getOperations(params).subscribe({next:cbSpy});
      tick();

      expect(getSpy).toHaveBeenCalledOnceWith('/operations', testGenNetPaginationParams(params, undefined));
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenPaginatedFromNet<Operation>(netPaginated,undefined,[
        {
          id: 'randoMcRandom',
          title: 'From Russia with love',
          description: 'James Bond',
          start: netOperations[0].start,
          end: netOperations[0].end,
          is_archived: false,
        },
        {
          id: 'evenMoreRandom',
          title: 'Live and let die',
          description: 'James Bond',
          start: netOperations[1].start,
          end: netOperations[1].end,
          is_archived: false,
        },
      ]));
    }));

    new Map<OperationSort, string>([
      [OperationSort.ByTitle, 'title'],
      [OperationSort.ByDescription, 'description'],
      [OperationSort.ByStart, 'start'],
      [OperationSort.ByEnd, 'end'],
      [OperationSort.ByIsArchived,'is_archived'],
    ]).forEach((netSort, appSort) => {
      it(`should map order-by ${ OperationSort[appSort] } to ${ netSort }`, fakeAsync(() => {
        const params = testGenRandomPaginationParams<OperationSort>(appSort);
        const netPaginated = testGenNetPaginated(params, netSort, []);
        const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginated));

        spectator.service.getOperations(params).subscribe();
        tick();

        expect(getSpy).withContext(`should map ${ appSort } to ${ netSort }`).toHaveBeenCalledOnceWith('/operations', testGenNetPaginationParams(params, netSort));
      }));
    });

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.getOperations(params).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('searchOperations', () => {
    const netOperations = [
      {
        id: 'randoMcRandom',
        title: 'Goldfinger',
        description: 'James Bond',
        start: new Date(),
        end: new Date(new Date().getDate() + 1),
        is_archived: false,
      },
      {
        id: 'evenMoreRandom',
        title: 'Thunderball',
        description: 'James Bond',
        start: new Date(),
        end: new Date(new Date().getDate() + 1),
        is_archived: false,
      }
    ];
    const params = testGenRandomSearchParams();
    const netSearchResult = testGenNetSearchResult(params, netOperations);

    it('should search users correctly', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netSearchResult));
      const cbSpy = createSpy();

      spectator.service.searchOperations(params).subscribe({next: cbSpy});
      tick();

      expect(getSpy).toHaveBeenCalledOnceWith('/operations/search', {
        ...netSearchParams(params),
      });
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenSearchResultFromNet<Operation>(netSearchResult, [
        {
          id: 'randoMcRandom',
          title: 'Goldfinger',
          description: 'James Bond',
          start: netOperations[0].start,
          end: netOperations[0].end,
          is_archived: false,
        },
        {
          id: 'evenMoreRandom',
          title: 'Thunderball',
          description: 'James Bond',
          start: netOperations[1].start,
          end: netOperations[1].end,
          is_archived: false,
        },
      ]));
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('get bonked')));
      const cbSpy = createSpy();

      spectator.service.searchOperations(params).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('updateOperationMembers', () => {
    const update = [
      'randoMcRandom',
      'evenMoreRandom'
    ];
    const operationId = 'theMostRandom';

    it('should update members for operation correctly', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(of(undefined));

      spectator.service.updateOperationMembers(operationId, update).subscribe();
      tick();

      expect(putSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/operations/theMostRandom/members', [
        'randoMcRandom',
        'evenMoreRandom'
      ], {});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(throwError(() => new Error('get bonked')));
      const cbSpy = createSpy();

      spectator.service.updateOperationMembers(operationId, update).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('getOperationMembers', () => {
    const operationId = 'randoMcRandom'
    const netUsers = [
      {
        id: 'barber',
        username: 'spade',
        first_name: 'language',
        last_name: 'concern',
        is_admin: false,
        is_active: true,
      },
      {
        id: 'stock',
        username: 'animal',
        first_name: 'stain',
        last_name: 'rude',
        is_admin: true,
        is_active: false,
      },
    ];
    const params = testGenRandomPaginationParams<MemberSort>();
    const netPaginated = testGenNetPaginated(params, undefined, netUsers);

    it('should return the correct user list upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginated));
      const cbSpy = createSpy();

      spectator.service.getOperationMembers(operationId, params).subscribe({next: cbSpy});
      tick();

      expect(getSpy).toHaveBeenCalledOnceWith('/operations/randoMcRandom/members', testGenNetPaginationParams(params, undefined));
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenPaginatedFromNet<User>(netPaginated, undefined, [
        {
          id: 'barber',
          username: 'spade',
          firstName: 'language',
          lastName: 'concern',
          isAdmin: false,
          isActive: true,
        },
        {
          id: 'stock',
          username: 'animal',
          firstName: 'stain',
          lastName: 'rude',
          isAdmin: true,
          isActive: false,
        },
      ]));
    }));

    new Map<MemberSort, string>([
      [MemberSort.ByUsername, 'username'],
      [MemberSort.ByFirstName, 'first_name'],
      [MemberSort.ByLastName, 'last_name'],
    ]).forEach((netSort, appSort) => {
      it(`should map order-by ${ MemberSort[appSort] } to ${ netSort }`, fakeAsync(() => {
        const params = testGenRandomPaginationParams<MemberSort>(appSort);
        const netPaginated = testGenNetPaginated(params, netSort, []);
        const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginated));

        spectator.service.getOperationMembers(operationId, params).subscribe();
        tick();

        expect(getSpy).withContext(`should map ${ appSort } to ${ netSort }`).toHaveBeenCalledOnceWith('/operations/randoMcRandom/members', testGenNetPaginationParams(params, netSort));
      }));
    });

    it('should call error on net call fail', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('get bonked')));
      const cbSpy = createSpy();

      spectator.service.getOperationMembers(operationId,params).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });
});
