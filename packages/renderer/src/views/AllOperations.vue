<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class="ml-4 text-4xl font-bold text-black text-center">
          All Operations
        </h1>
        <NormalButton
          class=" ml-auto  mr-6"
          @click="router.push('/create-new-operation')"
        >
          +
        </NormalButton>
      </div>
    </div>
    <TableContainer
      :contents="groupPage().values()"
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
            {{ data.start }}
          </template>
          <template #data4="{data}:{data:Operation}">
            {{ data.end }}
          </template>
        </TableRow>
      </template>
    </TableContainer>
    <PaginationBar
      :total-retrievable-entities="totalOperationAmount()"
      :page-size="5"
      @update-page="updatePage($event.amount, $event.offset)"
    />
  </div>
</template>

<script lang="ts" setup> 
  import { computed } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import PaginationBar from '../components/BasicComponents/PaginationBar.vue';
  import TableContainer from '../components/BasicComponents/TableContainer.vue';
  import TableRow from '../components/BasicComponents/TableRow.vue';
  import TableHeader from '../components/BasicComponents/TableHeader.vue';
  import {useOperationsState } from '../store';
  import {useRouter} from 'vue-router';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { Operation } from '../../../types';

  const operationsState = useOperationsState();
  const groupPage = computed(() => operationsState.getters.page);
  const totalOperationAmount = computed(() => operationsState.getters.total);
  const router = useRouter();
  function selectRow(groupId: string){
          router.push({name: 'EditCurrentGroup', params:{ selectedGroupID: groupId}});
  }
  async function updatePage(amount: number, offset: number) {
    await operationsState.dispatch('retrieveOperations', {amount, offset});
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
  ::-webkit-scrollbar {
    display: none;
  }
</style>
