<template>
  <Topnavbar />
  <Sidebar />
  <h3>Main Application Goes Here</h3>
  <div
    class="cursor-pointer"
    @click.prevent="logout()"
  >
    Go Back
  </div>
  <div
    v-for="user in users()"
    :key="user.id"
  >
    <div>{{ user }}:{{ permissions().get(user.id) }}</div>
    <NormalButton
      :btn-text="`Update ${user.username}`"
      @btn-click="updateUser(user.id)"
    />
    <NormalButton
      :btn-text="`Update Password for ${user.username}`"
      @btn-click="updateUserPw(user.id)"
    />
    <NormalButton
      :btn-text="`Delete ${user.username}`"
      @btn-click="deleteUser(user.id)"
    />
    <NormalButton
      :btn-text="`Add user.create Permission to ${user.username}`"
      @btn-click="addCreatePermission(user.id)"
    />
    <NormalButton
      :btn-text="`Add user.delete Permission to ${user.username}`"
      @btn-click="addDeletePermission(user.id)"
    />
  </div>
  <NormalButton
    btn-text="Generate New User"
    @btn-click="generateUser()"
  />
  <form>
    <label
      for="user_id"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
    >Username</label>
    <input
      id="user_id"
      v-model="userId"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      type="text"
    >
    <NormalButton
      btn-text="Fetch User By Id"
      btn-id="submit"
      btn-type="submit"
      @btn-click="fetchUser(userId)"
    />
  </form>
  <NormalButton
    btn-text="Load Permissions"
    @btn-click="loadPermissions()"
  />
  <div
    v-for="operation in operations()"
    :key="operation.id"
  >
    <div>{{ operation }}</div>
    <NormalButton
      :btn-text="`Update ${operation.title}`"
      @btn-click="updateOperation(operation.id)"
    />
  </div>
  <NormalButton
    btn-text="Generate New Operation"
    @btn-click="generateOperation()"
  />
  <form>
    <label
      for="operation_id"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
    >Username</label>
    <input
      id="operation_id"
      v-model="operationId"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      type="text"
    >
    <NormalButton
      btn-text="Fetch Operation By Id"
      btn-id="submit"
      btn-type="submit"
      @btn-click="fetchOperation(operationId)"
    />
  </form>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useLoginState, useUserState, usePermissionsState, useOperationsState } from '../store';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import { updateUserPassword } from '#preload';
  import { PermissionNames } from '../constants';
  import  Sidebar from '../components/SideBarMenu.vue';
  import Topnavbar from '../components/TopNavbar.vue';
  /**
   * load router and logininfo store to check
   * if already logged in and if so navigate to
   * the main application view
   */
  const loginState = useLoginState();
  const userState = useUserState();
  const permissionsState = usePermissionsState();
  const operationsState = useOperationsState();

  const users = computed(() => userState.getters.users);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const permissions = computed(() => permissionsState.getters.getPermissions);
  const operations = computed(() => operationsState.getters.operations);
  const userId = ref('');
  const operationId = ref('');

  onMounted(() => {
    userState.dispatch('retreiveUsers', {});
    operationsState.dispatch('retrieveOperations', {});
  });

  function fetchUser(userId: string) {
    userState.dispatch('retreiveUserById', userId);
  }

  function updateUser(userId: string) {
    const updatedUser = users.value().filter((elem) => elem.id === userId)[0];
    updatedUser.first_name = `${updatedUser.first_name}u`;
    userState.dispatch('updateUser', updatedUser);
  }

  function deleteUser(userId: string) {
    userState.dispatch('deleteUserById', userId);
  }

  function updateUserPw(userId: string) {
    updateUserPassword(userId, 'testpw');
  }

  function loadPermissions() {
    users.value().map((user) => permissionsState.dispatch('retrievePermissions', user.id) );
  }

  function addCreatePermission(userId: string) {
    permissionsState.dispatch('addPermissions', {userId, permissions: [{name: PermissionNames.UserCreate}]});
  }

  function addDeletePermission(userId: string) {
    permissionsState.dispatch('addPermissions', {userId, permissions: [{name: PermissionNames.UserDelete}]});
  }

  function logout() {
    loginState.dispatch('logout');
  }

  function generateOperation() {
    const title = Math.random().toString(36).substring(2, 15);
    const start: Date = new Date();
    const end:Date = new Date(start.toISOString());
    end.setHours(end.getHours() * 5);
    operationsState.dispatch('createOperation', {
      id: '',
      title,
      description: 'This is a test operation',
      start,
      end,
      is_archived: false,
    });
  }

  function updateOperation(operationId: string) {
      const operationToUpdate = operations.value().filter((elem) => elem.id === operationId)[0];
      operationToUpdate.description = `${operationToUpdate.description}u`;
      operationsState.dispatch('updateOperation', operationToUpdate);
  }

  function fetchOperation(operationId: string) {
    operationsState.dispatch('retrieveOperation', operationId);
  }

  function generateUser() {
    const name= Math.random().toString(36).substring(2, 15);
    userState.dispatch('createUser', {
      id: '',
      username: name,
      first_name: 'Test',
      last_name: 'Testermann',
      is_admin: false,
      pass: 'testtest',
    });
  }

</script>