import type {ElectronApplication, Page} from 'playwright';
import { _electron as electron} from 'playwright';
import {afterAll, beforeAll, afterEach, expect, test} from 'vitest';


let electronApp: ElectronApplication;

const username = 'E2EUser';
const firstName = 'Test';
const lastName = 'User';
const password = 'testpw';

const updatedUsername = 'E2EUser2';
const updatedFirstName = 'Test2';
const updatedLastName = 'User2';


beforeAll(async () => {
  electronApp = await electron.launch({args: ['.', '--mockedBackend']});
});


afterAll(async () => {
  await electronApp.close();
});

afterEach(async() => {
  const page = await electronApp.firstWindow();
  const loginForm = await page.$('#login-form', {strict: true});
  if(!loginForm) {
    await logout(page);
  }
});


test('Main window state', async () => {
  const windowState: { isVisible: boolean; isDevToolsOpened: boolean; isCrashed: boolean }
    = await electronApp.evaluate(({BrowserWindow}) => {
    const mainWindow = BrowserWindow.getAllWindows()[0];

    const getState = () => ({
      isVisible: mainWindow.isVisible(),
      isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
      isCrashed: mainWindow.webContents.isCrashed(),
    });

    return new Promise((resolve) => {
      if (mainWindow.isVisible()) {
        resolve(getState());
      } else
        mainWindow.once('ready-to-show', () => setTimeout(() => resolve(getState()), 0));
    });
  });

  expect(windowState.isCrashed, 'App was crashed').toBeFalsy();
  expect(windowState.isVisible, 'Main window was not visible').toBeTruthy();
  expect(windowState.isDevToolsOpened, 'DevTools was opened').toBeFalsy();
});


test('Main window web content', async () => {
  const page = await electronApp.firstWindow();
  const element = await page.$('#app', {strict: true});
  expect(element, 'Can\'t find root element').toBeDefined();
  expect((await element.innerHTML()).trim(), 'Window content was empty').not.equal('');
});

test('Admin Login Test', async() => {
  const page = await electronApp.firstWindow();
  //test login
  await loginAsUser(page);
  await logout(page);
});

test('Check opening users page', async () => {
  const page = await electronApp.firstWindow();
  await loginAsUser(page);
  await navigateToUsersView(page);
  await logout(page);
});

test('Check opening create user page', async () => {
  const page = await electronApp.firstWindow();
  await loginAsUser(page);
  await navigateToUsersView(page);
  await openCreateUsersForm(page);
  await logout(page);
});

test('Check leaving create user page', async() => {
  const page = await electronApp.firstWindow();
  await loginAsUser(page);
  await navigateToUsersView(page);
  await openCreateUsersForm(page);
  await leaveCreateUsersForm(page);
  await logout(page);
});

test('Check opening update user form', async() => {
  const page = await electronApp.firstWindow();
  await loginAsUser(page);
  await navigateToUsersView(page);
  await openUpdateUserForm(page, 'admin');
  await logout(page);
});

test('Check leaving update user form', async() => {
  const page = await electronApp.firstWindow();
  await loginAsUser(page);
  await navigateToUsersView(page);
  await openUpdateUserForm(page, 'admin');
  await leaveUpdateUserForm(page);
  await logout(page);
});

