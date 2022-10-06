import type { InAppNotification } from '../../../types';
import { BrowserWindow } from 'electron';

export async function addInAppNotification(inAppNotification: InAppNotification):Promise<void> {
  //implement sending of intel
  //maybe move into its own module
  const window = BrowserWindow.getAllWindows().find(w => w.title === 'MDS');
  window?.webContents.send('addInAppNotification', inAppNotification);
}
