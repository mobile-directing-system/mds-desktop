<template>
  <div
    id="update-group-form"
    class=" bg-white ml-4 max-w-lg rounded-lg  my-10"
  >
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
            id="update-group-title"
            v-model="updatedGroupTitle"
            div-class="w-80"
            label="Title"
            required
            :disabled="checkPermissions([{name: PermissionNames.GroupUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.GroupUpdate}])? 'false':'true'"
          />
        </div>
        <!------- Description  ------>
        <div class="mb-6">
          <FormInput
            id="update-group-description"
            v-model="updatedGroupDescription"
            div-class="w-80"
            label="Description"
            :disabled="checkPermissions([{name: PermissionNames.GroupUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.GroupUpdate}])? 'false':'true'"
          />
        </div>
        <!------- Operation  ------>
        <div class="mb-6 w-80">
          <label
            for="update-group-operations"
            class="block mb-2 text-sm font-medium text-on_background"
          >Select an Operation</label>
          <SearchableSelect
            id="update-group-operation"
            v-model="updatedGroupOperationId"
            :options="options"
            :filter-results="false"
            mode="single"
            placeholder="Select operation"
            label="title"
            value-prop="id"
            track-by="title"
            :disabled="checkPermissions([{name: PermissionNames.GroupUpdate}])? undefined:true"
            :aria-disabled="checkPermissions([{name: PermissionNames.GroupUpdate}])? 'false':'true'"
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
            id="group-members"
            v-model="updatedGroupMemberIds"
            :include-ids="selectedOperationMembers"
            :include="updatedGroupOperationId? true: false"
            :disable-add-members="!checkPermissions([{name: PermissionNames.GroupUpdate}])"
          />
        </div>
        <div class="flex justify-between">
          <!-- Update Group Button -->
          <NormalButton
            v-if="updatedGroupTitle != ''"
            id="update-group-update-button"
            :disabled="!checkPermissions([{name: PermissionNames.GroupUpdate}])"
            @click.prevent="editGroup()"
          >
            Update Group
          </NormalButton>
          <!-- Delete Group Button -->
          <NormalButton
            id="update-group-delete-button"
            class="ml-auto"
            :disabled="!checkPermissions([{name: PermissionNames.GroupDelete}])"
            @click.prevent="deleteGroup()"
          >
            Delete Group
          </NormalButton>
        </div>
        <div class=" pt-4 flex justify-between">
          <!-- Cancel Button -->
          <NormalButton
            id="update-group-cancel-button"
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
  import { ref, computed, onMounted, watch } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import FormInput from '../components/BasicComponents/FormInput.vue';
  import MemberSelection from '../components/MemberSelection.vue';
  import SearchableSelect from '../components/BasicComponents/SearchableSelect.vue';
  import { useGroupState, useOperationsState, useUserState } from '../store';
  import { usePermissions } from '../composables';
  import { PermissionNames } from '../constants';
  import{useRouter, useRoute} from 'vue-router';
  import type { Ref } from 'vue';

  const checkPermissions = usePermissions();
  const groupState = useGroupState();
  const operationsState = useOperationsState();
  const userState = useUserState();
  const router = useRouter();
  const route = useRoute();
  const groups = computed(() => groupState.getters.groups);
  const operations = computed(() => operationsState.getters.operations);
  const operationMembers = computed(() => operationsState.getters.members);
  const selectedGroupID = route.params.selectedGroupID;
  const currentGroup = groups.value().get(selectedGroupID as string);
  const operationsSearchResults = computed(() => operationsState.getters.searchResults);
  const operationsSearchResultsArray = computed(() => {
    //InterableIterator converted to Array to be used in searchable select
    return InterableIteratorToArray(operationsSearchResults.value().values());
  });
  const options = computed(() => {
    // calculate the options for the searchable select. Needed to add options programmatically form the outside
    if(operationsSearchResults.value().has(updatedGroupOperationId.value) || !updatedGroupOperationId.value) {
      return operationsSearchResultsArray.value;
    } else {
      return [...operationsSearchResultsArray.value, operations.value().get(updatedGroupOperationId.value)];
    }
  });
  const selectedOperationMembers = computed(() => operationMembers.value().get(updatedGroupOperationId.value));

  const updatedGroupTitle = ref('');
  const updatedGroupDescription = ref('');
  const updatedGroupOperationId = ref('');
  const updatedGroupMemberIds : Ref<string[]> = ref([]);

  //set refs with content of current group if it exists
  if(currentGroup) {
    updatedGroupTitle.value = currentGroup.title;
    if(currentGroup.description) {
      updatedGroupDescription.value = currentGroup.description;
    }
    if(currentGroup.operation) {
      updatedGroupOperationId.value = currentGroup.operation;
    }
    updatedGroupMemberIds.value = currentGroup.members;
  }

  onMounted(() => {
    //get users for displaying with group
    if(currentGroup) {
      if(currentGroup.operation) {
        operationsState.dispatch('retrieveOperation', currentGroup.operation);
        operationsState.dispatch('retrieveOperationMembersById', currentGroup.operation);
      }
      currentGroup.members.map((elem) => userState.dispatch('retrieveUserById', elem ));
    }
  });

  //watcher to retrieve new operation members when the operation id changes. Needed for filtering available group members
  watch(updatedGroupOperationId, (curVal) => {
    if(curVal) {
      operationsState.dispatch('retrieveOperationMembersById', curVal);
    }
  });

  /**
   * handler for the operation searchable select
   * @param query search string
   */
  function handleOperationSelectionInput(query: string) {
    operationsState.dispatch('searchOperationsByQuery', {query, limit:10});
  }

  /**
   * function to create the edited group object and initate call to the backend. Click handler for the Edit Group Button.
   */
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

  /**
   * function to delete the group. Click handler for the Delete Group Button.
   */
  function deleteGroup(){
    groupState.dispatch('deleteGroupById', selectedGroupID.toString());
    router.push('/groups');
  }

  /**
   * utility function to change an IterableIterator to an array. Needed for use with e.g. the SearchableSelect.
   * @param iter IterableIterator to convert into an array
   * @returns shallow copied array
   */
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