test('Check if pagination on the users page works', async () => {
  const page = await electronApp.firstWindow();
  await loginAsUser(page);
  await navigateToUsersView(page);

  //check if pagination buttons are present
  const previousButton = await page.$('#users-table-pagination-previous-button', {strict: true});
  expect(previousButton, 'Can\'t find pagination previous button').toBeTruthy();
  const nextButton = await page.$('#users-table-pagination-next-button', {strict: true});
  expect(nextButton, 'Can\'t find pagination next button').toBeTruthy();

  //check if pagination page number is present
  const pageNumber = await page.$('#users-table-pagination-page-number', {strict: true});
  expect(pageNumber, 'Can\'t find pagination page number').toBeTruthy();

  //check if page number is one
  expect(await pageNumber?.innerText(), 'Pagination page number is not one').toSatisfy((elem: string) => elem.startsWith('1'));

  //check if previous button is disabled
  expect(await previousButton?.getAttribute('aria-disabled'), ('Pagination previous button is not disabled')).toBe('true');

  //check if next button is enabled
  expect(await nextButton?.getAttribute('aria-disabled'), ('Pagination previous button is not enabled')).toBe('false');

  //cache usernames of the first page
  let usernames1:string[] = [];
  const usersTableEntries1 = await page.$$('#users-table >> tbody >> tr');
  for(const entry of usersTableEntries1) {
    const username = await (await entry.$('td:first-of-type'))?.innerText();
    if(username) {
      usernames1 = [...usernames1, username];
    }
  }

  //open next users table page
  await nextButton?.click();

  //check if the page number is two
  expect(await pageNumber?.innerText(), 'Pagination page number is not two').toSatisfy((elem: string) => elem.startsWith('2'));

  //check that the usernames of the second page are not the same as on the first page & cache them
  let usernames2:string[] = [];
  const usersTableEntries2 = await page.$$('#users-table >> tbody >> tr');
  for(const entry of usersTableEntries2) {
    const username = await (await entry.$('td:first-of-type'))?.innerText();
    if(username) {
      expect(usernames1.includes(username)).toBe(false);
    }
    if(username) {
      usernames2 = [...usernames2, username];
    }
  }

  //open next users table page
  await nextButton?.click();

  //check if the page number is three
  expect(await pageNumber?.innerText(), 'Pagination page number is not three').toSatisfy((elem: string) => elem.startsWith('3'));

  //check that the usernames of the third page are not the same as on the second page & cache them
  let usernames3:string[] = [];
  const usersTableEntries3 = await page.$$('#users-table >> tbody >> tr');
  for(const entry of usersTableEntries3) {
    const username = await (await entry.$('td:first-of-type'))?.innerText();
    if(username) {
      expect(usernames2.includes(username)).toBe(false);
    }
    if(username) {
      usernames3 = [...usernames3, username];
    }
  }

  //open next users table page
  await nextButton?.click();

  //check if the page number is four
  expect(await pageNumber?.innerText(), 'Pagination page number is not four').toSatisfy((elem: string) => elem.startsWith('4'));

  //check that the usernames of the fourth page are not the same as on the third page & cache them
  let usernames4:string[] = [];
  const usersTableEntries4 = await page.$$('#users-table >> tbody >> tr');
  for(const entry of usersTableEntries4) {
    const username = await (await entry.$('td:first-of-type'))?.innerText();
    if(username) {
      expect(usernames3.includes(username)).toBe(false);
    }
    if(username) {
      usernames4 = [...usernames4, username];
    }
  }

  //open next users table page
  await nextButton?.click();

  //check if the page number is five
  expect(await pageNumber?.innerText(), 'Pagination page number is not five').toSatisfy((elem: string) => elem.startsWith('5'));

  //check that the usernames of the fifth page are not the same as on the fourth page
  const usersTableEntries5 = await page.$$('#users-table >> tbody >> tr');
  for(const entry of usersTableEntries5) {
    const username = await (await entry.$('td:first-of-type'))?.innerText();
    if(username) {
      expect(usernames4.includes(username)).toBe(false);
    }
  }

  //check that next button is disabled
  expect(await nextButton?.getAttribute('aria-disabled'), ('Pagination previous button is not disabled')).toBe('true');

  //check that previous button is enabled
  expect(await previousButton?.getAttribute('aria-disabled'), ('Pagination previous button is not enabled')).toBe('false');

  //navigate back and check if content on each page is the same
  await previousButton?.click();

  //check if the page number is four
  expect(await pageNumber?.innerText(), 'Pagination page number is not four').toSatisfy((elem: string) => elem.startsWith('4'));

  const usersTableEntries6 = await page.$$('#users-table >> tbody >> tr');
  for(const entry of usersTableEntries6) {
    const username = await (await entry.$('td:first-of-type'))?.innerText();
    if(username) {
      expect(usernames4.includes(username)).toBe(true);
    }
  }

  await previousButton?.click();

  //check if the page number is three
  expect(await pageNumber?.innerText(), 'Pagination page number is not three').toSatisfy((elem: string) => elem.startsWith('3'));

  const usersTableEntries7 = await page.$$('#users-table >> tbody >> tr');
  for(const entry of usersTableEntries7) {
    const username = await (await entry.$('td:first-of-type'))?.innerText();
    if(username) {
      expect(usernames3.includes(username)).toBe(true);
    }
  }

  await previousButton?.click();

  //check if the page number is two
  expect(await pageNumber?.innerText(), 'Pagination page number is not two').toSatisfy((elem: string) => elem.startsWith('2'));

  const usersTableEntries8 = await page.$$('#users-table >> tbody >> tr');
  for(const entry of usersTableEntries8) {
    const username = await (await entry.$('td:first-of-type'))?.innerText();
    if(username) {
      expect(usernames2.includes(username)).toBe(true);
    }
  }

  await previousButton?.click();

  //check if the page number is one 
  expect(await pageNumber?.innerText(), 'Pagination page number is not one').toSatisfy((elem: string) => elem.startsWith('1'));

  const usersTableEntries9 = await page.$$('#users-table >> tbody >> tr');
  for(const entry of usersTableEntries9) {
    const username = await (await entry.$('td:first-of-type'))?.innerText();
    if(username) {
      expect(usernames1.includes(username)).toBe(true);
    }
  }

  //check if previous button is disabled
  expect(await previousButton?.getAttribute('aria-disabled'), ('Pagination previous button is not disabled')).toBe('true');

  //check if next button is enabled
  expect(await nextButton?.getAttribute('aria-disabled'), ('Pagination previous button is not enabled')).toBe('false');

  await logout(page);
});

test('Check if table entries in users table are present and not empty', async () => {
  const page = await electronApp.firstWindow();
  await loginAsUser(page);
  await navigateToUsersView(page);
  
  await checkUserTable(page);

  await logout(page);

});

test('Create user and check if creation in users table', async () => {
  const page = await electronApp.firstWindow();

  await loginAsUser(page);
  await navigateToUsersView(page);
  await openCreateUsersForm(page);

  //fill in create new user form and create new user
  const createUserUsernameInput = await page.$('#create-user-username', {strict: true});
  expect(createUserUsernameInput, 'Can\'t find create user username input').toBeTruthy();
  const createUserFirstNameInput = await page.$('#create-user-firstName', {strict: true});
  expect(createUserFirstNameInput, 'Can\'t find create user first name input').toBeTruthy();
  const createUserLastNameInput = await page.$('#create-user-lastName', {strict: true});
  expect(createUserLastNameInput, 'Can\'t find create user last name input').toBeTruthy();
  const createUserPasswordInput = await page.$('#create-user-password', {strict: true});
  expect(createUserPasswordInput, 'Can\'t find create user password input').toBeTruthy();
  const createUserButton = await page.$('#create-user-button', {strict: true});
  expect(createUserButton, 'Can\'t find create user button').toBeTruthy();
  await createUserUsernameInput?.fill(username);
  await createUserFirstNameInput?.fill(firstName);
  await createUserLastNameInput?.fill(lastName);
  await createUserPasswordInput?.fill(password);
  await createUserButton?.click();

  await leaveCreateUsersForm(page);

  //check if created user if displayed in table
  const createdUserUsernameTableData = await page.$(`#users-table >> td:has-text("${username}")`);
  expect(createdUserUsernameTableData, 'Can\'t find table data with username for newly created user').toBeTruthy();
  const createdUserFirstNameTableData = await page.$(`#users-table >> td:has-text("${firstName}")`);
  expect(createdUserFirstNameTableData, 'Can\'t find table data with first name for newly created user').toBeTruthy();
  const createdUserLastNameTableData = await page.$(`#users-table >> td:has-text("${lastName}")`);
  expect(createdUserLastNameTableData, 'Can\'t find table data with last name for newly created user').toBeTruthy();

  await logout(page);
});

