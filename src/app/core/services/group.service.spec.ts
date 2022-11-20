import { GroupFilter, GroupService, GroupSort } from './group.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NetService } from './net.service';
import { Group, CreateGroup } from '../model/group';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {
  testGenNetPaginated,
  testGenNetPaginationParams,
  testGenPaginatedFromNet,
  testGenRandomPaginationParams,
} from '../testutil/test-pagination';
import createSpy = jasmine.createSpy;
import { OperationSort } from './operation.service';

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
      title: 'You only Live Twice',
      description: 'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny',
      ],
    };
    const netCreated = {
      id: '1967',
      title: 'You only Live Twice',
      description: 'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny',
      ],
    };

    const expectCreated: Group = {
      id: '1967',
      title: 'You only Live Twice',
      description: 'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny',
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
      const postSpy = spectator.inject(NetService).postJSON.and.returnValue(throwError(() => new Error('well well Mr. Bond')));
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
      title: 'On her Majesties Secret Service',
      description: 'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny',
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
      const putSpy = spectator.inject(NetService).putJSON.and.returnValue(throwError(() => new Error('well well Mr. Bond')));
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
    const groupId = '1971';
    const netUser = {
      id: groupId,
      title: 'Diamond are Forever',
      description: 'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny',
      ],
    };
    const expectUser: Group = {
      id: groupId,
      title: 'Diamond are Forever',
      description: 'James Bond',
      operation: 'Dr.No',
      members: [
        'Ms.Moneypenny',
      ],
    };

    it('should return the correct group upon retrieval', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netUser));
      const cbSpy = createSpy();

      spectator.service.getGroupById(groupId).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/groups/1971', {});
      expect(cbSpy).withContext('should call next with correct value').toHaveBeenCalledOnceWith(expectUser);
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const putSpy = spectator.inject(NetService).get.and.returnValue(throwError(() => new Error('well well Mr. Bond')));
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
    const groupId = '1969';

    it('should delete a group correctly', fakeAsync(() => {
      const deleteSpy = spectator.inject(NetService).delete.and.returnValue(of(undefined));

      spectator.service.deleteGroupById(groupId).subscribe();
      tick();

      expect(deleteSpy).withContext('should perform correct net call').toHaveBeenCalledOnceWith('/groups/1969', {});
    }));

    it('should call error on net call fail', fakeAsync(() => {
      const deleteSpy = spectator.inject(NetService).delete.and.returnValue(throwError(() => new Error('well well Mr. Bond')));
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
        id: 'Pierce',
        title: 'Die another Day',
        description: 'James Bond',
        operation: 'Gustav Graves',
        members: [
          'Ms.MoneyPenny',
          '007',
        ],
      },
      {
        id: 'Brosnan',
        title: 'The World is not enough',
        description: 'James Bond',
        operation: 'Valentin Zukovsky',
        members: [
          '007',
        ],
      },
      {
        id: 'PierceBrosnan',
        title: 'Tomorrow never Dies',
        description: 'James Bond',
        operation: 'Gustav Graves',
        members: [
          'Ms.MoneyPenny',
          '007',
        ],
      },
    ];

    const params = testGenRandomPaginationParams<GroupSort>();
    const filter: GroupFilter = {
      userId: 'Ms.MoneyPenny',
      forOperation: 'Gustav Graves',
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
    const netPaginatedFilter = testGenNetPaginated(netParams, undefined, netGroups);
    const netPaginated = testGenNetPaginated(params, undefined, netGroups);

    it('should return correct group list upon retrieval, with filter active', fakeAsync(() => {
      const getSpy = spectator.inject(NetService).get.and.returnValue(of(netPaginatedFilter));
      const cbSpy = createSpy();

      spectator.service.getGroups(params, filter).subscribe({ next: cbSpy });
      tick();

      expect(getSpy).toHaveBeenCalledOnceWith('/groups', {
        ...testGenNetPaginationParams(netParams, undefined),
        userId: 'Ms.MoneyPenny',
        forOperation: 'Gustav Graves',
        excludeGlobal: undefined,
      });
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenPaginatedFromNet<Group>(netPaginatedFilter, undefined, [
        {
          id: 'Pierce',
          title: 'Die another Day',
          description: 'James Bond',
          operation: 'Gustav Graves',
          members: [
            'Ms.MoneyPenny',
            '007',
          ],
        },
        {
          id: 'Brosnan',
          title: 'The World is not enough',
          description: 'James Bond',
          operation: 'Valentin Zukovsky',
          members: [
            '007',
          ],
        },
        {
          id: 'PierceBrosnan',
          title: 'Tomorrow never Dies',
          description: 'James Bond',
          operation: 'Gustav Graves',
          members: [
            'Ms.MoneyPenny',
            '007',
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
        userId: undefined,
        forOperation: undefined,
        excludeGlobal: undefined,
      });
      expect(cbSpy).toHaveBeenCalledOnceWith(testGenPaginatedFromNet<Group>(netPaginated, undefined, [
        {
          id: 'Pierce',
          title: 'Die another Day',
          description: 'James Bond',
          operation: 'Gustav Graves',
          members: [
            'Ms.MoneyPenny',
            '007',
          ],
        },
        {
          id: 'Brosnan',
          title: 'The World is not enough',
          description: 'James Bond',
          operation: 'Valentin Zukovsky',
          members: [
            '007',
          ],
        },
        {
          id: 'PierceBrosnan',
          title: 'Tomorrow never Dies',
          description: 'James Bond',
          operation: 'Gustav Graves',
          members: [
            'Ms.MoneyPenny',
            '007',
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
          userId: undefined,
          forOperation: undefined,
          excludeGlobal: undefined,
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
