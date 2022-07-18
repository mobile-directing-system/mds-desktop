<template>
  <div>
    <div class=" bg-white ml-4 max-w-lg rounded-lg  my-10">
      <header class=" max-w-lg pb-10">
        <h1 class="text-4xl font-bold text-black ">
          Create a new Operation
        </h1>        
      </header>
      <form class="w-80">
        <main class="">
          <!------- Title  ------>
          <div class="mb-6">
            <FormInput
              id="title"
              v-model="title"
              label="Title"
            />
          </div>
          <!------- Description  ------>
          <div class="mb-6">
            <FormInput
              id="description"
              v-model="description"
              label="Description"
            />
          </div>
          <!------- Start  ------>
          <div class="mb-6">
            <FormInput
              id="start"
              v-model="start"
              label="Start"
              type="datetime-local"
            />
          </div>
          <!--- End --->
          <div class="mb-6">
            <FormInput
              id="end"
              v-model="end"
              label="End"
              type="datetime-local"
            />
          </div>
          <!--- Submit Button --->
          <div class="flex justify-between">
            <NormalButton 
              v-if="title != '' && description != '' && start !='' && end !=''"
              :btn-text="'Create Operation'"
              @click="createNewOperation(title, description, start, end)"
            />
            <NormalButton
              class=" ml-auto"
              :btn-text="'Cancel'"
              @click="router.push('/operation')"
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
    import FormInput from '../components/BasicComponents/FormInput.vue';

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