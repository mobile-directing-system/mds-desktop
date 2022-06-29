<template>
  <header class=" max-w-lg mx-auto">
    <h1 class="text-4xl font-bold text-black text-center">
      Create a new User
    </h1>        
  </header>
  <div class="grid place-items-center">
    <form class="w-80">
      <main class="bg-white mx-auto max-w-lg p-8 rounded-lg shadow-2xl my-10">
        <!------- Username  ------>
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
        <!------- first_name  ------>
        <div class="mb-6">
          <label
            for="firstName"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >First Name</label>
          <input
            id="firstName"
            v-model="firstName"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
          >
        </div>
        <!------- last_name  ------>
        <div class="mb-6">
          <label
            for="lastName"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Last Name</label>
          <input
            id="lastName"
            v-model="lastName"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
          >
        </div>
        <!--- Initial Password--->
        <div class="mb-6">
          <label
            for="iPassword"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Initial Password</label>
          <input
            id="iPassword"
            v-model="iPassword"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
          >
        </div>
        <!--- Submit Button --->
        <button
          id="submit"
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          @click.prevent="onSubmit"
        >
          Submit
        </button>
      </main>
    </form>
  </div>
</template>

<script lang="ts" setup>

    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import type { Router } from 'vue-router';

    const router:Router = useRouter();

    const username = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const iPassword = ref('');

    async function onSubmit() {
        const loggedIn = username.value!='' && firstName.value != '' && lastName.value!='' && iPassword.value !='';
        console.log(loggedIn);
        if(loggedIn) {
            router.push('/main');
        } 
    }
</script>