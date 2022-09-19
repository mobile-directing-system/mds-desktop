import { app, ipcMain } from 'electron';
import '/@/security-restrictions';
import { restoreOrCreateWindow } from '/@/windows/mainWindow';
import { loginHandler, logoutHandler, createUserHandler, deleteUserHandler, retrieveUserHandler, retrieveUsersHandler, searchUsersHandler, updateUserHandler, updateUserPasswordHandler, retrievePermissionsHandler, updatePermissionsHandler, createOperationHandler, updateOperationHandler, retrieveOperationHandler, retrieveOperationsHandler, searchOperationsHandler, retrieveOperationMembersHandler, updateOperationMembersHandler, createGroupHandler, updateGroupHandler, deleteGroupHandler, retrieveGroupHandler, retrieveGroupsHandler, retrieveAddressbookEntriesHandler, deleteAddressbookEntryHandler, updateAddressbookEntryHandler, createAddressbookEntryHandler, retrieveAddressbookEntryHandler, retrieveChannlesHandler, setChannelsHandler, searchAddressbookEntryByQueryHandler} from '/@/ipcHandlers';
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
  //register login/logout ipc handlers
  ipcMain.handle('login', loginHandler);
  ipcMain.handle('logout', logoutHandler);

  ipcMain.handle('createAddressbookEntry', createAddressbookEntryHandler);
  ipcMain.handle('updateAddressbookEntry', updateAddressbookEntryHandler);
  ipcMain.handle('deleteAddressbookEntry', deleteAddressbookEntryHandler);
  ipcMain.handle('retrieveAddressbookEntry', retrieveAddressbookEntryHandler);
  ipcMain.handle('retrieveAddressbookEntries', retrieveAddressbookEntriesHandler);
  ipcMain.handle('searchAddressbookEntryByQuery', searchAddressbookEntryByQueryHandler);

  ipcMain.handle('retrieveChannels', retrieveChannlesHandler);
  ipcMain.handle('setChannels', setChannelsHandler);

  ipcMain.handle('createUser', createUserHandler);
  ipcMain.handle('updateUser', updateUserHandler);
  ipcMain.handle('updateUserPassword', updateUserPasswordHandler);
  ipcMain.handle('deleteUser', deleteUserHandler);
  ipcMain.handle('retrieveUsers', retrieveUsersHandler);
  ipcMain.handle('retrieveUser', retrieveUserHandler);
  ipcMain.handle('searchUsers', searchUsersHandler);

  //register permission ipc handlers
  ipcMain.handle('retrievePermissions', retrievePermissionsHandler);
  ipcMain.handle('updatePermissions', updatePermissionsHandler);

  //register operation ipc handlers
  ipcMain.handle('createOperation', createOperationHandler);
  ipcMain.handle('updateOperation', updateOperationHandler);
  ipcMain.handle('retrieveOperation', retrieveOperationHandler);
  ipcMain.handle('retrieveOperations', retrieveOperationsHandler);
  ipcMain.handle('searchOperations', searchOperationsHandler);
  ipcMain.handle('retrieveOperationMembers', retrieveOperationMembersHandler);
  ipcMain.handle('updateOperationMembers', updateOperationMembersHandler);

  //register group ipc handlers
  ipcMain.handle('createGroup', createGroupHandler);
  ipcMain.handle('updateGroup', updateGroupHandler);
  ipcMain.handle('deleteGroup', deleteGroupHandler);
  ipcMain.handle('retrieveGroup', retrieveGroupHandler);
  ipcMain.handle('retrieveGroups', retrieveGroupsHandler);
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

