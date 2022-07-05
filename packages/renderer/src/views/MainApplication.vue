<template>
  <h3>Main Application Goes Here</h3>
  <router-link
    to="/"
    @click="onBack"
  >
    Go Back
  </router-link>
  <div
    v-for="user in users()"
    :key="user.id"
  >
    <div>{{ user }}</div>
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
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useLoginState, useUserState, usePermissionsState } from '../store';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import { updateUserPassword } from '#preload';

  /**
   * load router and logininfo store to check
   * if already logged in and if so navigate to
   * the main application view
   */
  const loginState = useLoginState();
  const userState = useUserState();
  const permissionsState = usePermissionsState();

  function onBack() {
    loginState.dispatch('logout');
  }

  const users = computed(() => userState.getters.getUsers);
  const permissions = computed(() => permissionsState.getters.getPermissions);
  const userId = ref('');

  onMounted(() => {
    userState.dispatch('retreiveUsers', {});
  });

  function fetchUser(userId: string) {
    userState.dispatch('retreiveUserById', userId);
  }

  function updateUser(userId: string) {
    const updatedUser = users.value().filter((elem) => elem.id === userId)[0];
    updatedUser.first_name = `${updatedUser.first_name}u`;
    userState.dispatch('updateUser', {...updatedUser});
  }

  function deleteUser(userId: string) {
    userState.dispatch('deleteUserById', userId);
  }

  function updateUserPw(userId: string) {
    updateUserPassword(userId, 'testpw');
  }

  function loadPermissions() {
    users.value().map((user) => permissionsState.dispatch('retrievePermissions', user.id) );
    console.log(permissions.value());
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