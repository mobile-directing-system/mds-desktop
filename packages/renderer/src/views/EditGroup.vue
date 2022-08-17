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
          <select
            id="operations"
            v-model="updatedGroupOperationId"
            class="bg-surface_superlight border border-surface_dark text-on_surface_superlight text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option
              v-for="operation in operations().values()"
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
            <label class="block text-sm font-medium text-on_background">Group Members</label>
            <!-- Add Members Button -->
            <NormalButton
              @click.prevent="toggleMembersModal()"
            >
              +
            </NormalButton>
          </div>
          <!-- Members Table -->
          <TableContainer
            class="-ml-4"
            :contents="updatedGroupMemberIds"
            id-identifier="id"
          >
            <template #tableHeader>
              <TableHeader :num-of-cols="4">
                <template #header1>
                  User Name
                </template>
                <template #header2>
                  Firstname
                </template>
                <template #header3>
                  Lastname
                </template>
              </TableHeader>
            </template>
            <template #tableRow="{rowData}:{rowData:string}">
              <TableRow
                class="hover:bg-background cursor-auto"
                :num-of-cols="4"
                :row-data="rowData"
                :t-data-class="'p-2'"
              >
                <template #data1="{data}:{data: string}">
                  {{ users().get(data)?.username }}
                </template>
                <template #data2="{data}:{data: string}">
                  {{ users().get(data)?.first_name }}
                </template>
                <template #data3="{data}:{data: string}">
                  {{ users().get(data)?.last_name }}
                </template>
                <template #data4="{data}:{data: string}">
                  <button
                    type="button"
                    class="bg-background text-on_background hover:bg-surface_dark hover:text-on_surface_dark rounded-lg focus:ring-2 focus:ring-surface p-1.5 inline-flex h-8 w-8 "
                    @click.prevent="updatedGroupMemberIds = updatedGroupMemberIds.filter((elem) => elem !== data)"
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
                </template>
              </TableRow>
            </template>
          </TableContainer>
          <FloatingModal
            :show-modal="showMembersModal"
            title="Select a User"
            @click="toggleMembersModal()"
          >
            <div class="mb-6 w-96 max-w-sm">
              <FormInput
                v-model="addMemberSearchTerm"
                placeholder="Search..."
              />
              <div class="w-2xl relative bg-background">
                <div
                  v-for="memberId in addGroupMemberIds"
                  :key="memberId"
                  class="flex-grow-0 inline-flex text-center my-1 ml-1 rounded-full bg-primary_superlight text-on_primary_superlight pr-2"
                >
                  <button 
                    type="button"
                    class="flex-shrink-0 mt-1.5 mb-1.5 -mr-0.5 ml-1.5 inline-flex hover:bg-primary_light p-1 rounded-full"
                    @click="toggleId(memberId)"
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 8 8"
                      class="h-2 w-2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-width="1.5"
                        d="M1 1l6 6m0-6L1 7"
                      />
                    </svg>
                  </button>
                  <span class="inline-flex items-center rounded-full pl-1 py-1 text-sm font-semibold">
                    {{ users().get(memberId)?.username }}
                  </span>
                </div>
              </div>
              <TableContainer
                :contents="usersPage().values()"
                id-identifier="id"
              >
                <template #tableHeader>
                  <TableHeader :num-of-cols="3">
                    <template #header1>
                      Username
                    </template>
                    <template #header2>
                      First Name
                    </template>
                    <template #header3>
                      Last Name
                    </template>
                  </TableHeader>
                </template>
                <template #tableRow="{rowData}:{rowData:User}">
                  <TableRow
                    :class="addGroupMemberIds.includes(rowData.id)? 'bg-primary_superlight' : ''"
                    :num-of-cols="3"
                    :row-data="rowData"
                    :identifier="rowData.id"
                    @click="toggleId(rowData.id)"
                  >
                    <template #data1="{data}:{data:User}">
                      {{ data.username }}
                    </template>
                    <template #data2="{data}:{data:User}">
                      {{ data.first_name }}
                    </template>
                    <template #data3="{data}:{data:User}">
                      {{ data.last_name }}
                    </template>
                  </TableRow>
                </template>
              </TableContainer>
              <PaginationBar
                v-if="addMemberSearchTerm === ''"
                :total-retrievable-entities="totalUserAmount()"
                @update-page="updatePage($event.amount, $event.offset)"
              />
            </div>
            <div class="flex justify-between">
              <NormalButton
                class="mr-2"
                @click.prevent="addMembers()"
              >
                Add Members
              </NormalButton>
            </div>
          </FloatingModal>
        </div>
        <!--- Submit Button --->
        <div class="flex justify-between">
          <NormalButton 
            v-if="updatedGroupTitle != '' && updatedGroupOperationId != ''"
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
  import { ref, computed, onMounted, watch } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import FormInput from '../components/BasicComponents/FormInput.vue';
  import TableContainer from '../components/BasicComponents/TableContainer.vue';
  import TableHeader from '../components/BasicComponents/TableHeader.vue';
  import TableRow from '../components/BasicComponents/TableRow.vue';
  import FloatingModal from '../components/BasicComponents/FloatingModal.vue';
  import PaginationBar from '../components/BasicComponents/PaginationBar.vue';
  import { useGroupState, useOperationsState, useUserState } from '../store';
  import{useRouter, useRoute} from 'vue-router';
  import type { Ref } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { User } from '../../../types';

  const groupState = useGroupState();
  const operationsState = useOperationsState();
  const userState = useUserState();
  const router = useRouter();
  const route = useRoute();
  const groups = computed(() => groupState.getters.groups);
  const operations = computed(() => operationsState.getters.operations);
  const users = computed(() => userState.getters.users);
  const selectedGroupID = route.params.selectedGroupID;
  const currentGroup = groups.value().get(selectedGroupID as string);
  const totalUserAmount = computed(() => userState.getters.total);
  const usersPage = computed(() => userState.getters.page);
  const showMembersModal = ref(false);
  const updatedGroupTitle = ref('');
  const updatedGroupDescription = ref('');
  const updatedGroupOperationId = ref('');
  const updatedGroupMemberIds : Ref<string[]> = ref([]);
  const addGroupMemberIds: Ref<string[]> = ref([]);

  if(currentGroup) {
    updatedGroupTitle.value = currentGroup.title;
    updatedGroupDescription.value = currentGroup.description;
    updatedGroupOperationId.value = currentGroup.operation;
    updatedGroupMemberIds.value = currentGroup.members;
  }

  const addMemberSearchTerm = ref('');

  onMounted(() => {
    operationsState.dispatch('retrieveOperations', {amount: 100});
    //get users for displaying with group
    if(currentGroup) {
      currentGroup.members.map((elem) => userState.dispatch('retrieveUserById', elem ));
    }
  });

  watch(addMemberSearchTerm, (curVal) => {
    userState.dispatch('searchUsersByQuery', {query: curVal});
  });

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
  function addMembers(){
    updatedGroupMemberIds.value = [...updatedGroupMemberIds.value, ...addGroupMemberIds.value];
    toggleMembersModal();
  }
  function toggleMembersModal() {
    showMembersModal.value = !showMembersModal.value;
    addGroupMemberIds.value = [];
    addMemberSearchTerm.value = '';
  }
  function toggleId(groupId:string) {
    if(addGroupMemberIds.value.includes(groupId)) {
      addGroupMemberIds.value = addGroupMemberIds.value.filter((elem) => elem !== groupId );
    } else {
      addGroupMemberIds.value = [...addGroupMemberIds.value, groupId];
    }
  }
  function updatePage(amount:number, offset:number) {
    userState.dispatch('retrieveUsers', {amount, offset});
  }

</script>