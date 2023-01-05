import { GroupFilter, GroupService, GroupSort } from './group.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NetService } from './net.service';
import { CreateGroup, Group } from '../model/group';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {
  testGenNetPaginated,
  testGenNetPaginationParams,
  testGenPaginatedFromNet,
  testGenRandomPaginationParams,
} from '../testutil/test-pagination';
import { OperationSort } from './operation.service';
import { PaginationParams } from '../util/store';
import createSpy = jasmine.createSpy;

describe('GroupService', () => {
  let spectator: SpectatorService<GroupService>;
  const createService = createServiceFactory({
    service: GroupService,
    mocks: [NetService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  describe('createGroup', () => {
    const create: CreateGroup = {
      title: 'noise',
      description: 'effect',
      operation: 'rotten',
      members: [
        'gate',
      ],
    };
    const netCreated = {
      id: 'h9Try',
      title: 'noise',
      description: 'effect',
      operation: 'rotten',
      members: [
        'gate',
      ],
    };

    const expectCreated: Group = {
      id: 'h9Try',
      title: 'noise',
      description: 'effect',
      operation: 'rotten',
      members: [
        'gate',
      ],
    };

    it('should create a group correctly', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(of(netCreated));
      const cbSpy = createSpy();

      spectator.service.createGroup(create).subscribe({ next: cbSpy });
      tick();

      expect(postSpy).withContext('should perform correct next call').toHaveBeenCalledOnceWith('/groups', {
        title: create.title,
        description: create.description,
        operation: create.operation,
        members: create.members,
      }, {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectCreated);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(throwError(() => new Error('something went wrong')));
      const cbSpy = createSpy();

      spectator.service.createGroup(create).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('updateGroup', () => {
    const update: Group = {
      id: '1969',
      title: 'alone',
      description: 'inch',
      operation: 'travel',
      members: [
        'slippery',
      ],
    };

    it('should update a group correctly', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(of(undefined));

      spectator.service.updateGroup(update).subscribe();
      tick();

      expect(putSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/groups/1969', {
        id: '1969',
        title: update.title,
        description: update.description,
        operation: update.operation,
        members: update.members,
      }, {});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(throwError(() => new Error('something went wrong')));
      const cbSpy = createSpy();

      spectator.service.updateGroup(update).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('getGroupById', () => {
    const groupId = 'o8f';
    const netUser = {
      id: groupId,
      title: 'former',
      description: 'bravery',
      operation: 'joint',
      members: [
        'succeed',
      ],
    };
    const expectUser: Group = {
      id: groupId,
      title: 'former',
      description: 'bravery',
      operation: 'joint',
      members: [
        'succeed',
      ],
    };

    it('should return the correct group upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netUser));
      const cbSpy = createSpy();

      spectator.service.getGroupById(groupId).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/groups/o8f', {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectUser);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('something went wrong')));
      const cbSpy = createSpy();

      spectator.service.getGroupById(groupId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('deleteGroupById', () => {
    const groupId = '68s';

    it('should delete a group correctly', fakeAsync(() => {
      const deleteSpy = spectator.inject(NetService).delete.and.returnValue(of(undefined));

      spectator.service.deleteGroupById(groupId).subscribe();
      tick();

      expect(deleteSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/groups/68s', {});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const deleteSpy = spectator.inject(NetService).delete.and.returnValue(throwError(() => new Error('something went wrong')));
      const cbSpy = createSpy();

      spectator.service.deleteGroupById(groupId).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });

  describe('getGroups', () => {
    const netGroups = [
      {
        id: 'want',
        title: 'tin',
        description: 'float',
        operation: 'speak',
        members: [
          'play',
          'moment',
        ],
      },
      {
        id: 'crack',
        title: 'corn',
        description: 'director',
        operation: 'precious',
        members: [
          'play',
        ],
      },
      {
        id: 'package',
        title: 'rice',
        description: 'towel',
        operation: 'lesson',
        members: [
          'play',
          'moment',
        ],
      },
    ];

    const params = testGenRandomPaginationParams<GroupSort>();
    const filter: GroupFilter = {
      userId: 'play',
      forOperation: 'speak',
    };
    const netParams = {
      orderBy: params.orderBy,
      limit: params.limit,
      offset: params.offset,
      orderDir: params.orderDir,
      userId: filter.userId,
      forOperation: filter.forOperation,
      excludeGlobal: filter.forOperation,
    };
    const netPaginatedFilter = testGenNetPaginated(PaginationParams.from(netParams), undefined, netGroups);
    const netPaginated = testGenNetPaginated(params, undefined, netGroups);

    it('should return correct group list upon retrieval, with filter active', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginatedFilter));
      const cbSpy = createSpy();

      spectator.service.getGroups(params, filter).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).toHaveBeenCalledOnceWith('/groups', {
        ...testGenNetPaginationParams(PaginationParams.from(netParams), undefined),
        by_user: 'play',
        for_operation: 'speak',
        exclude_global: undefined,
      });
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenPaginatedFromNet<Group>(netPaginatedFilter, undefined, [
        {
          id: 'want',
          title: 'tin',
          description: 'float',
          operation: 'speak',
          members: [
            'play',
            'moment',
          ],
        },
        {
          id: 'crack',
          title: 'corn',
          description: 'director',
          operation: 'precious',
          members: [
            'play',
          ],
        },
        {
          id: 'package',
          title: 'rice',
          description: 'towel',
          operation: 'lesson',
          members: [
            'play',
            'moment',
          ],
        },
      ]));
    }));

    it('should return correct group list upon retrieval, without filter active', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginated));
      const cbSpy = createSpy();

      spectator.service.getGroups(params, {}).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).toHaveBeenCalledOnceWith('/groups', {
        ...testGenNetPaginationParams(params, undefined),
        by_user: undefined,
        for_operation: undefined,
        exclude_global: undefined,
      });
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenPaginatedFromNet<Group>(netPaginated, undefined, [
        {
          id: 'want',
          title: 'tin',
          description: 'float',
          operation: 'speak',
          members: [
            'play',
            'moment',
          ],
        },
        {
          id: 'crack',
          title: 'corn',
          description: 'director',
          operation: 'precious',
          members: [
            'play',
          ],
        },
        {
          id: 'package',
          title: 'rice',
          description: 'towel',
          operation: 'lesson',
          members: [
            'play',
            'moment',
          ],
        },
      ]));
    }));

    new Map<GroupSort, string>([
      [GroupSort.ByTitle, 'title'],
      [GroupSort.ByDescription, 'description'],
    ]).forEach((netSort, appSort) => {
      it(`should map order-by ${ OperationSort[appSort] } to ${ netSort }`, fakeAsync(() => {
        const params = testGenRandomPaginationParams<GroupSort>(appSort);
        const netPaginated = testGenNetPaginated(params, netSort, []);
        const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginated));

        spectator.service.getGroups(params, {}).subscribe();
        tick();

        expect(getSpy).withContext(`should map ${ appSort } to ${ netSort }`).toHaveBeenCalledOnceWith('/groups', {
          ...testGenNetPaginationParams(params, netSort),
          by_user: undefined,
          for_operation: undefined,
          exclude_global: undefined,
        });
      }));
    });

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('sad life')));
      const cbSpy = createSpy();

      spectator.service.getGroups(params, {}).subscribe({
        next: () => fail('should fail'),
        error: cbSpy,
      });
      tick();

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(cbSpy).withContext('should call error').toHaveBeenCalledTimes(1);
    }));
  });
});
