import { app, ipcMain } from 'electron';
import '/@/security-restrictions';
import { restoreOrCreateWindow } from '/@/windows/mainWindow';
import { loginHandler, logoutHandler, createUserHandler, deleteUserHandler, retrieveUserHandler, retrieveUsersHandler, updateUserHandler, updateUserPasswordHandler, retrievePermissionsHandler, updatePermissionsHandler } from '/@/ipcHandlers';
/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);


/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow);


/**
 * Create app window when background process will be ready
 */
app.whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error('Failed create window:', e));


/**
 * Register ipc handlers
 */

app.whenReady().then(() => {
  ipcMain.handle('login', loginHandler);
  ipcMain.handle('logout', logoutHandler);

  ipcMain.handle('createUser', createUserHandler);
  ipcMain.handle('updateUser', updateUserHandler);
  ipcMain.handle('updateUserPassword', updateUserPasswordHandler);
  ipcMain.handle('deleteUser', deleteUserHandler);
  ipcMain.handle('retrieveUsers', retrieveUsersHandler);
  ipcMain.handle('retrieveUser', retrieveUserHandler);

  ipcMain.handle('retrievePermissions', retrievePermissionsHandler);
  ipcMain.handle('updatePermissions', updatePermissionsHandler);
});

/**
 * Install Vue.js or some other devtools in development mode only
 */
if (import.meta.env.DEV) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({default: installExtension, VUEJS_DEVTOOLS}) => installExtension(VUEJS_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => console.error('Failed install extension:', e));
}

/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}

