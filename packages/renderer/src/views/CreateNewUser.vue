<template>
  <div>
    <div class="grid place-items-center bg-white mx-auto max-w-lg rounded-lg  my-10">
      <header class=" max-w-lg mx-auto pb-10">
        <h1 class="text-4xl font-bold text-black text-center">
          Create a new User
        </h1>        
      </header>
      <form class="w-80">
        <main class="">
          <!------- Username  ------>
          <div class="mb-6">
            <label
              for="username"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Username</label>
            <input
              id="username"
              v-model="userName"
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
          <div class="flex justify-between">
            <NormalButton 
              v-if="userName != '' && firstName != '' && lastName !='' && iPassword !=''"
              :btn-text="'Create User'"
              @btn-click="createNewUser(userName, firstName, lastName, iPassword)"
            />
            <NormalButton
              class=" ml-auto"
              :btn-text="'Cancel'"
              @btn-click="router.push('/user')"
            />
          </div>
        </main>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>

    import { ref } from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import { useUserState } from '../store';
    import{useRouter} from 'vue-router';

    const userName = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const iPassword = ref(''); 
    const userState = useUserState();
    const router = useRouter();

    function createNewUser( username: string, firstname: string, lastname :string, ipassword : string) {
        userState.dispatch('createUser', {
            id: '',
            username: username,
            first_name: firstname,
            last_name: lastname,
            is_admin: false,
            pass: ipassword,
        });
        userName.value = '';
        firstName.value ='';
        lastName.value ='';
        iPassword.value = '';
  }

</script>

