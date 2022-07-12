<template>
  <div class="grid place-items-center bg-white mx-auto max-w-lg rounded-lg my-10">
    <header class=" max-w-lg mx-auto pb-10">
      <h1 class="text-4xl font-bold text-black text-center">
        Update User
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
            v-model="updatedUserName"
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
            v-model="updatedUserFirstName"
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
            v-model="updatedUserLastName"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
          >
        </div>
        <!--- Submit Button --->
          
        <div class="flex justify-between">
          <NormalButton 
            :btn-text="'Update User'"
            @btn-click="editUser()"
          />
          <NormalButton
            class=" ml-auto"
            :btn-text="'Cancel'"
            @btn-click="backToMain()"
          />
        </div>
      </main>
    </form>
  </div>
</template>

<script lang="ts" setup> 
    import { ref } from 'vue';
    import NormalButton from './BasicComponents/NormalButton.vue';
    import { useUserState, useMainAppState} from '../store';
    import type {User} from '../../../types';

    const userState = useUserState();
    const mainAppState = useMainAppState(); 
    const selectedUserID = mainAppState.getters.getSelectedUserId();
    const updatedUserFirstName = ref('');
    updatedUserFirstName.value = mainAppState.getters.getSelectedUserFirstName();
    const updatedUserName = ref('');
    updatedUserName.value = mainAppState.getters.getSelectedUserUserName();
    const updatedUserLastName = ref('');
    updatedUserLastName.value = mainAppState.getters.getSelectedUserLastName();

    function editUser(){
        const updatedUser:User = {
            id: selectedUserID,
            username : updatedUserName.value,
            first_name : updatedUserFirstName.value,
            last_name : updatedUserLastName.value,
            pass : 'newPass',
            is_admin : false,            
        };
        userState.dispatch('updateUser', updatedUser);
        mainAppState.mutations.setCurrentPositionInApp(CurrentPosition.User_AllUsers);
    }
    function backToMain(){
      mainAppState.mutations.setCurrentPositionInApp(CurrentPosition.User_AllUsers);
    }
    enum CurrentPosition {
        User_AllUsers ='User_AllUsers',
    }
</script>