test('Check if created user data correct', async() => {
  const page = await electronApp.firstWindow();

  await loginAsUser(page);
  await navigateToUsersView(page);
  await openUpdateUserForm(page, username);

  //get the update user form inputs
  const updateUserUsernameInput = await page.$('#update-user-username', {strict: true});
  expect(updateUserUsernameInput, 'Can\'t find update user username input').toBeTruthy();
  const updateUserFirstNameInput = await page.$('#update-user-firstName', {strict: true});
  expect(updateUserFirstNameInput, 'Can\'t find update user first name input').toBeTruthy();
  const updateUserLastNameInput = await page.$('#update-user-lastName', {strict: true});
  expect(updateUserLastNameInput, 'Can\'t find update user last name input').toBeTruthy();

  //check if content of user form inputs correct for newly created user
  expect(await updateUserUsernameInput?.inputValue(), `Value of update user form username input is not ${username}.`).toBe(username);
  expect(await updateUserFirstNameInput?.inputValue(), `Value of update user form username input is not ${firstName}.`).toBe(firstName);
  expect(await updateUserLastNameInput?.inputValue(), `Value of update user form username input is not ${lastName}.`).toBe(lastName);

  await logout(page);
});

test('Change created user and check in users table', async() => {
  const page = await electronApp.firstWindow();

  await loginAsUser(page);
  await navigateToUsersView(page);
  await openUpdateUserForm(page, username);

  const updateUserUsernameInput = await page.$('#update-user-username', {strict: true});
  expect(updateUserUsernameInput, 'Can\'t find update user username input').toBeTruthy();
  const updateUserFirstNameInput = await page.$('#update-user-firstName', {strict: true});
  expect(updateUserFirstNameInput, 'Can\'t find update user first name input').toBeTruthy();
  const updateUserLastNameInput = await page.$('#update-user-lastName', {strict: true});
  expect(updateUserLastNameInput, 'Can\'t find update user last name input').toBeTruthy();

  //change content of user form
  await updateUserUsernameInput?.fill(updatedUsername);
  await updateUserFirstNameInput?.fill(updatedFirstName);
  await updateUserLastNameInput?.fill(updatedLastName);

  //get update user button and update user
  const updateUserUpdateButton = await page.$('#update-user-update-button', {strict: true});
  expect(updateUserUpdateButton, ('Can\'t find update user update button')).toBeTruthy();
  await updateUserUpdateButton?.click();

  await leaveUpdateUserForm(page);

  //check if udpated user if displayed in table
  const createdUserUsernameTableData = await page.$(`#users-table >> td:has-text("${updatedUsername}")`);
  expect(createdUserUsernameTableData, 'Can\'t find table data with username for newly created user').toBeTruthy();
  const createdUserFirstNameTableData = await page.$(`#users-table >> td:has-text("${updatedFirstName}")`);
  expect(createdUserFirstNameTableData, 'Can\'t find table data with first name for newly created user').toBeTruthy();
  const createdUserLastNameTableData = await page.$(`#users-table >> td:has-text("${updatedLastName}")`);
  expect(createdUserLastNameTableData, 'Can\'t find table data with last name for newly created user').toBeTruthy();

  await logout(page);
});

test('Main view with no view permissions', async () => {
  //open all users view
  const page = await electronApp.firstWindow();

  await loginAsUser(page, 'TestUser1', 'testpw');
  const userButton = await page.$('#manage-users-button', {strict: true});
  expect(userButton, 'Can find users button, but shouldn\'t be able to').toBeFalsy();
  const operationButton = await page.$('#manage-operations-button', {strict: true});
  expect(operationButton, 'Can find oprations button, but shouldn\'t be able to').toBeFalsy();
  const groupButton = await page.$('#manage-groups-button', {strict: true});
  expect(groupButton, 'Can find groups button, but shouldn\'t be able to').toBeFalsy();

  await logout(page);
});

