<template>
  <div class="bg-background text-primary border-b-2 border-primary">
    <div class="pt-5 pb-3 flex justify-between">
      <div class="px-14 text-center font-extrabold text-4xl">
        MDS
      </div>
      <div class=" flex justify-evenly text-2xl">   
        <div class=" px-16">
          <router-link
            to="/main"
            class=" px-3 hover:bg-contain hover:bg-center hover:bg-primary hover:text-on_primary hover:rounded-lg hover:shadow-xl"
          >
            Ressources
          </router-link>
        </div>

        <div class=" px-16 ">
          <router-link
            to="/intel/create-new-intel-complete"
            class=" px-3 hover:bg-primary hover:text-on_primary hover:rounded-lg hover:shadow-xl"
          >
            Intelligence
          </router-link>
        </div>
        <div class=" px-16 ">
          <router-link
            to="/addressbook"
            class=" px-3 hover:bg-primary hover:text-on_primary hover:rounded-lg hover:shadow-xl"
          >
            Adressbook
          </router-link>
        </div>
        <!-- Settings -->
        <button
          id="toggle-dropdown-button"
          class="hover:bg-primary hover:text-on_primary hover:rounded-xl hover:shadow-xl flex ml-auto mr-5"
          @click="toggleDropdown()"
        >
          <svg
            class="w-8 h-auto mt-0.5 mb-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          /><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          /></svg>
        </button>
      </div>
    </div>
    <div
      v-if="showDropdown"
      id="settings-dropdown"
      class="absolute left-full -translate-x-44 -mt-2.5 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
    >
      <div class="py-3 px-4 text-sm text-gray-900 dark:text-white">
        <div>Logged in as: {{ loggedInUser() }}</div>
      </div>
      <div class="py-1">
        <a
          id="sign-out-link"
          href="#"
          class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          @click="logout()"
        >Sign out</a>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {ref, computed} from 'vue';
  import { useLoginState } from '../store';

  const loginState = useLoginState();
  const loggedInUser = computed(() => loginState.getters.loggedInUser);

  const showDropdown = ref(false);

  function toggleDropdown() {
    showDropdown.value = !showDropdown.value;
  }

  function logout() {
    loginState.dispatch('logout');
  }
</script>