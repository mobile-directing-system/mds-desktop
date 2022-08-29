<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class=" ml-4 text-4xl font-bold text-black ">
          Addressbook Entries:
        </h1>
        <NormalButton
          class=" ml-auto mr-6"
          @click.prevent="router.push('/create-new-user')"
        >
          +
        </NormalButton>
      </div>
      <TableContainer
        :contents="addressbookEntryPage().values()"
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

        <template #tableRow="{rowData}:{rowData:AddressbookEntry}">
          <TableRow 
            :row-data="rowData"
            :num-of-cols="3"
            :identifier="rowData.id"
            @click="selectRow($event)"
          >
            <template #data1="{data}:{data:AddressbookEntry}">
              {{ data.label }}
            </template>
            <template #data2="{data}:{data:AddressbookEntry}">
              {{ data.description }}
            </template>            
          </TableRow>
        </template>
      </TableContainer>
      <PaginationBar
        :total-retrievable-entities="totalAddressbookEntryAmount()"
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
    import {useAddressbookState } from '../store';
    import {useRouter} from 'vue-router';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    import type { AddressbookEntry } from '../../../types';

    onMounted(async () => {
        await addressbookState.dispatch('retrieveEntries', {amount: paginationAmount, offset: paginationPage.value * paginationAmount});
    });

    const addressbookState = useAddressbookState();
    const paginationAmount = 5;
    const paginationPage = ref(0);
    const addressbookEntryPage = computed(() => addressbookState.getters.page);
    const totalAddressbookEntryAmount = computed(() => addressbookState.getters.total);
    const router = useRouter();

    async function updatePage(amount: number, offset: number) {
        await addressbookState.dispatch('retrieveEntries', {amount, offset});
    }
    function selectRow(groupId: string){
          router.push({name: 'EditCurrentGroup', params:{ selectedGroupID: groupId}});
    }
</script>

