import { AccessControlService } from './access-control.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { AuthService } from './auth.service';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { User } from '../model/user';
import { Permission, PermissionName } from '../permissions/permissions';
import { UserService } from './user.service';
import { PermissionService } from './permission.service';
import {
  CreateUserPermission,
  SetUserActiveStatePermission,
  SetUserAdminPermission,
  ViewUserPermission,
} from '../permissions/users';

describe('AccessControlService', () => {
  let spectator: SpectatorService<AccessControlService>;
  let service: AccessControlService;
  const createService = createServiceFactory({
    service: AccessControlService,
  });
  let userId: string;
  let userChange: BehaviorSubject<string | undefined>;
  let userDetails: User;
  let userPermissions: Permission[];
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let permissionService: jasmine.SpyObj<PermissionService>;

  beforeEach(() => {
    userId = 'earn';
    userChange = new BehaviorSubject<string | undefined>(undefined);
    userDetails = {
      id: userId,
      username: 'form',
      firstName: 'realize',
      lastName: 'bundle',
      isAdmin: false,
      isActive: true,
    };
    userPermissions = [
      { name: PermissionName.CreateUser },
      { name: PermissionName.ViewUser },
    ];
    authService = jasmine.createSpyObj<AuthService>({
      userChange: userChange,
    });
    userService = jasmine.createSpyObj<UserService>({
      getUserById: of(userDetails),
    });
    permissionService = jasmine.createSpyObj<PermissionService>({
      getPermissionsByUser: of(userPermissions),
    });

    spectator = createService({
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: PermissionService,
          useValue: permissionService,
        },
      ],
    });
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve granted permissions when user changes and emit', async () => {
    userService.getUserById.calls.reset();
    permissionService.getPermissionsByUser.calls.reset();

    userChange.next(userId);
    await firstValueFrom(service.isGranted([ViewUserPermission()]));

    expect(userService.getUserById).toHaveBeenCalledOnceWith(userId);
    expect(permissionService.getPermissionsByUser).toHaveBeenCalledOnceWith(userId);
  });

  describe('isGranted', () => {
    it('should return true when admin', async () => {
      userDetails.isAdmin = true;

      userChange.next(userId);
      const isGranted = await firstValueFrom(service.isGranted([SetUserAdminPermission()]));

      expect(isGranted).toBeTrue();
    });

    it('should return true when all permissions are granted', async () => {
      userChange.next(userId);
      const isGranted = await firstValueFrom(service.isGranted([CreateUserPermission(), ViewUserPermission()]));
      expect(isGranted).toBeTrue();
    });

    it('should return true when no permissions are required', async () => {
      userChange.next(userId);
      const isGranted = await firstValueFrom(service.isGranted([]));
      expect(isGranted).toBeTrue();
    });

    it('should return false when some permissions are not granted', async () => {
      userChange.next(userId);
      const isGranted = await firstValueFrom(service.isGranted([CreateUserPermission(), SetUserActiveStatePermission()]));
      expect(isGranted).toBeFalse();
    });

    it('should return false when no permissions are not granted', async () => {
      userChange.next(userId);
      const isGranted = await firstValueFrom(service.isGranted([SetUserAdminPermission()]));
      expect(isGranted).toBeFalse();
    });

    it('should return false when permissions are required but user has none granted', async () => {
      // Clear permissions.
      userPermissions.splice(0, userPermissions.length);

      userChange.next(userId);
      const isGranted = await firstValueFrom(service.isGranted([SetUserAdminPermission()]));

      expect(isGranted).toBeFalse();
    });

    it('should return false no user is logged in', async () => {
      userChange.next(undefined);
      const isGranted = await firstValueFrom(service.isGranted([SetUserAdminPermission()]));

      expect(isGranted).toBeFalse();
    });
  });
});
