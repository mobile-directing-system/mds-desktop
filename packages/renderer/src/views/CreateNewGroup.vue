<template>
  <div class=" bg-white ml-4 max-w-lg rounded-lg  my-10">
    <header class=" max-w-lg pb-10">
      <h1 class="  text-left text-4xl font-bold text-on_background">
        Create a new Group
      </h1>        
    </header>
    <form class="w-80">
      <main class="">
        <!------- Title  ------>
        <div class="mb-6">
          <FormInput
            id="title"
            v-model="updatedGroupTitle"
            label="Title"
          />
        </div>
        <!------- Description  ------>
        <div class="mb-6">
          <FormInput
            id="description"
            v-model="updatedGroupDescription"
            label="Description"
          />
        </div>
        <!------- Operation  ------>
        <div class="mb-6">
          <label
            for="operations"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >Select an Operation</label>
          <select
            id="operations"
            v-model="updatedGroupOperationId"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option
              value=""
              selected
            >
              Choose an Operation
            </option>
            <option
              v-for="operation in operations()"
              :key="operation.id"
              :value="operation.id"
            >
              {{ operation.title }}
            </option>
          </select>
        </div>
        <!-- Members -->
        <div class="mb-6">
          <div class="flex justify-between">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-400">Group Members</label>
            <!-- Add Members Button -->
            <NormalButton
              btn-text="+"
              @click.prevent="toggleMembersModal()"
            />
          </div>
          <!-- Members Table -->
          <div class="table-fixed place-items-center mr-10 -ml-5">
            <table class=" border-spacing-2 w-full rounded-md overflow-hidden m-4">
              <thead class=" bg-blue-700 font-bold text-white text-l text-left text-lg">
                <tr class="p-2">
                  <th class="p-2">
                    User Name
                  </th>
                  <th class="p-2">
                    Firstname
                  </th>
                  <th class="p-2">
                    Lastname
                  </th>
                  <th class="p-2" />
                </tr>
              </thead> 
              <tbody class="text-left">     
                <tr
                  v-for="userId in updatedGroupMemberIds" 
                  :key="userId"
                  class="p-2 border-b-2 border-b-gray-500 bg-background text-on_background"
                >      
                  <td class="p-2">
                    {{ users().filter((elem) => elem.id === userId)[0].username }}
                  </td>
                  <td class="p-2">
                    {{ users().filter((elem) => elem.id === userId)[0].first_name }}
                  </td>
                  <td class="p-2">
                    {{ users().filter((elem) => elem.id === userId)[0].last_name }}
                  </td>
                  <td>
                    <!-- Delete Member Button -->
                    <button
                      type="button"
                      class="bg-background text-on_background hover:bg-surface_dark hover:text-on_surface_dark rounded-lg focus:ring-2 focus:ring-surface p-1.5 inline-flex h-8 w-8 "
                      @click.prevent="updatedGroupMemberIds = updatedGroupMemberIds.filter((elem) => elem !== userId)"
                    >
                      <span class="sr-only">Close</span>
                      <svg
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr> 
              </tbody>
            </table>
          </div>
          <!-- Opaque Overlay behind Modal -->
          <div
            v-if="showMembersModal"
            class="absolute inset-0 z-40 opacity-25 bg-black"
          />
          <!-- Add Member Modal -->
          <div
            v-if="showMembersModal"
            class="fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center z-50"
          >
            <div
              class="relative mx-auto w-auto p-2 max-w-2xl bg-white rounded"
            >
              <div class="mb-6">
                <label
                  for="members"
                  class="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >Select an Operation</label>
                <select
                  id="members"
                  v-model="addGroupMemberIds"
                  multiple
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option
                    v-for="user in users().filter((elem1) => updatedGroupMemberIds.findIndex((elem2) => elem1.id === elem2 ) === -1)"
                    :key="user.id"
                    :value="user.id"
                  >
                    {{ user.username }}
                  </option>
                </select>
              </div>
              <div class="flex justify-between">
                <NormalButton
                  class="mr-2"
                  btn-text="Add Members"
                  @click.prevent="addMembers()"
                />
                <NormalButton 
                  btn-text="Cancel"
                  @click.prevent="toggleMembersModal()"
                />
              </div>
            </div>
          </div>
        </div>
        <!--- Submit Button --->
          
        <div class="pt-4 flex justify-between">
          <NormalButton 
            v-if="updatedGroupTitle != '' && updatedGroupOperationId != ''"
            :btn-text="'Create Group'"
            @click.prevent="createGroup()"
          />
          <NormalButton
            class=" ml-auto"
            :btn-text="'Cancel'"
            @click.prevent="router.push('/groups')"
          />
        </div>
      </main>
    </form>
  </div>
</template>
<script lang="ts" setup> 
  import { ref, computed, onMounted } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import FormInput from '../components/BasicComponents/FormInput.vue';
  import { useGroupState, useOperationsState, useUserState } from '../store';
  import{useRouter } from 'vue-router';
  import type { Ref } from 'vue';
  const groupState = useGroupState();
  const operationsState = useOperationsState();
  const userState = useUserState();
  const router = useRouter();
  const operations = computed(() => operationsState.getters.operations);
  const users = computed(() => userState.getters.users);
  const showMembersModal = ref(false);
  const updatedGroupTitle = ref('');
  const updatedGroupDescription = ref('');
  const updatedGroupOperationId = ref('');
  const updatedGroupMemberIds : Ref<string[]> = ref([]);
  const addGroupMemberIds: Ref<string[]> = ref([]);

  onMounted(() => {
    groupState.dispatch('retrieveGroups', {});
    operationsState.dispatch('retrieveOperations', {});
    userState.dispatch('retreiveUsers', {});
  });

  function createGroup(){
      groupState.dispatch('createGroup', {
        id: '',
        title: updatedGroupTitle.value,
        description: updatedGroupDescription.value,
        operation: updatedGroupOperationId.value,
        members: updatedGroupMemberIds.value,
      });
      router.push('/groups');
  }
  function addMembers(){
    updatedGroupMemberIds.value = [...updatedGroupMemberIds.value, ...addGroupMemberIds.value];
    toggleMembersModal();
  }
  function toggleMembersModal() {
    showMembersModal.value = !showMembersModal.value;
    addGroupMemberIds.value = [];
  }

</script>