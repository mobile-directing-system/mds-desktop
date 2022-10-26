<template>
  <div id="all-operations">
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <!-- Header -->
        <h1 class="ml-4 text-4xl font-bold text-black text-center">
          All Operations
        </h1>
        <div class="flex h-12 mt-3">
          <!-- Search Input -->
          <FormInput
            v-if="showSearch"
            id="prio"
            v-model="searchInput"
            div-class=" ml-auto w-50 mr-3"
            label=""
          />
          <!-- Search Button -->
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
          <!-- Create Operation Button -->
          <NormalButton
            id="open-create-operation-button"
            :disabled="!checkPermissions([{name: PermissionNames.OperationCreate}])"
            class=" ml-auto  mr-6"
            @click="router.push('/create-new-operation')"
          >
            +
          </NormalButton>
        </div>
      </div>
    <!-- All Operations Table -->
    </div>
    <TableContainer
      v-if="searchInput === ''"
      id="operations-table"
      :contents="operationsPage().values()"
      id-identifier="id"
    >
      <template #tableHeader>
        <TableHeader :num-of-cols="4">
          <template #header1>
            Title
          </template>
          <template #header2>
            Description
          </template>
          <template #header3>
            Start
          </template>
          <template #header4>
            End
          </template>
        </TableHeader>
      </template>

      <template #tableRow="{rowData}:{rowData:Operation}">
        <TableRow 
          :row-data="rowData"
          :num-of-cols="4"
          :identifier="rowData.id"
          @click="selectRow($event)"
        >
          <template #data1="{data}:{data:Operation}">
            {{ data.title }}
          </template>
          <template #data2="{data}:{data:Operation}">
            {{ data.description }}
          </template>
          <template #data3="{data}:{data:Operation}">
            {{ printDate(data.start) }}
          </template>
          <template #data4="{data}:{data:Operation}">
            {{ printDate(data.end) }}
          </template>
        </TableRow>
      </template>
    </TableContainer>
    <TableContainer
      v-if="searchInput != ''"
      :contents="operationsSearchResultsArray"
      id-identifier="id"
    >
      <template #tableHeader>
        <TableHeader :num-of-cols="4">
          <template #header1>
            Title
          </template>
          <template #header2>
            Description
          </template>
          <template #header3>
            Start
          </template>
          <template #header4>
            End
          </template>
        </TableHeader>
      </template>

      <template #tableRow="{rowData}:{rowData:Operation}">
        <TableRow 
          :row-data="rowData"
          :num-of-cols="4"
          :identifier="rowData.id"
          @click="selectRow($event)"
        >
          <template #data1="{data}:{data:Operation}">
            {{ data.title }}
          </template>
          <template #data2="{data}:{data:Operation}">
            {{ data.description }}
          </template>
          <template #data3="{data}:{data:Operation}">
            {{ printDate(data.start) }}
          </template>
          <template #data4="{data}:{data:Operation}">
            {{ printDate(data.end) }}
          </template>
        </TableRow>
      </template>
    </TableContainer>
    <!-- Pagination Bar -->
    <PaginationBar
      v-if="searchInput === ''"
      id="operations-table-pagination"
      :total-retrievable-entities="totalOperationAmount()"
      :page-size="5"
      @update-page="updatePage($event.amount, $event.offset)"
    />
  </div>
</template>

<script lang="ts" setup> 
  import { computed, ref, watch } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import PaginationBar from '../components/BasicComponents/PaginationBar.vue';
  import TableContainer from '../components/BasicComponents/TableContainer.vue';
  import TableRow from '../components/BasicComponents/TableRow.vue';
  import TableHeader from '../components/BasicComponents/TableHeader.vue';
  import {useOperationsState } from '../store';
  import {useRouter} from 'vue-router';
  import { usePermissions } from '../composables';
  import { OrderBy, OrderDir, PermissionNames } from '../constants';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { Operation } from '../../../types';
  
  import FormInput from '../components/BasicComponents/FormInput.vue';

  const checkPermissions = usePermissions();
  const operationsState = useOperationsState();
  const operationsPage = computed(() => operationsState.getters.page);
  const totalOperationAmount = computed(() => operationsState.getters.total);
  const router = useRouter();
  
  const showSearch = ref(false);
  const searchInput = ref('');
  /**
   * click handler for the table row which route to operation views
   * @param operationId id of operation to route to
   */
  function selectRow(operationID: string){
          router.push({name: 'EditCurrentOperation', params:{ selectedOperationID: operationID}});
  }

  /**
   * update page handler for pagination bar
   * @param amount number of operations to be retrieved
   * @param offset offset beginning at which operations are retrieved
   */
  async function updatePage(amount: number, offset: number) {
    await operationsState.dispatch('retrieveOperations', {amount, offset, orderBy: OrderBy.OperationStartTime, orderDir: OrderDir.Descending});
  }
  watch(searchInput, (curVal) => {
    if(curVal) {
      handleUserSelectionInput(curVal);
    }
  });
  const operationSearchResults = computed(() => operationsState.getters.searchResults);
  const operationsSearchResultsArray = computed(() => {
      return InterableIteratorToArray(operationSearchResults.value().values());
  });
  function handleUserSelectionInput(query: string) {
    operationsState.dispatch('searchOperationsByQuery', {query, limit:5});
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
  function printDate(date?: Date): string {
    if(!date) {
      return '';
    }
    const year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
    const month = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date);
    const day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
    const hour = new Intl.DateTimeFormat('en', {hour12: false, hour: '2-digit'}).format(date);
    let minute = new Intl.DateTimeFormat('en', {minute: '2-digit'}).format(date);
    if(minute.length === 1) {
      minute = `0${minute}`;
    }
    return `${day}.${month}.${year} ${hour}:${minute}`;
  }
</script>
<style scoped>
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
