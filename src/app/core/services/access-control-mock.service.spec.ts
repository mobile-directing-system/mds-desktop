import { AccessControlMockService } from './access-control-mock.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { firstValueFrom } from 'rxjs';
import { CreateUserPermission, SetUserAdminPermission, ViewUserPermission } from '../permissions/users';
import { PermissionName } from '../permissions/permissions';
import { CreateGroupPermission } from '../permissions/groups';

describe('AccessControlMockService', () => {
  let spectator: SpectatorService<AccessControlMockService>;
  let service: AccessControlMockService;
  const createService = createServiceFactory({
    service: AccessControlMockService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should grant all initially', async () => {
    const isGranted = await firstValueFrom(service.isGranted([ViewUserPermission()]));
    expect(isGranted).toBeTrue();
  });

  describe('setNoAdminAndGranted', () => {
    beforeEach(() => {
      service.setNoAdminAndGranted([{ name: PermissionName.CreateUser }]);
    });

    it('should not grant all permissions', async () => {
      const isGranted = await firstValueFrom(service.isGranted([SetUserAdminPermission(), CreateGroupPermission()]));
      expect(isGranted).toBeFalse();
    });

    it('should only grant set permissions', async () => {
      const isGranted = await firstValueFrom(service.isGranted([CreateUserPermission()]));
      expect(isGranted).toBeTrue();
    });
  });
});
