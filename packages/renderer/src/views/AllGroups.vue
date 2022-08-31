<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class=" ml-4 text-4xl font-bold text-black text-center">
          All Groups
        </h1>
        <NormalButton
          class=" ml-auto mr-6"
          @click.prevent="router.push('/create-new-group')"
        >
          +
        </NormalButton>
      </div>
      <TableContainer
        :contents="groupPage().values()"
        id-identifier="id"
      >
        <template #tableHeader>
          <TableHeader :num-of-cols="3">
            <template #header1>
              Title
            </template>
            <template #header2>
              Description
            </template>
            <template #header3>
              Operation
            </template>
          </TableHeader>
        </template>

        <template #tableRow="{rowData}:{rowData:Group}">
          <TableRow 
            :row-data="rowData"
            :num-of-cols="3"
            :identifier="rowData.id"
            @click="selectRow($event)"
          >
            <template #data1="{data}:{data:Group}">
              {{ data.title }}
            </template>
            <template #data2="{data}:{data:Group}">
              {{ data.description }}
            </template>
            <template #data3="{data}:{data:Group}">
              {{ operations().get(data.operation? data.operation : '')?.title }}
            </template>
          </TableRow>
        </template>
      </TableContainer>
      <PaginationBar
        :total-retrievable-entities="totalGroupAmount()"
        :page-size="5"
        @update-page="updatePage($event.amount, $event.offset)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup> 
  import { computed } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import PaginationBar from '../components/BasicComponents/PaginationBar.vue';
  import TableContainer from '../components/BasicComponents/TableContainer.vue';
  import TableRow from '../components/BasicComponents/TableRow.vue';
  import TableHeader from '../components/BasicComponents/TableHeader.vue';
  import { useGroupState, useOperationsState } from '../store';
  import {useRouter} from 'vue-router';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { Group } from '../../../types';

  const groupState = useGroupState();
  const operationsState = useOperationsState();
  const groupPage = computed(() => groupState.getters.page);
  const operations = computed(() => operationsState.getters.operations);
  const totalGroupAmount = computed(() => groupState.getters.total);
  const router = useRouter();
  function selectRow(groupId: string){
          router.push({name: 'EditCurrentGroup', params:{ selectedGroupID: groupId}});
  }
  async function updatePage(amount: number, offset: number) {
    await groupState.dispatch('retrieveGroups', {amount, offset});
    for(const group of groupPage.value().values()) {
      if(group.operation) {
        operationsState.dispatch('retrieveOperation', group.operation );
      }
    }
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