test('Main view with view permissions and entity views', async () => {
  //open all users view
  const page = await electronApp.firstWindow();

  await loginAsUser(page, 'TestUser2', 'testpw');
  const userButton = await page.$('#manage-users-button', {strict: true});
  expect(userButton, 'Can find users button, but shouldn\'t be able to').toBeTruthy();
  const operationButton = await page.$('#manage-operations-button', {strict: true});
  expect(operationButton, 'Can find oprations button, but shouldn\'t be able to').toBeTruthy();
  const groupButton = await page.$('#manage-groups-button', {strict: true});
  expect(groupButton, 'Can find groups button, but shouldn\'t be able to').toBeTruthy();

  await navigateToUsersView(page);
  await checkUserTable(page);

  const openCreateUserButton = await page.$('#open-create-user-button', {strict: true});
  expect(await openCreateUserButton?.getAttribute('aria-disabled'), ('Open create user form button is not disabled')).toBe('true');

  await openUpdateUserForm(page, 'TestUser1');

  const updateUserUsernameInput = await page.$('#update-user-username', {strict: true});
  expect(updateUserUsernameInput, 'Can\'t find update user username input').toBeTruthy();
  const updateUserFirstNameInput = await page.$('#update-user-firstName', {strict: true});
  expect(updateUserFirstNameInput, 'Can\'t find update user first name input').toBeTruthy();
  const updateUserLastNameInput = await page.$('#update-user-lastName', {strict: true});
  expect(updateUserLastNameInput, 'Can\'t find update user last name input').toBeTruthy();
  const updateUserUpdateButton = await page.$('#update-user-update-button', {strict: true});
  expect(updateUserUpdateButton, ('Can\'t find update user update button')).toBeTruthy();

  expect(await updateUserUsernameInput?.getAttribute('aria-disabled'), ('Update user username input is not disabled')).toBe('true');
  expect(await updateUserFirstNameInput?.getAttribute('aria-disabled'), ('Update user first name input is not disabled')).toBe('true');
  expect(await updateUserLastNameInput?.getAttribute('aria-disabled'), ('Update user last name input is not disabled')).toBe('true');
  expect(await updateUserUpdateButton?.getAttribute('aria-disabled'), ('Update user update button is not disabled')).toBe('true');

  await leaveUpdateUserForm(page);

  await navigateToOperationsView(page);
  await checkOperationTable(page);

  const openCreateOperationButton = await page.$('#open-create-operation-button', {strict: true});
  expect(await openCreateOperationButton?.getAttribute('aria-disabled'), ('Open create operation from button is not disabled')).toBe('true');

  await openUpdateOperationForm(page, 'TestOperation1');

  const updateOperationTitleInput = await page.$('#update-operation-title', {strict: true});
  expect(updateOperationTitleInput, 'Can\'t find update operation title input').toBeTruthy();
  const updateOperationDescriptionInput = await page.$('#update-operation-description', {strict: true});
  expect(updateOperationDescriptionInput, 'Can\'t find update operation description input').toBeTruthy();
  const updateOperationStartInput = await page.$('#update-operation-start', {strict: true});
  expect(updateOperationStartInput, 'Can\'t find update operation start input').toBeTruthy();
  const updateOperationEndInput = await page.$('#update-operation-end', {strict: true});
  expect(updateOperationEndInput, 'Can\'t find update operation end input').toBeTruthy();
  const updateOperationIsArchivedInput = await page.$('#update-operation-is_archived', {strict: true});
  expect(updateOperationIsArchivedInput, 'Can\'t find update operation is_archived input').toBeTruthy();
  const updateOperationUpdateButton = await page.$('#update-operation-update-button', {strict: true});
  expect(updateOperationUpdateButton, ('Can\'t find update operation update button')).toBeTruthy();

  //check that operation members input is not rendered

  const updateOperationMembersInput = await page.$('#operation-members', {strict: true});
  expect(updateOperationMembersInput, 'Update operation members input should be disabled').toBeFalsy();

  expect(await updateOperationTitleInput?.getAttribute('aria-disabled'), ('Update operation title input is not disabled')).toBe('true');
  expect(await updateOperationDescriptionInput?.getAttribute('aria-disabled'), ('Update operation description input is not disabled')).toBe('true');
  expect(await updateOperationStartInput?.getAttribute('aria-disabled'), ('Update operation start date time input is not disabled')).toBe('true');
  expect(await updateOperationEndInput?.getAttribute('aria-disabled'), ('Update operation end date time input is not disabled')).toBe('true');
  expect(await updateOperationIsArchivedInput?.getAttribute('aria-disabled'), ('Update operation is_archived input is not disabled')).toBe('true');
  expect(await updateOperationUpdateButton?.getAttribute('aria-disabled'), ('Update operation update button is not disabled')).toBe('true');

  await leaveUpdateOperationForm(page);

  await navigateToGroupsView(page);
  await checkGroupTable(page);

  const openCreateGroupButton = await page.$('#open-create-group-button', {strict: true});
  expect(await openCreateGroupButton?.getAttribute('aria-disabled'), ('Open create operation from button is not disabled')).toBe('true');

  await openUpdateGroupForm(page, 'TestGroup1');

  const updateGroupTitleInput = await page.$('#update-group-title', {strict: true});
  expect(updateGroupTitleInput, 'Can\'t find update group title input').toBeTruthy();
  const updateGroupDescriptionInput = await page.$('#update-group-description', {strict: true});
  expect(updateGroupDescriptionInput, 'Can\'t find update group description input').toBeTruthy();
  // Group operation input checking differs from other inputs as the vueform multiselect component does not render the html input with the id if it is disabled
  const updateGroupOperationInput = await page.$('#update-group-operation', {strict: true});
  expect(updateGroupOperationInput, 'Update group operation select not disabled').toBeFalsy();
  const updateGroupMembersInput = await page.$('#group-members-add-members-button', {strict: true});
  expect(updateGroupMembersInput, 'Can find update group add members button, but shouln\'t be able to').toBeFalsy();
  const updateGroupUpdateButton = await page.$('#update-group-update-button', {strict: true});
  expect(updateGroupUpdateButton, 'Can\'t find update group update button').toBeTruthy();
  const updateGroupDeleteButton = await page.$('#update-group-delete-button',  {strict: true});
  expect(updateGroupDeleteButton, 'Can\'t find update group delete button').toBeTruthy();

  expect(await updateGroupTitleInput?.getAttribute('aria-disabled'), ('Update group title input is not disabled')).toBe('true');
  expect(await updateGroupDescriptionInput?.getAttribute('aria-disabled'), ('Update group description input is not disabled')).toBe('true');
  expect(await updateGroupUpdateButton?.getAttribute('aria-disabled'), ('Update group update button is not disabled')).toBe('true');
  expect(await updateGroupDeleteButton?.getAttribute('aria-disabled'), ('Update group delete button is not disabled')).toBe('true');

  const groupMembersTable = await page.$('#group-members');
  expect(groupMembersTable, 'Operation members table is there, but shouldn\'t be').toBeFalsy;


  await leaveUpdateGroupForm(page);

  await logout(page);
});

test('Entity views with create permission', async () => {
  const page = await electronApp.firstWindow();

  await loginAsUser(page, 'TestUser3', 'testpw');
  await navigateToUsersView(page);
  await openCreateUsersForm(page);

  await leaveCreateUsersForm(page);

  await navigateToOperationsView(page);
  await openCreateOperationsForm(page);
  await leaveCreateOperationsForm(page);

  await navigateToGroupsView(page);
  await openCreateGroupsForm(page);
  await leaveCreateGroupsForm(page);

  await logout(page);
});

