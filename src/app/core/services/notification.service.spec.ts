import { NotificationService, NotifyDuration } from './notification.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('NotificationService', () => {
  let spectator: SpectatorService<NotificationService>;
  const createService = createServiceFactory({
    service: NotificationService,
    mocks: [MatSnackBar],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  describe('notifyUninvasiveShort', () => {
    it('should show the snackbar correctly', () => {
      const openSpy = spectator.inject(MatSnackBar).open;
      spectator.service.notifyUninvasiveShort('noble', NotifyDuration.Regular);
      expect(openSpy).toHaveBeenCalledOnceWith('noble', undefined, { duration: NotifyDuration.Regular });
    });

    it('should use correct duration as default', () => {
      const openSpy = spectator.inject(MatSnackBar).open;
      spectator.service.notifyUninvasiveShort('noble');
      expect(openSpy).toHaveBeenCalledOnceWith('noble', undefined, { duration: NotifyDuration.Short });
    });
  });
});
