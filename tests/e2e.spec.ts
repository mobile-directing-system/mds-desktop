import type {ElectronApplication, Page} from 'playwright';
import { _electron as electron} from 'playwright';
import {afterAll, beforeAll, expect, test} from 'vitest';


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
  const loginUsernameInput = await page.$('#login-username', {strict: true});
  expect(loginUsernameInput, 'Can\'t find username input').toBeTruthy();
  const loginPasswordInput = await page.$('#login-password', {strict: true});
  expect(loginPasswordInput, 'Can\'t find password input').toBeTruthy();
  const loginButton = await page.$('#login-button');
  expect(loginButton, 'Can\'t find login button').toBeTruthy();
  await loginUsernameInput?.fill('admin');
  await loginPasswordInput?.fill('admin');
  await loginButton?.click();
  const mainAppContent = await page.$('#app-content', {strict: true});
  expect(mainAppContent, 'Can\'t find main app content container').toBeTruthy();
});

test('Check opening users page', async () => {
  const page = await electronApp.firstWindow();
  await navigateToUsersView(page);
});

test('Check opening create user page', async () => {
  const page = await electronApp.firstWindow();
  await navigateToUsersView(page);
  await openCreateUsersForm(page);
});

test('Check leaving create user page', async() => {
  const page = await electronApp.firstWindow();
  await navigateToUsersView(page);
  await openCreateUsersForm(page);
  await leaveCreateUsersForm(page);
});

test('Check opening update user form', async() => {
  const page = await electronApp.firstWindow();
  await navigateToUsersView(page);
  await openUpdateUserForm(page, 'admin');
});

test('Check leaving update user form', async() => {
  const page = await electronApp.firstWindow();
  await navigateToUsersView(page);
  await openUpdateUserForm(page, 'admin');
  await leaveUpdateUserForm(page);
});

test('Check if pagination on the users page works', async () => {
  const page = await electronApp.firstWindow();
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

});

test('Check if table entries in users table are present and not empty', async () => {
  const page = await electronApp.firstWindow();
  await navigateToUsersView(page);
  
  const usersTableHeaders = await page.$$('#users-table >> thead');
  const usersTableEntries = await page.$$('#users-table >> tbody >> tr');

  //Check that headers are present
  for(const header of usersTableHeaders) {
    expect(await header.$('th:has-text("Username")', {strict: true}), 'Can\'t find Table Header \'Username\'').toBeTruthy();
    expect(await header.$('th:has-text("First name")', {strict: true}), 'Can\'t find Table Header \'First name\'').toBeTruthy();
    expect(await header.$('th:has-text("Last name")', {strict: true}), 'Can\'t find Table Header \'Last name\'').toBeTruthy();
  }

  //Check that each row has three td's and they are not empty
  for(const entry of usersTableEntries) {
    const tds = await entry.$$('td');
    expect(tds.length, 'User table entry does not have three columns').toBe(3);

    for(const td of tds) {
      expect(await td.innerText()).toBeTruthy();
    }
  }

});

test('Create user and check if creation in users table', async () => {
  const page = await electronApp.firstWindow();

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
});

test('Check if created user data correct', async() => {
  const page = await electronApp.firstWindow();

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
});

test('Change created user and check in users table', async() => {
  const page = await electronApp.firstWindow();

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
});

test('Delete created user and check in table', async() => {
  const page = await electronApp.firstWindow();
  await navigateToUsersView(page);
  await openUpdateUserForm(page, username);

  const updateUserDeleteButton = await page.$('#update-user-delete-button', {strict: true});
  expect(updateUserDeleteButton, 'Can\'t find update user delete button').toBeTruthy();
  await updateUserDeleteButton?.click();

  const createdUserUsernameTableData = await page.$(`#users-table >> td:has-text("${updatedUsername}")`);
  expect(createdUserUsernameTableData, 'Can\'t find table data with username for newly created user').toBeFalsy();
  const createdUserFirstNameTableData = await page.$(`#users-table >> td:has-text("${updatedFirstName}")`);
  expect(createdUserFirstNameTableData, 'Can\'t find table data with first name for newly created user').toBeFalsy();
  const createdUserLastNameTableData = await page.$(`#users-table >> td:has-text("${updatedLastName}")`);
  expect(createdUserLastNameTableData, 'Can\'t find table data with last name for newly created user').toBeFalsy();

});


async function navigateToUsersView(page: Page):Promise<void> {
  //open all users view
  const userButton = await page.$('#manage-users-button', {strict: true});
  expect(userButton, 'Can\'t find user button').toBeTruthy();
  await userButton?.click();
  const allUsers = await page.$('#all-users', {strict: true});
  expect(allUsers, 'Can\'t find all users view').toBeTruthy();
}

async function openCreateUsersForm(page: Page):Promise<void> {
  //open create new user form
  const openCreateUserButton = await page.$('#open-create-user-button', {strict: true});
  expect(openCreateUserButton, 'Can\'t find open create user button').toBeTruthy();
  await openCreateUserButton?.click();
  const createNewUserForm = await page.$('#create-new-user-form', {strict: true});
  expect(createNewUserForm, 'Can\'t find create new user form'). toBeTruthy();
}

async function leaveCreateUsersForm(page: Page):Promise<void> {
  //leave create user form
  const createUserCancelButton = await page.$('#create-user-cancel', {strict: true});
  expect(createUserCancelButton, 'Can\'t find create user cancel button').toBeTruthy();
  await createUserCancelButton?.click();
  const allUsers = await page.$('#all-users', {strict: true});
  expect(allUsers, 'Can\'t find all users view').toBeTruthy();
}

async function openUpdateUserForm(page: Page, username: string):Promise<void> {
  //navigate to update user form for newly created users
  const createdUserUsernameTableData = await page.$(`#users-table >> td:has-text("${username}")`);
  expect(createdUserUsernameTableData, 'Can\'t find table data with username for newly created user').toBeTruthy();
  const createdUserTableRow = await createdUserUsernameTableData?.$('xpath=..');
  expect(createdUserTableRow, 'Can\'t find table row for the newly created user').toBeTruthy();
  await createdUserTableRow?.click();
  const createdUserUpdateUserForm = await page.$('#update-user-form', {strict: true});
  expect(createdUserUpdateUserForm, 'Can\'t find update user form').toBeTruthy();
}

async function leaveUpdateUserForm(page: Page):Promise<void> {
    //leave update user form
    const updateUserCancelButton = await page.$('#update-user-cancel-button', {strict: true});
    expect(updateUserCancelButton, ('Can\'t find update user cancel button')).toBeTruthy();
    await updateUserCancelButton?.click();
    expect(await page.$('#all-users', {strict: true}), 'Can\'t find all users view').toBeTruthy();
}

