<template>
  <div class=" bg-background ml-4 max-w-lg rounded-lg  my-10">
    <header class=" max-w-lg pb-10">
      <h1 class="  text-left text-4xl font-bold text-on_background">
        Create a new Addressbook Entry
      </h1>        
    </header>
    <form class="w-100">
      <main>
        <!----- Label ---->
        <FormInput
          id="label"
          v-model="addedlabel"
          div-class="w-80"
          label="Label"
        />
        <!----- Description ----->
        <FormInput
          id="description"
          v-model="addeddescription"
          div-class="w-80"
          label="Description"
        />
        <!----- Operation ----->
        <div class="mb-6 w-80">
          <label
            for="operations"
            class="block mb-2 text-sm font-medium text-on_background"
          >Select an Operation</label>
          <SearchableSelect
            v-model="addedOperationId"
            :options="operationsSearchResultsArray"
            mode="single"
            placeholder="Select operation"
            label="title"
            value-prop="id"
            :filter-results="false"
            track-by="title"
            @search-change="handleOperationSelectionInput"
            @open="handleOperationSelectionInput('')"
          />
        </div>  
        <!------ User ----->
        <div class="mb-6 w-80">
          <label
            for="operations"
            class="block mb-2 text-sm font-medium text-on_background"
          >Select an User</label>
          <SearchableSelect
            v-model="addedUserId"
            :options="usersSearchResultsArray"
            mode="single"
            placeholder="Select User"
            label="username"
            value-prop="id"
            :filter-results="false"
            track-by="username"
            @search-change="handleUserSelectionInput"
            @open="handleUserSelectionInput('')"
          />
        </div>  
        <div class="pt-4 flex justify-between">
          <NormalButton
            v-if="addedlabel !='' && addeddescription != ''"
            @click.prevent="createAddressbookEntry()"
          >
            Create Entry
          </NormalButton>
          <NormalButton
            class=" ml-auto"
            @click.prevent="router.push('/addressbook')"
          >
            Cancel
          </NormalButton>
        </div>
      </main>
    </form>
  </div>
</template>
<script lang = "ts" setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import { useRouter } from 'vue-router';
  import { useAddressbookState, useUserState, useOperationsState } from '../store';
  import FormInput from '../components/BasicComponents/FormInput.vue';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { User, Operation, AddressbookEntry } from '../../../types';
  import SearchableSelect from '../components/BasicComponents/SearchableSelect.vue';
  const addedlabel = ref('');
  const addeddescription = ref('');
  const addedOperationId = ref('');
  const addedUserId = ref('');
  const router = useRouter();
  const userState = useUserState();
  const addressbookState = useAddressbookState();
  const operationsState = useOperationsState();

  const operationsSearchResults = computed(() => operationsState.getters.searchResults);
  const operationsSearchResultsArray = computed(() => {
    return InterableIteratorToArray(operationsSearchResults.value().values());
  });
  const usersSearchResults = computed(() => userState.getters.searchResults);
  const usersSearchResultsArray = computed(() => {
    return InterableIteratorToArray(usersSearchResults.value().values());
  });

  onMounted(() => {
      operationsState.dispatch('retrieveOperations', {amount : 100});
      userState.dispatch('retrieveUsers', {amount: 100});
  });

  watch(addedOperationId, (curVal) => {
    if(curVal) {
      operationsState.dispatch('retrieveOperationMembersById', curVal);
    }
  });
  watch(addedUserId, (curVal) => {
    if(curVal) {
      userState.dispatch('retrieveUserById', curVal);
    }
  });
  function createAddressbookEntry(){
      const newEntry:AddressbookEntry =  {
          id:'',
          label: addedlabel.value,
          description: addeddescription.value ,
          operation: addedOperationId.value? addedOperationId.value:undefined,
          user: addedUserId.value? addedUserId.value:undefined,
      };
      addressbookState.dispatch('createEntry', newEntry);
      router.push('/addressbook');
  }
  function InterableIteratorToArray<T>(iter:IterableIterator<T>):T[] {
    const arr: T[] = [];
    // eslint-disable-next-line no-constant-condition
    while(true) {
      const next = iter.next();
      if(next.done) {
        break;
      }
      arr.push(next.value);
    }
    return arr;
  }
  function handleOperationSelectionInput(query: string) {
    operationsState.dispatch('searchOperationsByQuery', {query, limit:10});
  }
  function handleUserSelectionInput(query: string) {
    userState.dispatch('searchUsersByQuery', {query, limit:10});
  }
</script>