<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class=" ml-4 text-4xl font-bold text-black ">
          Addressbook Entries
        </h1>
        <div class="flex h-12 mt-3">
          <!-- Addressbook Search Input -->
          <FormInput
            v-if="showSearch"
            id="prio"
            v-model="searchInput"
            div-class=" ml-auto w-50 mr-3"
            label=""
          />
          <!-- Addressbook Search Button -->
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
          <!-- Add Addressbook Button -->
          <NormalButton
            class=" ml-auto mr-6"
            @click.prevent="router.push('/create-new-addressbookentry')"
          >
            +
          </NormalButton>
        </div>
      </div>
      <!-- Addressbook Searchresults Table -->
      <TableContainer
        v-if="searchInput != ''"
        :contents="entriesSearchResultsArray"
        id-identifier="id"
      >
        <template #tableHeader>
          <TableHeader :num-of-cols="5">
            <template #header1>
              Label
            </template>
            <template #header2>
              Description
            </template>
            <template #header3>
              User
            </template>
            <template #header4>
              Operation
            </template>
            <template #header5 />
          </TableHeader>
        </template>

        <template #tableRow="{rowData}:{rowData:AddressbookEntry}">
          <TableRow 
            :row-data="rowData"
            :num-of-cols="5"
            :identifier="rowData.id"
            @click="selectRow($event)"
          >
            <template #data1="{data}:{data:AddressbookEntry}">
              {{ data.label }}
            </template>
            <template #data2="{data}:{data:AddressbookEntry}">
              {{ data.description }}
            </template>  
            <template #data3="{data}:{data:AddressbookEntry}">
              {{ getUserName(data.user) }}
            </template>
            <template #data4="{data}:{data:AddressbookEntry}">
              {{ getOperationName(data.operation) }}
            </template>
            <template #data5="{data}:{data:AddressbookEntry}">
              <button
                type="button"
                class="bg-background text-on_background hover:bg-surface_dark hover:text-on_surface_dark rounded-lg focus:ring-2 focus:ring-surface p-1.5 inline-flex h-8 w-8 "
                @click.stop="deleteEntry(data.id)"
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
      <!-- Addressbook Paginated Table -->
      <TableContainer
        v-if="searchInput === ''"
        :contents="addressbookEntryPage().values()"
        id-identifier="id"
      >
        <template #tableHeader>
          <TableHeader :num-of-cols="5">
            <template #header1>
              Label
            </template>
            <template #header2>
              Description
            </template>
            <template #header3>
              User
            </template>
            <template #header4>
              Operation
            </template>
            <template #header5 />
          </TableHeader>
        </template>

        <template #tableRow="{rowData}:{rowData:AddressbookEntry}">
          <TableRow 
            :row-data="rowData"
            :num-of-cols="5"
            :identifier="rowData.id"
            @click="selectRow($event)"
          >
            <template #data1="{data}:{data:AddressbookEntry}">
              {{ data.label }}
            </template>
            <template #data2="{data}:{data:AddressbookEntry}">
              {{ data.description }}
            </template>  
            <template #data3="{data}:{data:AddressbookEntry}">
              {{ getUserName(data.user) }}
            </template>
            <template #data4="{data}:{data:AddressbookEntry}">
              {{ getOperationName(data.operation) }}
            </template>
            <template #data5="{data}:{data:AddressbookEntry}">
              <button
                type="button"
                class="bg-background text-on_background hover:bg-surface_dark hover:text-on_surface_dark rounded-lg focus:ring-2 focus:ring-surface p-1.5 inline-flex h-8 w-8 "
                @click.stop="deleteEntry(data.id)"
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
      <!-- Addressbook Table Pagination Bar -->
      <PaginationBar
        v-if="searchInput === ''"
        id="adressbook-table-pagination"
        :total-retrievable-entities="totalAddressbookEntryAmount()"
        :page-size="paginationAmount"
        @update-page="updatePage($event.amount, $event.offset)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
    import { computed, onMounted, ref, watch } from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import PaginationBar from '../components/BasicComponents/PaginationBar.vue';
    import TableContainer from '../components/BasicComponents/TableContainer.vue';
    import TableRow from '../components/BasicComponents/TableRow.vue';
    import TableHeader from '../components/BasicComponents/TableHeader.vue';
    import {useAddressbookState, useUserState, useOperationsState} from '../store';
    import {useRouter} from 'vue-router';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    import type { AddressbookEntry } from '../../../types';
    import FormInput from '../components/BasicComponents/FormInput.vue';
   
    // load the first page of addressbook entries on mount
    onMounted(async () => {
        await addressbookState.dispatch('retrieveEntries', {amount: paginationAmount, offset: paginationPage.value * paginationAmount});
    });
   
    const addressbookState = useAddressbookState();
    const paginationAmount = 5;
    const paginationPage = ref(0);
    const addressbookEntryPage = computed(() => addressbookState.getters.page);
    const totalAddressbookEntryAmount = computed(() => addressbookState.getters.total);
    const router = useRouter();
    const userState = useUserState();
    const operationsState = useOperationsState();
    const users = computed(() => userState.getters.users);
    const operations = computed(() => operationsState.getters.operations);
    const showSearch = ref(false);
    const searchInput = ref('');

    // handler for search input to trigger calling of the search endpoints
    watch(searchInput, (curVal) => {
    if(curVal) {
      handleEntrySelectionInput(curVal);
    }
    });
    const entriesSearchResults = computed(() => addressbookState.getters.searchResults);
    const entriesSearchResultsArray = computed(() => {
        return InterableIteratorToArray(entriesSearchResults.value().values());
    });

    /**
     * function to call the addressbook entry search endpoint
     * @param query to pass to the search endpoint
     */
    function handleEntrySelectionInput(query: string) {
      addressbookState.dispatch('searchEntryByQuery', {query, limit:5});
    }

    /**
     * function to convert IterableIterators to arrays to be used with e.g. searchable select component
     * @param iter IterableIterator to be converted to an array
     * @returns array with the same elements as the IterableIterator
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
    
      /**
       * function to update the page when the pagination bar buttons are clicked
       * @param amount of entries per page
       * @param offset at which to start retrieving entries
       */
      async function updatePage(amount: number, offset: number) {
          await addressbookState.dispatch('retrieveEntries', {amount, offset});
      }

      /**
       * function to route to the edit page for a selected addressbook entry
       * @param entryId of the entry for which to route to the edit page
       */
      function selectRow(entryId: string){
            router.push({name: 'EditCurrentAddressbookEntry', params:{ addressbookEntryID: entryId}});
      }

      /**
       * function to get a formated name of a user
       * @param id of the user for which to get a formatted name
       */
      function getUserName(id: string | undefined):string{
        if(id && id != ''){
          const currentUser = users.value().get(id);
          if(currentUser){
            // if the user exists create and return the formatted name
            return currentUser.first_name + ' ' +  currentUser.last_name;
          }
        }
        return '';
      }

      /**
       * function to get the title of an operation
       * @param id of the operation for which to get the title
       */
      function getOperationName(id: string | undefined):string{
        if(id && id != ''){
          const currentOperation = operations.value().get(id);
          if(currentOperation){
            // if the operation exists return its title
            return currentOperation.title;
          }
        }
        return '';
      }

      /**
       * function to delete an entry and update the page
       * @param id of the entry to be deleted
       */
      function deleteEntry(id: string | undefined){
        if(id && id != ''){
          // delete entry
          addressbookState.dispatch('deleteEntryById', id);
          // delete all entries in the addressbook state
          addressbookEntryPage.value().clear();
          // update the page
          updatePage(paginationAmount, paginationAmount *paginationPage.value);
        }
      }
</script>

