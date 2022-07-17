<template>
  <div>
    <div class="grid place-items-center bg-white mx-auto max-w-lg rounded-lg  my-10">
      <header class=" max-w-lg mx-auto pb-10">
        <h1 class="text-4xl font-bold text-black text-center">
          Create a new Operation
        </h1>        
      </header>
      <form class="w-80">
        <main class="">
          <!------- Title  ------>
          <div class="mb-6">
            <label
              for="title"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Title</label>
            <input
              id="username"
              v-model="title"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
            >
          </div>
          <!------- Description  ------>
          <div class="mb-6">
            <label
              for="description"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Description</label>
            <input
              id="description"
              v-model="description"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
            >
          </div>
          <!------- Start  ------>
          <div class="mb-6">
            <label
              for="start"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Start</label>
            <input
              id="start"
              v-model="start"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="datetime-local"
            >
          </div>
          <!--- End --->
          <div class="mb-6">
            <label
              for="end"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >End</label>
            <input
              id="end"
              v-model="end"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="datetime-local"
            >
          </div>
          <!--- Submit Button --->
          <div class="flex justify-between">
            <NormalButton 
              v-if="title != '' && description != '' && start !='' && end !=''"
              :btn-text="'Create Operation'"
              @btn-click="createNewOperation(title, description, start, end)"
            />
            <NormalButton
              class=" ml-auto"
              :btn-text="'Cancel'"
              @btn-click="router.push('/operation')"
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
    import { useOperationsState } from '../store';
    import{useRouter} from 'vue-router';
    import type {Operation} from '../../../types';

    const title = ref('');
    const description = ref('');
    const start = ref('');
    const end = ref(''); 
    const operationState = useOperationsState();
    const router = useRouter();
    /* eslint-disable */
    function createNewOperation( titleI: string, descriptionI: string, start :string, end : string) {
        
        const newOperation:Operation = {
            id: '',
            title: titleI,
            description: descriptionI,
            start: new Date(start),
            end: new Date(end),
            is_archived: false,
        };
        operationState.dispatch('createOperation', newOperation);
        title.value ='';
        description.value ='';
  }
  /* eslint-enable */

</script>