test('Enity view with update permissions', async () => {
  const page = await electronApp.firstWindow();

  await loginAsUser(page, 'TestUser4', 'testpw');
  await navigateToUsersView(page);
  await openUpdateUserForm(page, 'TestUser1');

  const updateUserUsernameInput = await page.$('#update-user-username', {strict: true});
  expect(updateUserUsernameInput, 'Can\'t find update user username input').toBeTruthy();
  const updateUserFirstNameInput = await page.$('#update-user-firstName', {strict: true});
  expect(updateUserFirstNameInput, 'Can\'t find update user first name input').toBeTruthy();
  const updateUserLastNameInput = await page.$('#update-user-lastName', {strict: true});
  expect(updateUserLastNameInput, 'Can\'t find update user last name input').toBeTruthy();
  const updateUserUpdateButton = await page.$('#update-user-update-button', {strict: true});
  expect(updateUserUpdateButton, ('Can\'t find update user update button')).toBeTruthy();

  expect(await updateUserUsernameInput?.getAttribute('aria-disabled'), ('Update user username input is disabled')).toBe('false');
  expect(await updateUserFirstNameInput?.getAttribute('aria-disabled'), ('Update user first name input is disabled')).toBe('false');
  expect(await updateUserLastNameInput?.getAttribute('aria-disabled'), ('Update user last name input is disabled')).toBe('false');
  expect(await updateUserUpdateButton?.getAttribute('aria-disabled'), ('Update user update button is disabled')).toBe('false');

  await leaveUpdateUserForm(page);

  await navigateToOperationsView(page);
  await openUpdateOperationForm(page, 'TestOperation1');

  const updateOperationTitleInput = await page.$('#update-operation-title', {strict: true});
  expect(updateOperationTitleInput, 'Can\'t find update operation title input').toBeTruthy();
  const updateOperationDescriptionInput = await page.$('#update-operation-description', {strict: true});
  expect(updateOperationDescriptionInput, 'Can\'t find update operation description input').toBeTruthy();
  const updateOperationStartInput = await page.$('#update-operation-start', {strict: true});
  expect(updateOperationStartInput, 'Can\'t find update operation start input').toBeTruthy();
  const updateOperationEndInput = await page.$('#update-operation-end', {strict: true});
  expect(updateOperationEndInput, 'Can\'t find update operation end input').toBeTruthy();
  const updateOperationIsArchivedInput = await page.$('#update-operation-is_archived', {strict: true});
  expect(updateOperationIsArchivedInput, 'Can\'t find update operation is_archived input').toBeTruthy();
  const updateOperationUpdateButton = await page.$('#update-operation-update-button', {strict: true});
  expect(updateOperationUpdateButton, ('Can\'t find update operation update button')).toBeTruthy();

  //check that operation members input is not rendered

  const updateOperationMembersInput = await page.$('#operation-members', {strict: true});
  expect(updateOperationMembersInput, 'Update operation members input should be disabled').toBeFalsy();

  expect(await updateOperationTitleInput?.getAttribute('aria-disabled'), ('Update operation title input is disabled')).toBe('false');
  expect(await updateOperationDescriptionInput?.getAttribute('aria-disabled'), ('Update operation description input is disabled')).toBe('false');
  expect(await updateOperationStartInput?.getAttribute('aria-disabled'), ('Update operation start date time input is disabled')).toBe('false');
  expect(await updateOperationEndInput?.getAttribute('aria-disabled'), ('Update operation end date time input is disabled')).toBe('false');
  expect(await updateOperationIsArchivedInput?.getAttribute('aria-disabled'), ('Update operation is_archived input is disabled')).toBe('false');
  expect(await updateOperationUpdateButton?.getAttribute('aria-disabled'), ('Update operation update button is disabled')).toBe('false');

  await leaveUpdateOperationForm(page);

  await navigateToGroupsView(page);
  await openUpdateGroupForm(page, 'TestGroup1');

  const updateGroupTitleInput = await page.$('#update-group-title', {strict: true});
  expect(updateGroupTitleInput, 'Can\'t find update group title input').toBeTruthy();
  const updateGroupDescriptionInput = await page.$('#update-group-description', {strict: true});
  expect(updateGroupDescriptionInput, 'Can\'t find update group description input').toBeTruthy();
  const updateGroupOperationInput = await page.$('#update-group-operation', {strict: true});
  expect(updateGroupOperationInput, 'Update group operation select not disabled').toBeTruthy();
  const updateGroupMembersInput = await page.$('#group-members-add-members-button', {strict: true});
  expect(updateGroupMembersInput, 'Can find update group add members button, but shouldn\'t be able to').toBeFalsy();
  const updateGroupUpdateButton = await page.$('#update-group-update-button', {strict: true});
  expect(updateGroupUpdateButton, ('Can\'t find update group update button')).toBeTruthy();
  const updateGroupDeleteButton = await page.$('#update-group-delete-button',  {strict: true});
  expect(updateGroupDeleteButton, 'Can\'t find update group delete button').toBeTruthy();

  expect(await updateGroupTitleInput?.getAttribute('aria-disabled'), ('Update group title input is disabled')).toBe('false');
  expect(await updateGroupDescriptionInput?.getAttribute('aria-disabled'), ('Update group description input is disabled')).toBe('false');
  expect(await updateGroupUpdateButton?.getAttribute('aria-disabled'), ('Update group update button is disabled')).toBe('false');
  expect(await updateGroupDeleteButton?.getAttribute('aria-disabled'), ('Update group delete button is not disabled')).toBe('true');

  const groupMembersTable = await page.$('#group-members');
  expect(groupMembersTable, 'Operation members table is there, but shouldn\'t be').toBeFalsy;

  await leaveUpdateGroupForm(page);

  await logout(page);
});

