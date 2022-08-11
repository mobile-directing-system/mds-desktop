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
        :contents="contents"
        id-identifier="id"
        @click="selectRow($event)"
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

        <template #tableRow="{rowEntity}:{rowEntity: Group}">
          <TableRow 
            :entity="rowEntity"
            :num-of-cols="3"
            :identifier="rowEntity.id"
            @click="selectRow($event)"
          >
            <template #data1="{entity}:{entity:Group}">
              {{ entity.title }}
            </template>
            <template #data2="{entity}:{entity:Group}">
              {{ entity.description }}
            </template>
            <template #data3="{entity}:{entity:Group}">
              {{ entity.operation }}
            </template>
          </TableRow>
        </template>
      </TableContainer>
      <PaginationBar
        :total-retrievable-entities="totalGroupAmount()"
        :initial-page="paginationPage"
        @update-page="updatePage($event.amount, $event.offset)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup> 
    import { computed, onMounted, ref } from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import PaginationBar from '../components/BasicComponents/PaginationBar.vue';
    import TableContainer from '../components/BasicComponents/TableContainer.vue';
    import TableRow from '../components/BasicComponents/TableRow.vue';
    import TableHeader from '../components/BasicComponents/TableHeader.vue';
    import { useGroupState, useOperationsState } from '../store';
    import {useRouter} from 'vue-router';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    import type { Group } from '../../../types';

    onMounted(async () => {
      await groupState.dispatch('retrieveGroups', {amount: paginationAmount, offset: paginationPage.value * paginationAmount});
      groupPage.value().map((group) => operationsState.dispatch('retrieveOperation', group.operation ));
    });

    const paginationAmount = 5;
    const paginationPage = ref(0);
    const groupState = useGroupState();
    const operationsState = useOperationsState();
    const groupPage = computed(() => groupState.getters.page);
    const operations = computed(() => operationsState.getters.operations);
    const contents = computed(() => {
      return [...groupPage.value()].map((elem) => {
        const group = {...elem};
        group.operation = operations.value().filter((elem) => elem.id === group.operation)[0]?.title;
        return group;
      });
    });
    const totalGroupAmount = computed(() => groupState.getters.total);
    const router = useRouter();
    function selectRow(groupId: string){
            router.push({name: 'EditCurrentGroup', params:{ selectedGroupID: groupId}});
    }
    async function updatePage(amount: number, offset: number) {
      await groupState.dispatch('retrieveGroups', {amount, offset});
      groupPage.value().map((group) => operationsState.dispatch('retrieveOperation', group.operation ));
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