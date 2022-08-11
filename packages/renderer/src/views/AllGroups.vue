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
      <PaginatedTable 
        :contents="contents"
        id-identifier="id"
        :column-titles="['Title', 'Description', 'Operation']"
        :column-identifiers="['title', 'description', 'operation']"
        :total-retrievable-entities="totalGroupAmount()"
        @click="selectRow($event)"
        @update-page="updatePage($event.amount, $event.offset)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup> 
    import { computed } from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import PaginatedTable from '../components/BasicComponents/PaginatedTable.vue';
    import { useGroupState, useOperationsState } from '../store';
    import {useRouter} from 'vue-router';

    //onMounted(async () => {
    //  await groupState.dispatch('retrieveGroups', {amount: paginationAmount, offset: paginationPage.value * paginationAmount,});
    //  groupPage.value().map((group) => operationsState.dispatch('retrieveOperation', group.operation ));
    //});

    //const paginationAmount = 5;
    //const paginationPage = ref(0);
    const groupState = useGroupState();
    const operationsState = useOperationsState();
    const groupPage = computed(() => groupState.getters.page);
    const contents = computed(() => {
      return [...groupPage.value()].map((elem) => {
        const group = {...elem};
        group.operation = operations.value().filter((elem) => elem.id === group.operation)[0]?.title;
        return group;
      });
    });
    const totalGroupAmount = computed(() => groupState.getters.total);
    const operations = computed(() => operationsState.getters.operations);
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