test('Operations view with operation members view permissions', async () => {
  const page = await electronApp.firstWindow();

  await loginAsUser(page, 'TestUser5', 'testpw');
  await navigateToOperationsView(page);
  await openUpdateOperationForm(page, 'TestOperation1');

  const updateOperationMembersInput = await page.$('#operation-members', {strict: true});
  expect(updateOperationMembersInput, 'Update operation members input should be disabled').toBeTruthy();
  const updateOperationMembersAddMembersButton = await page.$('#operation-members-add-members-button', {strict: true});
  expect(updateOperationMembersAddMembersButton, 'Update operation add members button not found').toBeTruthy();
  expect(await updateOperationMembersAddMembersButton?.getAttribute('aria-disabled'), 'Update operation add members button not disabled').toBe('true');

  const operationMembersTableRows = await page.$$('#operation-members >> tbody >> tr');
  expect(operationMembersTableRows.length, 'No operation members to check').toBeGreaterThan(0);

  const operationMembersDeleteMemberButtons = await page.$$('#operation-members >> tbody >> tr >> td >> button');
  expect(operationMembersDeleteMemberButtons.length, 'There are operation member delete buttons, but there shouldn\'t be any').toBe(0);

  await leaveUpdateOperationForm(page);
 
  await logout(page);
});

test('Operations view with operation members view & update permissions', async () => {
  const page = await electronApp.firstWindow();

  await loginAsUser(page, 'TestUser6', 'testpw');
  await navigateToOperationsView(page);
  await openUpdateOperationForm(page, 'TestOperation1');

  const updateOperationMembersInput = await page.$('#operation-members', {strict: true});
  expect(updateOperationMembersInput, 'Update operation members input should be disabled').toBeTruthy();
  const updateOperationMembersAddMembersButton = await page.$('#operation-members-add-members-button', {strict: true});
  expect(updateOperationMembersAddMembersButton, 'Update operation add members button not found').toBeTruthy();
  expect(await updateOperationMembersAddMembersButton?.getAttribute('aria-disabled'), 'Update operation add members button disabled').toBe('false');

  const operationMembersTableRows = await page.$$('#operation-members >> tbody >> tr');
  const numOfMemberRows = operationMembersTableRows.length;
  expect(operationMembersTableRows.length, 'No operation members to check').toBeGreaterThan(0);

  const operationMembersDeleteMemberButtons = await page.$$('#operation-members >> tbody >> tr >> td >> button');
  expect(operationMembersDeleteMemberButtons.length, 'There should be operation member delete buttons, but there aren\'t any').toBe(numOfMemberRows);

  await leaveUpdateOperationForm(page);

  await navigateToGroupsView(page);
  await openUpdateGroupForm(page, 'TestGroup1');

  const updateGroupTitleInput = await page.$('#update-group-title', {strict: true});
  expect(updateGroupTitleInput, 'Can\'t find update group title input').toBeTruthy();
  const updateGroupDescriptionInput = await page.$('#update-group-description', {strict: true});
  expect(updateGroupDescriptionInput, 'Can\'t find update group description input').toBeTruthy();
  const updateGroupOperationInput = await page.$('#update-group-operation', {strict: true});
  expect(updateGroupOperationInput, 'Update group operation select not disabled').toBeTruthy();
  const updateGroupMembersInput = await page.$('#group-members-add-members-button', {strict: true});
  expect(updateGroupMembersInput, 'Can\'t find update group add members button').toBeTruthy();
  const updateGroupUpdateButton = await page.$('#update-group-update-button', {strict: true});
  expect(updateGroupUpdateButton, ('Can\'t find update group update button')).toBeTruthy();
  const updateGroupDeleteButton = await page.$('#update-group-delete-button',  {strict: true});
  expect(updateGroupDeleteButton, 'Can\'t find update group delete button').toBeTruthy();

  expect(await updateGroupTitleInput?.getAttribute('aria-disabled'), ('Update group title input is disabled')).toBe('false');
  expect(await updateGroupDescriptionInput?.getAttribute('aria-disabled'), ('Update group description input is disabled')).toBe('false');
  expect(await updateGroupMembersInput?.getAttribute('aria-disabled'), ('Update group add group members input is disabled')).toBe('false');
  expect(await updateGroupUpdateButton?.getAttribute('aria-disabled'), ('Update group update button is disabled')).toBe('false');
  expect(await updateGroupDeleteButton?.getAttribute('aria-disabled'), ('Update group delete button is not disabled')).toBe('true');

  await leaveUpdateGroupForm(page);
 
  await logout(page);
});

test('Groups with delete group permission', async () => {
  const page = await electronApp.firstWindow();

  await loginAsUser(page, 'TestUser7', 'testpw');
  await navigateToGroupsView(page);
  await openUpdateGroupForm(page, 'TestGroup1');

  const updateGroupDeleteButton = await page.$('#update-group-delete-button', {strict: true});
  expect(updateGroupDeleteButton, 'Can\'t find update group delete button').toBeTruthy();
  expect(await updateGroupDeleteButton?.getAttribute('aria-disabled'), 'Update group delete button disabled').toBe('false');
 
  await leaveUpdateGroupForm(page);
 
  await logout(page);
});


async function navigateToUsersView(page: Page):Promise<void> {
  //open all users view
  const userButton = await page.$('#manage-users-button', {strict: true});
  expect(userButton, 'Can\'t find user button').toBeTruthy();
  await userButton?.click();
  const allUsers = await page.$('#all-users', {strict: true});
  expect(allUsers, 'Can\'t find all users view').toBeTruthy();
}

async function navigateToOperationsView(page: Page):Promise<void> {
  //open all users view
  const operationButton = await page.$('#manage-operations-button', {strict: true});
  expect(operationButton, 'Can\'t find operations button').toBeTruthy();
  await operationButton?.click();
  const allOperations = await page.$('#all-operations', {strict: true});
  expect(allOperations, 'Can\'t find all operations view').toBeTruthy();
}

