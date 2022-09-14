<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class=" ml-4 text-4xl font-bold text-black ">
          All Users
        </h1>
        <div class="flex h-12 mt-3">
          <FormInput
            v-if="showSearch"
            id="prio"
            v-model="searchInput"
            div-class=" ml-auto w-50 mr-3"
            label=""
          />
          <NormalButton
            class=" ml-auto mr-6"
            @click.prevent="showSearch=!showSearch; searchInput =''"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            /></svg>
          </NormalButton>
          <NormalButton
            class=" ml-auto mr-6"
            @click.prevent="router.push('/create-new-user')"
          >
            +
          </NormalButton>
        </div>
      </div>
      <TableContainer
        v-if="searchInput === ''"
        :contents="userPage().values()"
        id-identifier="id"
      >
        <template #tableHeader>
          <TableHeader :num-of-cols="3">
            <template #header1>
              Username
            </template>
            <template #header2>
              First name
            </template>
            <template #header3>
              Last name
            </template>
          </TableHeader>
        </template>

        <template #tableRow="{rowData}:{rowData:User}">
          <TableRow 
            :row-data="rowData"
            :num-of-cols="3"
            :identifier="rowData.id"
            @click="selectRow($event)"
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

      <TableContainer
        v-if="searchInput != ''"
        :contents="usersSearchResultsArray"
        id-identifier="id"
      >
        <template #tableHeader>
          <TableHeader :num-of-cols="3">
            <template #header1>
              Username
            </template>
            <template #header2>
              First name
            </template>
            <template #header3>
              Last name
            </template>
          </TableHeader>
        </template>

        <template #tableRow="{rowData}:{rowData:User}">
          <TableRow 
            :row-data="rowData"
            :num-of-cols="3"
            :identifier="rowData.id"
            @click="selectRow($event)"
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
        v-if="searchInput === ''"
        :total-retrievable-entities="totalUserAmount()"
        :page-size="5"
        @update-page="updatePage($event.amount, $event.offset)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup> 
  import { computed, ref, watch} from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import PaginationBar from '../components/BasicComponents/PaginationBar.vue';
  import TableContainer from '../components/BasicComponents/TableContainer.vue';
  import TableRow from '../components/BasicComponents/TableRow.vue';
  import TableHeader from '../components/BasicComponents/TableHeader.vue';
  import { useUserState } from '../store';
  import {useRouter} from 'vue-router';
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { User }  from '../../../types';
  import FormInput from '../components/BasicComponents/FormInput.vue';

  const userState = useUserState();
  const userPage = computed(() => userState.getters.page);
  const totalUserAmount = computed(() => userState.getters.total);
  const router = useRouter();
  const showSearch = ref(false);
  const searchInput = ref('');

  watch(searchInput, (curVal) => {
    if(curVal) {
      handleUserSelectionInput(curVal);
    }
  });
  const usersSearchResults = computed(() => userState.getters.searchResults);
  const usersSearchResultsArray = computed(() => {
      return InterableIteratorToArray(usersSearchResults.value().values());
  });

  function handleUserSelectionInput(query: string) {
    userState.dispatch('searchUsersByQuery', {query, limit:5});
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
  async function updatePage(amount: number, offset: number) {
    await userState.dispatch('retrieveUsers', {amount, offset});
  }
  function selectRow(userId: string){
          router.push({name: 'EditCurrentUser', params:{ selectedUserID: userId}});
  }
</script>
<style>
  .bottomPartwithSidebar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--1);
  }
  .bottomPartwithSidebar > :first-child{
    flex-basis: 1;
  }
  .bottomPartwithSidebar > :last-child{
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: 75%;
  }
</style>
