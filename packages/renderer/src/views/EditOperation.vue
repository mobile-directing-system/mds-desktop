<template>
  <div class="grid place-items-center bg-white mx-auto max-w-lg rounded-lg my-10">
    <header class=" max-w-lg mx-auto pb-10">
      <h1 class="text-4xl font-bold text-black text-center">
        Update Operation
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
            id="title"
            v-model="updatedtitle"
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
            v-model="updateddescription"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
          >
        </div>
        <!------- start  ------>
        <div class="mb-6">
          <label
            for="start"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          > Start</label>
          <input
            id="start"
            v-model="updatedstart"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="datetime-local"
          >
        </div>
        <!---- end --->
        <div class="mb-6">
          <label
            for="end"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >End</label>
          <input
            id="end"
            v-model="updatedend"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="datetime-local"
          >
        </div>
        <!---- archive --->
        <div class="mb-6">
          <label
            for="is_archived"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Archive</label>
          <input
            id="is_archived"
            v-model="updatedisArchived"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
          >
        </div>
        <!--- Submit Button --->
          
        <div class="flex justify-between">
          <NormalButton 
            v-if="updatedtitle != '' && updateddescription != '' && updatedstart!= '' && updatedend != ''"
            :btn-text="'Update Operation'"
            @btn-click="editOperation()"
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
</template>

<script lang="ts" setup> 
    import { ref, computed} from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import { useOperationsState} from '../store';
    import type {Operation} from '../../../types';
  
    import{useRouter, useRoute} from 'vue-router';
    const operationState = useOperationsState();
    const router = useRouter();
    const route = useRoute();

    const operations = computed(() => operationState.getters.operations);
    const selectedOperationID = route.params.selectedOperationID;
    const currentOperation = operations.value().filter((elem) => elem.id === selectedOperationID)[0];
    const updatedtitle = ref('');
    updatedtitle.value = currentOperation.title;
    const updateddescription = ref('');
    updateddescription.value = currentOperation.description;
    const updatedstart = ref('');
    updatedstart.value = currentOperation.start.toString();
    const updatedend = ref('');
    updatedend.value = currentOperation.end.toString();
    const updatedisArchived = ref(false);
    updatedisArchived.value = currentOperation.is_archived;
   

    function editOperation(){
        const updatedOperation:Operation = {
            id: selectedOperationID[0],
            title : updatedtitle.value,
            description : updateddescription.value,
            start : new Date(updatedstart.value),
            end: new Date(updatedend.value),
            is_archived: updatedisArchived.value,       
        };
        operationState.dispatch('updateOperation', updatedOperation);
        router.push('/user');
    }

</script>