async function navigateToGroupsView(page: Page):Promise<void> {
  //open all users view
  const groupButton = await page.$('#manage-groups-button', {strict: true});
  expect(groupButton, 'Can\'t find groups button').toBeTruthy();
  await groupButton?.click();
  const allGroups = await page.$('#all-groups', {strict: true});
  expect(allGroups, 'Can\'t find all groups view').toBeTruthy();
}

async function openCreateUsersForm(page: Page):Promise<void> {
  //open create new user form
  const openCreateUserButton = await page.$('#open-create-user-button', {strict: true});
  expect(openCreateUserButton, 'Can\'t find open create user button').toBeTruthy();
  await openCreateUserButton?.click();
  const createNewUserForm = await page.$('#create-new-user-form', {strict: true});
  expect(createNewUserForm, 'Can\'t find create new user form'). toBeTruthy();
}

async function openCreateOperationsForm(page: Page):Promise<void> {
  //open create new user form
  const openCreateOperationButton = await page.$('#open-create-operation-button', {strict: true});
  expect(openCreateOperationButton, 'Can\'t find open create operation button').toBeTruthy();
  await openCreateOperationButton?.click();
  const createNewOperationForm = await page.$('#create-new-operation-form', {strict: true});
  expect(createNewOperationForm, 'Can\'t find create new operation form'). toBeTruthy();
}

async function openCreateGroupsForm(page: Page):Promise<void> {
  //open create new user form
  const openCreateGroupButton = await page.$('#open-create-group-button', {strict: true});
  expect(openCreateGroupButton, 'Can\'t find open create group button').toBeTruthy();
  await openCreateGroupButton?.click();
  const createNewGroupForm = await page.$('#create-new-group-form', {strict: true});
  expect(createNewGroupForm, 'Can\'t find create new group form'). toBeTruthy();
}

async function leaveCreateUsersForm(page: Page):Promise<void> {
  //leave create user form
  const createUserCancelButton = await page.$('#create-user-cancel-button', {strict: true});
  expect(createUserCancelButton, 'Can\'t find create user cancel button').toBeTruthy();
  await createUserCancelButton?.click();
  const allUsers = await page.$('#all-users', {strict: true});
  expect(allUsers, 'Can\'t find all users view').toBeTruthy();
}

async function leaveCreateOperationsForm(page: Page):Promise<void> {
  //leave create user form
  const createOperationCancelButton = await page.$('#create-operation-cancel-button', {strict: true});
  expect(createOperationCancelButton, 'Can\'t find create operation cancel button').toBeTruthy();
  await createOperationCancelButton?.click();
  const allOperations = await page.$('#all-operations', {strict: true});
  expect(allOperations, 'Can\'t find all operations view').toBeTruthy();
}

async function leaveCreateGroupsForm(page: Page):Promise<void> {
  //leave create user form
  const createGroupCancelButton = await page.$('#create-group-cancel-button', {strict: true});
  expect(createGroupCancelButton, 'Can\'t find create group cancel button').toBeTruthy();
  await createGroupCancelButton?.click();
  const allGroups = await page.$('#all-groups', {strict: true});
  expect(allGroups, 'Can\'t find all groups view').toBeTruthy();
}

async function openUpdateUserForm(page: Page, username: string):Promise<void> {
  //navigate to update user form for newly created users
  const createdUserUsernameTableData = await page.$(`#users-table >> td:has-text("${username}")`);
  expect(createdUserUsernameTableData, 'Can\'t find table data with username for newly created user').toBeTruthy();
  //get parent element
  const createdUserTableRow = await createdUserUsernameTableData?.$('xpath=..');
  expect(createdUserTableRow, 'Can\'t find table row for the newly created user').toBeTruthy();
  await createdUserTableRow?.click();
  const createdUserUpdateUserForm = await page.$('#update-user-form', {strict: true});
  expect(createdUserUpdateUserForm, 'Can\'t find update user form').toBeTruthy();
}

async function openUpdateOperationForm(page: Page, title: string):Promise<void> {
  //navigate to update user form for newly created users
  const createdOperationTitleTableData = await page.$(`#operations-table >> td:has-text("${title}")`);
  expect(createdOperationTitleTableData, 'Can\'t find table data with title for newly created operation').toBeTruthy();
  //get parent element
  const createdOperationTableRow = await createdOperationTitleTableData?.$('xpath=..');
  expect(createdOperationTableRow, 'Can\'t find table row for the newly created operation').toBeTruthy();
  await createdOperationTableRow?.click();
  const createdOperationUpdateOperationForm = await page.$('#update-operation-form', {strict: true});
  expect(createdOperationUpdateOperationForm, 'Can\'t find update operation form').toBeTruthy();
}

async function openUpdateGroupForm(page: Page, title: string):Promise<void> {
  //navigate to update user form for newly created users
  const createdGroupTitleTableData = await page.$(`#groups-table >> td:has-text("${title}")`);
  expect(createdGroupTitleTableData, 'Can\'t find table data with title for newly created group').toBeTruthy();
  //get parent element
  const createdGroupTableRow = await createdGroupTitleTableData?.$('xpath=..');
  expect(createdGroupTableRow, 'Can\'t find table row for the newly created group').toBeTruthy();
  await createdGroupTableRow?.click();
  const createdGroupUpdateOperationForm = await page.$('#update-group-form', {strict: true});
  expect(createdGroupUpdateOperationForm, 'Can\'t find update group form').toBeTruthy();
}

async function leaveUpdateUserForm(page: Page):Promise<void> {
    //leave update user form
    const updateUserCancelButton = await page.$('#update-user-cancel-button', {strict: true});
    expect(updateUserCancelButton, ('Can\'t find update user cancel button')).toBeTruthy();
    await updateUserCancelButton?.click();
    expect(await page.$('#all-users', {strict: true}), 'Can\'t find all users view').toBeTruthy();
}

