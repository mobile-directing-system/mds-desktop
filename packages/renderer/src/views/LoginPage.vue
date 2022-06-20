<template>
  <div class="grid place-items-center h-screen">
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
      <button
        id="submit"
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click.prevent="onSubmit"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import type { Router } from 'vue-router';
    import { login } from '#preload';

    const router:Router = useRouter();
    const username = ref('');
    const password = ref('');
    const loginFailed = ref(false);

    async function onSubmit() {
        const loggedIn: boolean = await login(username.value, password.value);
        console.log(loggedIn);
        if(loggedIn) {
            router.push('/main');
        } else  {
            loginFailed.value = true;
            setTimeout(() => loginFailed.value = false, 10000);
        }
    }

    async function closeLoginAlert() {
        loginFailed.value = false;
    }
</script>