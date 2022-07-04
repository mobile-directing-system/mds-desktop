<template>
  <main
    class="bg-white mx-auto max-w-lg p-8 rounded-lg shadow-2xl my-10"
  >
    <form class="w-80">
      <div
        v-if="loginFailed"
        class="flex justify-between p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
        role="alert"
      >
        <span class="font-medium">Login Failed</span>
        <span
          class="text-xl font-medium cursor-pointer"
          @click.prevent="closeLoginAlert"
        >&times;</span>
      </div>
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
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useLoginState } from '../store';

  const router = useRouter();
  const loginState = useLoginState();
  const username = ref('');
  const password = ref('');
  const loggedIn = computed(() => loginState.getters.getLoggedIn);
  const loginFailed = ref(false);

  /** 
   * function for the click handler sets loggingIn to true to
   * show a spinner when waiting for the answer of the backend.
   * calls the login action of the store to call the backend with
   * user supplied username and password. If login was succesful
   * navigate the mainpage view if not show login failed alert.
   */ 

  async function onSubmit() {
    await loginState.dispatch('setLoggingIn', true);
    await loginState.dispatch('login', {username: username.value, password: password.value});
    loginState.dispatch('setLoggingIn', false);
    if(loggedIn.value()) {
      router.push('/main');
    } else  {
      loginFailed.value = true;
      //closes the failed login alert after 10s.
      setTimeout(() => loginFailed.value = false, 10000);
    }
  }

  /**
   * closes the failed login alert
   */
  async function closeLoginAlert() {
    loginFailed.value = false;
  }
</script>