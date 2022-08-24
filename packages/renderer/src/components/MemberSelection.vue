<template>
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
    :contents="updatedMemberIds"
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
            @click.prevent="updatedMemberIds = updatedMemberIds.filter((elem) => elem !== data)"
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
  <!--Add Members Modal-->
  <FloatingModal
    :show-modal="showMembersModal"
    title="Select a User"
    @click="toggleMembersModal()"
  >
    <div class="mb-6 w-96 max-w-sm">
      <SearchableSelect
        v-model="addMemberIds"
        :options="[...usersSearchResultsArray, ...addMemberIds.map((elem) => users().get(elem))]"
        mode="tags"
        placeholder="Select group members"
        label="username"
        value-prop="id"
        track-by="username"
        @search-change="handleSelectionInput"
        @open="handleSelectionInput('')"
      />
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
            :class="addMemberIds.includes(rowData.id)? 'bg-primary_superlight' : ''"
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
</template>
<script lang="ts" setup>
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import TableContainer from '../components/BasicComponents/TableContainer.vue';
  import TableRow from '../components/BasicComponents/TableRow.vue';
  import TableHeader from '../components/BasicComponents/TableHeader.vue';
  import FloatingModal from '../components/BasicComponents/FloatingModal.vue';
  import PaginationBar from '../components/BasicComponents/PaginationBar.vue';
  import SearchableSelect from '../components/BasicComponents/SearchableSelect.vue';

  import { ref, computed, watch } from 'vue';
  import { useUserState } from '../store';
  import type { Ref } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { User } from '../../../types';

  interface Props {
    modelValue: string[];
  }

  const userState = useUserState();

  const users = computed(() => userState.getters.users);
  const usersPage = computed(() => userState.getters.page);
  const totalUserAmount = computed(() => userState.getters.total);
  const usersSearchResults = computed(() => userState.getters.searchResults);
  const usersSearchResultsArray = computed(() => {
    return InterableIteratorToArray(usersSearchResults.value().values());
  });

  const showMembersModal = ref(false);
  const addMemberIds: Ref<string[]> = ref([]);
  const updatedMemberIds : Ref<string[]> = ref([]);

  const props = defineProps<Props>();

  updatedMemberIds.value = [... props.modelValue];

  const emit = defineEmits<{
    (e:'update:modelValue', memberIds: string[]):void
  }>();

  watch(updatedMemberIds, (curVal) => {
    emit('update:modelValue', curVal);
  });

  function toggleMembersModal() {
    showMembersModal.value = !showMembersModal.value;
    addMemberIds.value = [];
  }

  function toggleId(groupId: string) {
    if(addMemberIds.value.includes(groupId)) {
      addMemberIds.value = addMemberIds.value.filter((elem) => elem !== groupId );
    } else {
      addMemberIds.value = [...addMemberIds.value, groupId];
    }
  }

  function handleSelectionInput(query: string) {
    userState.dispatch('searchUsersByQuery', {query, limit:10});
  }
  
  function addMembers(){
    updatedMemberIds.value = [...updatedMemberIds.value, ...addMemberIds.value];
    toggleMembersModal();
  }

  function updatePage(amount:number, offset:number) {
    userState.dispatch('retrieveUsers', {amount, offset});
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