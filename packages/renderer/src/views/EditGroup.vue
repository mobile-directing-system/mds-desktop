<template>
  <div class=" bg-white ml-4 max-w-lg rounded-lg  my-10">
    <header class=" max-w-lg pb-10">
      <h1 class="  text-left text-4xl font-bold text-on_background">
        Group Information
      </h1>        
    </header>
    <form class="w-100">
      <main class="">
        <!------- Title  ------>
        <div class="mb-6">
          <FormInput
            id="title"
            v-model="updatedGroupTitle"
            div-class="w-80"
            label="Title"
          />
        </div>
        <!------- Description  ------>
        <div class="mb-6">
          <FormInput
            id="description"
            v-model="updatedGroupDescription"
            div-class="w-80"
            label="Description"
          />
        </div>
        <!------- Operation  ------>
        <div class="mb-6 w-80">
          <label
            for="operations"
            class="block mb-2 text-sm font-medium text-on_background"
          >Select an Operation</label>
          <SearchableSelect
            v-model="updatedGroupOperationId"
            :options="[...operationsSearchResultsArray, operationsSearchResults().has(updatedGroupOperationId)? [] : operations().get(updatedGroupOperationId)]"
            mode="single"
            placeholder="Select operation"
            label="title"
            value-prop="id"
            track-by="title"
            @search-change="handleOperationSelectionInput"
            @open="handleOperationSelectionInput('')"
          />
        </div>
        <!-- Members -->
        <div class="mb-6">
          <MemberSelection
            v-model="updatedGroupMemberIds"
          />
        </div>
        <!--- Submit Button --->
        <div class="flex justify-between">
          <NormalButton 
            v-if="updatedGroupTitle != ''"
            @click.prevent="editGroup()"
          >
            Update Group
          </NormalButton>
          <NormalButton
            class="ml-auto"
            @click.prevent="deleteGroup()"
          >
            Delete Group
          </NormalButton>
        </div>
        <div class=" pt-4 flex justify-between">
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
  import { ref, computed, onMounted } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import FormInput from '../components/BasicComponents/FormInput.vue';
  import MemberSelection from '../components/MemberSelection.vue';
  import SearchableSelect from '../components/BasicComponents/SearchableSelect.vue';
  import { useGroupState, useOperationsState, useUserState } from '../store';
  import{useRouter, useRoute} from 'vue-router';
  import type { Ref } from 'vue';

  const groupState = useGroupState();
  const operationsState = useOperationsState();
  const userState = useUserState();
  const router = useRouter();
  const route = useRoute();
  const groups = computed(() => groupState.getters.groups);
  const operations = computed(() => operationsState.getters.operations);
  const selectedGroupID = route.params.selectedGroupID;
  const currentGroup = groups.value().get(selectedGroupID as string);
  const operationsSearchResults = computed(() => operationsState.getters.searchResults);
  const operationsSearchResultsArray = computed(() => {
    return InterableIteratorToArray(operationsSearchResults.value().values());
  });

  const updatedGroupTitle = ref('');
  const updatedGroupDescription = ref('');
  const updatedGroupOperationId = ref('');
  const updatedGroupMemberIds : Ref<string[]> = ref([]);

  if(currentGroup) {
    updatedGroupTitle.value = currentGroup.title;
    updatedGroupDescription.value = currentGroup.description;
    updatedGroupOperationId.value = currentGroup.operation;
    updatedGroupMemberIds.value = currentGroup.members;
  }

  onMounted(() => {
    //get users for displaying with group
    if(currentGroup) {
      operationsState.dispatch('retrieveOperation', currentGroup.operation);
      currentGroup.members.map((elem) => userState.dispatch('retrieveUserById', elem ));
    }
  });

  function handleOperationSelectionInput(query: string) {
    operationsState.dispatch('searchOperationsByQuery', {query, limit:10});
  }

  function editGroup(){
    groupState.dispatch('updateGroup', {
      id: selectedGroupID.toString(),
      title: updatedGroupTitle.value,
      description: updatedGroupDescription.value,
      operation: updatedGroupOperationId.value,
      members: updatedGroupMemberIds.value,
    });
    router.push('/groups');
  }

  function deleteGroup(){
    groupState.dispatch('deleteGroupById', selectedGroupID.toString());
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