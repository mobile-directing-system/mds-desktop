<template>
  <div class=" bg-background ml-4 max-w-lg rounded-lg  my-10">
    <header class=" max-w-lg pb-10">
      <h1 class="  text-left text-4xl font-bold text-on_background">
        Create a new Group
      </h1>        
    </header>
    <form class="w-100">
      <main>
        <!------- Title  ------>
        <FormInput
          id="title"
          v-model="updatedGroupTitle"
          div-class="w-80"
          label="Title"
          required
        />
        <!------- Description  ------>
        <FormInput
          id="description"
          v-model="updatedGroupDescription"
          div-class="w-80"
          label="Description"
        />
        <!------- Operation  ------>
        <div class="mb-6 w-80">
          <label
            for="operations"
            class="block mb-2 text-sm font-medium text-on_background"
          >Select an Operation</label>
          <SearchableSelect
            v-model="updatedGroupOperationId"
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
        <!-- Members -->
        <div class="mb-6">
          <div
            v-if="updatedGroupOperationId"
            class="bg-error_superlight border-2 w-80 mb-6 p-1 border-error_dark text-on_error_superlight rounded"
          >
            Only members of the selected operation can be members of this group.
          </div>
          <MemberSelection 
            v-model="updatedGroupMemberIds"
            :include-ids="selectedOperationMembers"
            :include="updatedGroupOperationId? true: false"
          />
        </div>
        <!--- Submit Button --->
          
        <div class="pt-4 flex justify-between">
          <NormalButton 
            v-if="updatedGroupTitle != ''"
            @click.prevent="createGroup()"
          >
            Create Group
          </NormalButton>
          <NormalButton
            class=" ml-auto"
            @click.prevent="router.push('/groups')"
          >
            Cancel
          </NormalButton>
        </div>
      </main>
    </form>
  </div>
</template>
<script lang="ts" setup> 
  import { ref, computed, watch } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import FormInput from '../components/BasicComponents/FormInput.vue';
  import MemberSelection from '../components/MemberSelection.vue';
  import SearchableSelect from '../components/BasicComponents/SearchableSelect.vue';
  import { useGroupState, useOperationsState } from '../store';
  import{useRouter } from 'vue-router';
  import type { Ref } from 'vue';

  const groupState = useGroupState();
  const operationsState = useOperationsState();
  const router = useRouter();
  const updatedGroupTitle = ref('');
  const updatedGroupDescription = ref('');
  const updatedGroupOperationId = ref('');
  const updatedGroupMemberIds : Ref<string[]> = ref([]);
  const operationsSearchResults = computed(() => operationsState.getters.searchResults);
  const operationMembers = computed(() => operationsState.getters.members); 
  const operationsSearchResultsArray = computed(() => {
    return InterableIteratorToArray(operationsSearchResults.value().values());
  });
  const selectedOperationMembers = computed(() => operationMembers.value().get(updatedGroupOperationId.value));

  watch(updatedGroupOperationId, (curVal) => {
    if(curVal) {
      operationsState.dispatch('retrieveOperationMembersById', curVal);
    }
  });

  function handleOperationSelectionInput(query: string) {
    operationsState.dispatch('searchOperationsByQuery', {query, limit:10});
  }

  function createGroup(){
      groupState.dispatch('createGroup', {
        id: '',
        title: updatedGroupTitle.value,
        description: updatedGroupDescription.value? updatedGroupDescription.value : undefined,
        operation: updatedGroupOperationId.value? updatedGroupOperationId.value: undefined,
        members: updatedGroupMemberIds.value,
      });
      router.push('/groups');
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
</script>