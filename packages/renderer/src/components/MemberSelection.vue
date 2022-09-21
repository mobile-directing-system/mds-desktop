<template>
  <div class="flex justify-between">
    <label class="block text-sm font-medium text-on_background">Group Members</label>
    <!-- Add Members Button -->
    <NormalButton
      :id="`${props.id}-add-members-button`"
      :disabled="props.disableAddMembers? props.disableAddMembers : false"
      :aria-disabled="props.disableAddMembers? 'true':'false'"
      @click.prevent="toggleMembersModal()"
    >
      +
    </NormalButton>
  </div>
  <!-- Members Table -->
  <TableContainer
    :id="`${props.id}`"
    class="-ml-4"
    :contents="props.modelValue"
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
        :class="( include && !includeIds?.includes(rowData))? 'bg-error_superlight' : 'hover:bg-background cursor-auto'"
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
          <!-- Remove Member Button -->
          <button
            v-if="!props.disableAddMembers"
            type="button"
            class="bg-background text-on_background hover:bg-surface_dark hover:text-on_surface_dark rounded-lg focus:ring-2 focus:ring-surface p-1.5 inline-flex h-8 w-8 "
            @click.prevent="deleteMember(data)"
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
      <!-- Searchable Select for Members -->
      <SearchableSelect
        v-model="addMemberIds"
        :options="options"
        mode="tags"
        :filter-results="false"
        placeholder="Select group members"
        :label="'username'"
        :value-prop="'id'"
        :track-by="'username'"
        @search-change="handleSelectionInput"
        @open="handleSelectionInput('')"
      />
      <!-- Available Members Table -->
      <TableContainer
        :contents="usersPageArray"
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
      <!-- Pagination Buttons -->
      <PaginationBar
        id="select-member-table-pagination"
        :total-retrievable-entities="totalUserAmount()"
        :page-size="5"
        @update-page="updatePage($event.amount, $event.offset)"
      />
    </div>
    <div class="flex justify-between">
      <!-- Add Members Button -->
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

  /**
   * This component provides a table of users, a.k.a. members, with a button for adding members.
   * This button opens a modal for adding user, including a table view of available users and a
   * searchable select. Passed attributes, which are not props, to this component won't work.
   */

  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import TableContainer from '../components/BasicComponents/TableContainer.vue';
  import TableRow from '../components/BasicComponents/TableRow.vue';
  import TableHeader from '../components/BasicComponents/TableHeader.vue';
  import FloatingModal from '../components/BasicComponents/FloatingModal.vue';
  import PaginationBar from '../components/BasicComponents/PaginationBar.vue';
  import SearchableSelect from '../components/BasicComponents/SearchableSelect.vue';

  import { ref, computed } from 'vue';
  import { useUserState } from '../store';
  import { union } from 'lodash';
  import type { Ref } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { User } from '../../../types';

  interface Props {
    modelValue: string[];   // v-model repsentation
    includeIds?: string[];  // array of selectable user ids
    include?: boolean;      // if set the includeIds array is processed
    disableAddMembers?: boolean; //disable the add members button if set to true
    id?: string; //id to make element id's of this component unique
  }

  const userState = useUserState();

  const users = computed(() => userState.getters.users);
  const usersPage = computed(() => userState.getters.page);
  const totalUserAmount = computed(() => userState.getters.total);
  const usersSearchResults = computed(() => userState.getters.searchResults);
  const usersSearchResultsArray = computed(() => {
    return IterableIteratorToArray(usersSearchResults.value().values());
  });
  const usersPageArray = computed(() => {
    // change user iterables to arrays for use with searchable select
    if(props.include) {
      return IterableIteratorToArray(usersPage.value().values()).filter((elem) => !props.modelValue.includes(elem?.id? elem?.id : '') && props.includeIds?.includes(elem?.id? elem?.id : ''));
    } else {
      return IterableIteratorToArray(usersPage.value().values()).filter((elem) => !props.modelValue.includes(elem?.id? elem?.id : ''));
    }
  });

  const showMembersModal = ref(false);
  const addMemberIds: Ref<string[]> = ref([]);
  const arr: Ref<string[]> = ref([]);
  const options: Ref<(User | undefined)[]> = computed(() => {
    if(props.include) {
      return union(usersSearchResultsArray.value, arr.value.map((elem) => users.value().get(elem)))?.filter((elem) => !props.modelValue.includes(elem?.id? elem?.id: '') && props.includeIds?.includes(elem?.id? elem.id : ''));
    } else {
      return union(usersSearchResultsArray.value, arr.value.map((elem) => users.value().get(elem)))?.filter((elem) => !props.modelValue.includes(elem?.id? elem?.id: ''));
    }
  });

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e:'update:modelValue', memberIds: string[]):void // Emitted upon clicking the Add Members button, updates the v-model
  }>();


  /**
   * function to toggle the add member modal
   */
  function toggleMembersModal() {
    showMembersModal.value = !showMembersModal.value;
    addMemberIds.value = [];
  }

  /**
   * function to toggle the add members status of a user
   * @param userId id for which user to toggle the add member status
   */
  function toggleId(userId: string) {
    if(addMemberIds.value.includes(userId)) {
      arr.value = arr.value.filter((elem) => elem !== userId );
      setTimeout(() => {
        addMemberIds.value = addMemberIds.value.filter((elem) => elem !== userId );
      }, 0);
    } else {
      arr.value = [...arr.value, userId];
      setTimeout(() => {
        addMemberIds.value = [...addMemberIds.value, userId];
      }, 0);
    }
  }

  /**
   * function to handle the search inputs returned by the searchable select
   * @param query search string
   */
  function handleSelectionInput(query: string) {
    userState.dispatch('searchUsersByQuery', {query, limit:10});
  }
  
  /**
   * function to emit the v-model update event if the add member button on the modal is clicked
   */
  function addMembers(){
    emit('update:modelValue', [...props.modelValue, ...addMemberIds.value]);
    toggleMembersModal();
  }

  /**
   * function to remove a member by emitting an v-model update if the delete member buttons are clicked
   * @param memberId id of the member to be removed as a member
   */
  function deleteMember(memberId: string) {
    emit('update:modelValue', props.modelValue.filter((elem) => elem !== memberId));
  }

  /**
   * handler for pagination bar
   * @param amount amount of users to retrieve
   * @param offset offset beginng at which users are retrieved
   */
  function updatePage(amount:number, offset:number) {
    userState.dispatch('retrieveUsers', {amount, offset});
  }

  /**
   * utility function to change an IterableIterator to an array. Needed for use with e.g. the SearchableSelect.
   * @param iter IterableIterator to convert into an array
   * @returns shallow copied array
   */
  function IterableIteratorToArray<T>(iter:IterableIterator<T>):T[] {
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