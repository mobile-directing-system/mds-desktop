<template>
  <div>
    <div
      id="create-new-group-form"
      class=" bg-background ml-4 max-w-lg rounded-lg  my-10"
    >
      <header class=" max-w-lg pb-10">
        <h1 class="  text-left text-4xl font-bold text-on_background">
          Create a new Group
        </h1>        
      </header>
      <form class="w-100">
        <main>
          <!------- Title  ------>
          <FormInput
            id="create-group-title"
            v-model="updatedGroupTitle"
            div-class="w-80"
            label="Title"
            required
          />
          <!------- Description  ------>
          <FormInput
            id="create-group-description"
            v-model="updatedGroupDescription"
            div-class="w-80"
            label="Description"
          />
          <!------- Operation  ------>
          <div
            v-if="!checkPermissions([{name: PermissionNames.OperationViewAny}])"
            class="bg-error_superlight border-2 w-100 mb-6 p-1 border-error_dark text-on_error_superlight rounded"
          >
            You lack the operation view permission, as such you cannot set or change the associated operation of the group.
          </div>
          <div 
            v-if="checkPermissions([{name: PermissionNames.OperationViewAny}])"
            class="mb-6 w-80"
          >
            <label
              for="create-group-operation"
              class="block mb-2 text-sm font-medium text-on_background"
            >Select an Operation</label>
            <SearchableSelect
              id="create-group-operation"
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
          <div
            v-if="!checkPermissions([{name: PermissionNames.OperationMembersView}]) && checkPermissions([{name: PermissionNames.OperationViewAny}])"
            class="bg-error_superlight border-2 w-100 mb-6 p-1 border-error_dark text-on_error_superlight rounded"
          >
            If an operation is selected no group member can be selected, as you are missing the operation members view permission to verify
            that group members are also operation members. If you select group members and afterwards select an operation the group will
            be created with no members.
          </div>
          <div
            v-if="!checkPermissions([{name: PermissionNames.OperationMembersView}]) && !checkPermissions([{name: PermissionNames.OperationViewAny}]) && updatedGroupOperationId"
            class="bg-error_superlight border-2 w-100 mb-6 p-1 border-error_dark text-on_error_superlight rounded"
          >
            This group has an associated operation and you lack the permission to see its members, as such you cannot change the group members
            as it can not be verified that they are operation members as well.
          </div>
          <div
            v-if="!checkPermissions([{name: PermissionNames.UserView}])"
            class="bg-error_superlight border-2 w-100 mb-6 p-1 border-error_dark text-on_error_superlight rounded"
          >
            You cannot see the names of the group members, as you lack the users view permission. As such
            you cannot change the group members.
          </div>
          <div
            v-if="(!updatedGroupOperationId || checkPermissions([{name: PermissionNames.OperationMembersView}])) && checkPermissions([{name: PermissionNames.UserView}])" 
            class="mb-6"
          >
            <div
              v-if="updatedGroupOperationId"
              class="bg-error_superlight border-2 w-80 mb-6 p-1 border-error_dark text-on_error_superlight rounded"
            >
              Only members of the selected operation can be members of this group.
            </div>
            <MemberSelection
              id="create-group-add-members"
              v-model="updatedGroupMemberIds"
              :include-ids="selectedOperationMembers"
              :include="updatedGroupOperationId? true: false"
            />
          </div>
          <div class="pt-4 flex justify-between">
            <!-- Create Group Button -->
            <NormalButton
              v-if="updatedGroupTitle !== ''"
              id="create-group-button"
              @click.prevent="createGroup()"
            >
              Create Group
            </NormalButton>
            <!-- Cancel Button -->
            <NormalButton
              id="create-group-cancel-button"
              class=" ml-auto"
              @click.prevent="router.push('/groups')"
            >
              Cancel
            </NormalButton>
          </div>
        </main>
      </form>
    </div>
  </div>
</template>
<script lang="ts" setup> 
  import { ref, computed, watch } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import FormInput from '../components/BasicComponents/FormInput.vue';
  import MemberSelection from '../components/MemberSelection.vue';
  import SearchableSelect from '../components/BasicComponents/SearchableSelect.vue';
  import { useGroupState, useOperationsState } from '../store';
  import { usePermissions } from '../composables';
  import { PermissionNames } from '../constants';
  import{useRouter } from 'vue-router';
  import type { Ref } from 'vue';

  const groupState = useGroupState();
  const operationsState = useOperationsState();
  const router = useRouter();
  const checkPermissions = usePermissions();
  const updatedGroupTitle = ref('');
  const updatedGroupDescription = ref('');
  const updatedGroupOperationId = ref('');
  const updatedGroupMemberIds : Ref<string[]> = ref([]);
  const operationsSearchResults = computed(() => operationsState.getters.searchResults);
  const operationMembers = computed(() => operationsState.getters.members); 
  const operationsSearchResultsArray = computed(() => {
    //InterableIterator converted to Array to be used in searchable select
    return InterableIteratorToArray(operationsSearchResults.value().values());
  });
  const selectedOperationMembers = computed(() => operationMembers.value().get(updatedGroupOperationId.value));

  //watcher to retrieve new operation members when the operation id changes. Needed for filtering available group members
  watch(updatedGroupOperationId, (curVal) => {
    if(curVal) {
      if(checkPermissions([{name: PermissionNames.OperationMembersView}])) {
        operationsState.dispatch('retrieveOperationMembersById', curVal);
      }
    }
  });

  /**
   * input handler for the operations searchable select
   * @param query search string
   */
  function handleOperationSelectionInput(query: string) {
    if(checkPermissions([{name: PermissionNames.OperationViewAny}])) {
      operationsState.dispatch('searchOperationsByQuery', {query, limit:10});
    }
  }

  /**
   * function to create new group object and initate call to the backend. Click handler for the Create Group Button.
   */
  function createGroup(){
      groupState.dispatch('createGroup', {
        id: '',
        title: updatedGroupTitle.value,
        description: updatedGroupDescription.value? updatedGroupDescription.value : undefined,
        operation: updatedGroupOperationId.value? updatedGroupOperationId.value: undefined,
        members: checkPermissions([{name: PermissionNames.OperationMembersView}]) ? updatedGroupMemberIds.value : [],
      });
      updatedGroupTitle.value = '';
      updatedGroupDescription.value = '';
      updatedGroupOperationId.value = '';
      updatedGroupMemberIds.value = [];
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