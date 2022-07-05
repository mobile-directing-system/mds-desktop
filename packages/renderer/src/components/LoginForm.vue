<template>
  <main
    class="bg-white mx-auto max-w-lg p-8 rounded-lg shadow-2xl my-10"
  >
    <form class="w-80">
      <div class="mb-6">
        <label
          for="username"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >Username</label>
        <input
          id="username"
          v-model="username"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
        >
      </div>
      <div class="mb-6">
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >Password</label>
        <input
          id="password"
          v-model="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="password"
        >
      </div>
      <NormalButton
        btn-text="Login"
        btn-id="submit"
        btn-type="submit"
        @btn-click="onSubmit"
      />
    </form>
  </main>
</template>
<script lang="ts" setup>
  /**
   * Login form component displays the
   * login form.
   */
  import NormalButton from './BasicComponents/NormalButton.vue';
  import { ref } from 'vue';
  import { useLoginState } from '../store';

  const loginState = useLoginState();
  const username = ref('');
  const password = ref('');

  /** 
   * function for the click handler sets loggingIn to true to
   * show a spinner when waiting for the answer of the backend.
   * calls the login action of the store to call the backend with
   * user supplied username and password. If login was succesful
   * navigate the mainpage view if not show login failed alert.
   */ 

  async function onSubmit() {
    loginState.dispatch('login', {username: username.value, password: password.value});
  }
</script>