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
              required
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
              required
            />
          </div>
          <!--- End --->
          <div class="mb-6">
            <FormInput
              id="end"
              v-model="end"
              label="End"
              type="datetime-local"
              :min="start"
            />
          </div>
          <!-- Operation Member Selection -->
          <div class="mb-6">
            <MemberSelection 
              v-model="operationMemberIds"
            />
          </div>
        </main>
      </form>
      <!--- Submit Button --->
      <div class="flex justify-between">
        <NormalButton 
          v-if="title != '' && start && (!end || new Date(start) < new Date(end))"
          @click.prevent="createNewOperation(title, description, start, end)"
        >
          Create Operation
        </NormalButton>
        <NormalButton
          class=" ml-auto"
          @click.prevent="router.push('/operation')"
        >
          Cancel
        </NormalButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

    import { ref } from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import MemberSelection from '../components/MemberSelection.vue';
    import { useOperationsState } from '../store';
    import{useRouter} from 'vue-router';
    import type {Operation} from '../../../types';
    import FormInput from '../components/BasicComponents/FormInput.vue';
    import type {Ref} from 'vue';

    const title = ref('');
    const description = ref('');
    const start = ref('');
    const end = ref(''); 
    const operationMemberIds: Ref<string[]> = ref([]);
    const operationState = useOperationsState();
    const router = useRouter();
    /* eslint-disable */
    function createNewOperation( titleI: string, descriptionI: string, start :string, end : string) {
        const newOperation:Operation = {
            id: '',
            title: titleI,
            description: descriptionI? descriptionI : undefined,
            start: start? new Date(start) : undefined,
            end: end? new Date(end) : undefined,
            is_archived: false,
        };

        operationState.dispatch('createOperation', {operation: newOperation, memberIds: operationMemberIds.value});
        title.value ='';
        description.value ='';
  }
  /* eslint-enable */

</script>