async function leaveUpdateOperationForm(page: Page):Promise<void> {
  //leave update user form
  const updateOperationCancelButton = await page.$('#update-operation-cancel-button', {strict: true});
  expect(updateOperationCancelButton, ('Can\'t find update operation cancel button')).toBeTruthy();
  await updateOperationCancelButton?.click();
  expect(await page.$('#all-operations', {strict: true}), 'Can\'t find all operations view').toBeTruthy();
}

async function leaveUpdateGroupForm(page: Page):Promise<void> {
  //leave update user form
  const updateGroupCancelButton = await page.$('#update-group-cancel-button', {strict: true});
  expect(updateGroupCancelButton, ('Can\'t find update group cancel button')).toBeTruthy();
  await updateGroupCancelButton?.click();
  expect(await page.$('#all-groups', {strict: true}), 'Can\'t find all groups view').toBeTruthy();
}

async function logout(page: Page):Promise<void> {
  const toggleDropdownButton = await page.$('#toggle-dropdown-button', {strict: true});
  expect(toggleDropdownButton, 'Can\'t find toggle dropdown button').toBeTruthy();
  await toggleDropdownButton?.click();
  const settigsDropdown = await page.$('#settings-dropdown', {strict: true});
  expect(settigsDropdown, 'Can\'t find settings dropdown').toBeTruthy();
  const signOutLink = await page.$('#sign-out-link', {strict: true});
  expect(signOutLink, 'Can\'t find sign out link').toBeTruthy();
  await signOutLink?.click();
  const loginForm = await page.$('#login-form', {strict: true});
  expect(loginForm, 'Can\'t find login form');
}

async function loginAsUser(page: Page, username?: string, password?: string):Promise<void> {
  const loginUsernameInput = await page.$('#login-username', {strict: true});
  expect(loginUsernameInput, 'Can\'t find username input').toBeTruthy();
  const loginPasswordInput = await page.$('#login-password', {strict: true});
  expect(loginPasswordInput, 'Can\'t find password input').toBeTruthy();
  const loginButton = await page.$('#login-button');
  expect(loginButton, 'Can\'t find login button').toBeTruthy();
  await loginUsernameInput?.fill(username? username: 'admin');
  await loginPasswordInput?.fill(password? password: 'admin');
  await loginButton?.click();
  const mainAppContent = await page.$('#app-content', {strict: true});
  expect(mainAppContent, 'Can\'t find main app content container').toBeTruthy();
}

async function checkUserTable(page) {
  const usersTableHeaders = await page.$$('#users-table >> thead');
  const usersTableEntries = await page.$$('#users-table >> tbody >> tr');

  //Check that headers are present
  for(const header of usersTableHeaders) {
    expect(await header.$('th:has-text("Username")', {strict: true}), 'Can\'t find Table Header \'Username\'').toBeTruthy();
    expect(await header.$('th:has-text("First name")', {strict: true}), 'Can\'t find Table Header \'First name\'').toBeTruthy();
    expect(await header.$('th:has-text("Last name")', {strict: true}), 'Can\'t find Table Header \'Last name\'').toBeTruthy();
  }

  //Check that entries are displayed
  expect(usersTableEntries.length, 'Users table entries are not displayed').toBeGreaterThan(0);

  //Check that each row has three td's and they are not empty
  for(const entry of usersTableEntries) {
    const tds = await entry.$$('td');
    expect(tds.length, 'Users table entry does not have three columns').toBe(3);

    for(const td of tds) {
      expect(await td.innerText(), 'Table Data is not set').toBeTruthy();
    }
  }
}

async function checkOperationTable(page) {
  const operationsTableHeaders = await page.$$('#operations-table >> thead');
  const operationsTableEntries = await page.$$('#operations-table >> tbody >> tr');

  //Check that headers are present
  for(const header of operationsTableHeaders) {
    expect(await header.$('th:has-text("Title")', {strict: true}), 'Can\'t find Table Header \'Title\'').toBeTruthy();
    expect(await header.$('th:has-text("Description")', {strict: true}), 'Can\'t find Table Header \'Description\'').toBeTruthy();
    expect(await header.$('th:has-text("Start")', {strict: true}), 'Can\'t find Table Header \'Start\'').toBeTruthy();
    expect(await header.$('th:has-text("End")', {strict: true}), 'Can\'t find Table Header \'End\'').toBeTruthy();
  }

  //Check that entries are displayed
  expect(operationsTableEntries.length, 'Operations table entries are not displayed').toBeGreaterThan(0);

  //Check that each row has four td's and they are not empty
  for(const entry of operationsTableEntries) {
    const tds = await entry.$$('td');
    expect(tds.length, 'Operations table entry does not have four columns').toBe(4);

    expect(await tds[0].innerText(), 'Title is not set').toBeTruthy();
    expect(await tds[2].innerText(), 'Start time is not set').toBeTruthy();
  }
}

async function checkGroupTable(page) {
  const groupsTableHeaders = await page.$$('#groups-table >> thead');
  const groupsTableEntries = await page.$$('#groups-table >> tbody >> tr');

  //Check that headers are present
  for(const header of groupsTableHeaders) {
    expect(await header.$('th:has-text("Title")', {strict: true}), 'Can\'t find Table Header \'Title\'').toBeTruthy();
    expect(await header.$('th:has-text("Description")', {strict: true}), 'Can\'t find Table Header \'Description\'').toBeTruthy();
    expect(await header.$('th:has-text("Operation")', {strict: true}), 'Can\'t find Table Header \'Operation\'').toBeTruthy();
  }

  //Check that entries are displayed
  expect(groupsTableEntries.length, 'Groups table entries are not displayed').toBeGreaterThan(0);

  //Check that each row has three td's and they are not empty
  for(const entry of groupsTableEntries) {
    const tds = await entry.$$('td');
    expect(tds.length, 'Groups table entry does not have three columns').toBe(3);

    //check if title is set
    expect(await tds[0].innerText(), 'Title is not set').toBeTruthy();
  }
}
