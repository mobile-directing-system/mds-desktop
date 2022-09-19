<template>
  <div
    id="update-operation-form" 
    class=" bg-white ml-4 max-w-lg rounded-lg my-10"
  >
    <header class=" max-w-lg pb-10">
      <h1 class="text-4xl font-bold text-black ">
        Update Operation
      </h1>        
    </header>
    <form class="w-80">
      <main class="">
        <!------- Title  ------>
        <div class="mb-6">
          <FormInput
            id="update-operation-title"
            v-model="updatedtitle"
            label="Title"
            required
            :disabled="checkPermissions([{name: PermissionNames.OperationUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.OperationUpdate}])? 'false':'true'"
          />
        </div>
        <!------- Description  ------>
        <div class="mb-6">
          <FormInput
            id="update-operation-description"
            v-model="updateddescription"
            label="Description"
            :disabled="checkPermissions([{name: PermissionNames.OperationUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.OperationUpdate}])? 'false':'true'"
          />
        </div>
        <!------- start  ------>
        <div class="mb-6">
          <FormInput
            id="update-operation-start"
            v-model="updatedstart"
            label="Start"
            type="datetime-local"
            required
            :disabled="checkPermissions([{name: PermissionNames.OperationUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.OperationUpdate}])? 'false':'true'"
          />
        </div>
        <!---- end --->
        <div class="mb-6">
          <FormInput
            id="update-operation-end"
            v-model="updatedend"
            label="End"
            type="datetime-local"
            :min="updatedstart"
            :disabled="checkPermissions([{name: PermissionNames.OperationUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.OperationUpdate}])? 'false':'true'"
          />
        </div>
        <!-- Operation Member Selection -->
        <div
          v-if="checkPermissions([{name: PermissionNames.OperationMembersView}])"
          class="mb-6"
        >
          <MemberSelection
            id="operation-members"
            v-model="updatedOperationMemberIds"
            :disable-add-members="!checkPermissions([{name: PermissionNames.OperationMembersUpdate}])"
          />
        </div>
        <!---- archive --->
        <div class="mb-6 flex justify-between flex-row">
          <label
            for="update-operation-is_archived"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 "
          >Archive</label>
          <input
            id="update-operation-is_archived"
            v-model="updatedisArchived"
            class="bg-gray-50 border w-1/12 mr-40 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.OperationUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.OperationUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <!-- Update Operation Button -->
          <NormalButton 
            v-if="updatedtitle != '' && updatedstart && (!updatedend || new Date(updatedstart) < new Date(updatedend))"
            id="update-operation-update-button"
            :disabled="!checkPermissions([{name: PermissionNames.OperationUpdate}])"
            @click.prevent="editOperation()"
          >
            Update Operation
          </NormalButton>
          <!-- Cancel Button -->
          <NormalButton
            id="update-operation-cancel-button"
            class=" ml-auto"
            @click.prevent="router.push('/operation')"
          >
            Cancel
          </NormalButton>
        </div>
      </main>
    </form>
  </div>
</template>

<script lang="ts" setup> 
    import { ref, computed, onMounted} from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import FormInput from '../components/BasicComponents/FormInput.vue';
    import MemberSelection from '../components/MemberSelection.vue';
    import { useOperationsState} from '../store';
    import { usePermissions } from '../composables';
    import { PermissionNames } from '../constants';
    import type {Operation} from '../../../types';
    import type { Ref } from 'vue';

    import{useRouter, useRoute} from 'vue-router';
    const operationState = useOperationsState();
    const router = useRouter();
    const route = useRoute();

    const operations = computed(() => operationState.getters.operations);
    const operationMembers = computed(() => operationState.getters.members);
    const selectedOperationID = route.params.selectedOperationID;
    const currentOperation = operations.value().get(selectedOperationID as string);
    const updatedtitle = ref('');
    const updateddescription = ref('');
    const updatedstart = ref('');
    const updatedend = ref('');
    const updatedOperationMemberIds:Ref<string[]> = ref([]);
    const updatedisArchived = ref(false);
    const checkPermissions = usePermissions();

    // get operation members if they exist
    onMounted(async () => {
      if(checkPermissions([{name: PermissionNames.OperationMembersView}])) {
        await operationState.dispatch('retrieveOperationMembersById', selectedOperationID as string);
        const members = operationMembers.value().get(selectedOperationID as string);
        updatedOperationMemberIds.value = members?members:[];
      }
    });

    //set refs with content of current operation if it exists
    if(currentOperation) {
      updatedtitle.value = currentOperation.title;
      if(currentOperation.description) {
        updateddescription.value = currentOperation.description;
      }
      if(currentOperation.start) {
        updatedstart.value = currentOperation.start.toISOString().slice(0, 16);
      }
      if(currentOperation.end) {
        updatedend.value = currentOperation.end.toISOString().slice(0, 16);
      }
      updatedisArchived.value = currentOperation.is_archived;
    }
    
    /**
     * function to create the edited operation object and initate call to the backend. Click handler for the Edit Operation Button.
     */
    function editOperation(){
        const updatedOperation:Operation = {
            id: selectedOperationID as string,
            title : updatedtitle.value,
            description : updateddescription.value? updateddescription.value : undefined,
            start : updatedstart.value? new Date(updatedstart.value) : undefined,
            end: updatedend.value? new Date(updatedend.value) : undefined,
            is_archived: updatedisArchived.value,       
        };
        operationState.dispatch('updateOperation', updatedOperation);
        if(checkPermissions([{name: PermissionNames.OperationMembersUpdate}])) {
          operationState.dispatch('updateOperationMembersById', {operationId: selectedOperationID as string, memberIds: updatedOperationMemberIds.value });
        }
        router.push('/operation');
    }
</script>
