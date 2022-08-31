<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class=" ml-4 text-4xl font-bold text-black ">
          Addressbook Entries:
        </h1>
        <NormalButton
          class=" ml-auto mr-6"
          @click.prevent="router.push('/create-new-addressbookentry')"
        >
          +
        </NormalButton>
      </div>
      <TableContainer
        :contents="addressbookEntryPage().values()"
        id-identifier="id"
      >
        <template #tableHeader>
          <TableHeader :num-of-cols="6">
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
            <template #header6 />
          </TableHeader>
        </template>

        <template #tableRow="{rowData}:{rowData:AddressbookEntry}">
          <TableRow 
            :row-data="rowData"
            :num-of-cols="6"
            :identifier="rowData.id"
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
                @click.prevent="selectRow(data.id)"
              >
                <span class="sr-only">Edit</span>
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                /><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                /></svg>
              </button>
            </template>
            <template #data6="{data}:{data:AddressbookEntry}">
              <button
                type="button"
                class="bg-background text-on_background hover:bg-surface_dark hover:text-on_surface_dark rounded-lg focus:ring-2 focus:ring-surface p-1.5 inline-flex h-8 w-8 "
                @click.prevent="deleteEntry(data.id)"
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
    import {useAddressbookState, useUserState, useOperationsState} from '../store';
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
    const userState = useUserState();
    const operationsState = useOperationsState();
    const users = computed(() => userState.getters.users);
    const operations = computed(() => operationsState.getters.operations);
  
    async function updatePage(amount: number, offset: number) {
        await addressbookState.dispatch('retrieveEntries', {amount, offset});
    }
    function selectRow(entryId: string){
          router.push({name: 'EditCurrentAddressbookEntry', params:{ addressbookEntryID: entryId}});
    }
    function getUserName(id: string | undefined):string{
      if(id && id != ''){
        const currentUser = users.value().get(id);
        if(currentUser){
          return currentUser.first_name + ' ' +  currentUser.last_name;
        }
      }
      return '';
    }
    function getOperationName(id: string | undefined):string{
      if(id && id != ''){
        const currentOperation = operations.value().get(id);
        if(currentOperation){
          return currentOperation.title;
        }
      }
      return '';
    }
    function deleteEntry(id: string | undefined){
      if(id && id != ''){
        addressbookState.dispatch('deleteEntryById', id);
        updatePage(paginationAmount, paginationAmount *paginationPage.value);
      }
    }
</script>

