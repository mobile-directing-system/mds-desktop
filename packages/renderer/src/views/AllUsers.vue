<template>
  <div id="all-users">
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <!-- Header -->
        <h1 class=" ml-4 text-4xl font-bold text-black ">
          All Users
        </h1>
        <!-- Add User Button -->
        <NormalButton
          id="open-create-user-button"
          :disabled="!checkPermissions([{name: PermissionNames.UserCreate}])"
          class=" ml-auto mr-6"
          @click.prevent="router.push('/create-new-user')"
        >
          +
        </NormalButton>
      </div>
      <!-- All Users Table -->
      <TableContainer
        id="users-table"
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
      <!-- Pagination Bar -->
      <PaginationBar
        id="users-table-pagination"
        :total-retrievable-entities="totalUserAmount()"
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
  import { useUserState } from '../store';
  import {useRouter} from 'vue-router';
  import { usePermissions } from '../composables';
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { User }  from '../../../types';
  import { PermissionNames, OrderBy, OrderDir } from '../constants';

  const userState = useUserState();
  const userPage = computed(() => userState.getters.page);
  const totalUserAmount = computed(() => userState.getters.total);
  const router = useRouter();
  const checkPermissions = usePermissions();

  /**
   * update page handler for pagination bar
   * @param amount number of users to be retrieved
   * @param offset offset beginning at which users are retrieved
   */
  async function updatePage(amount: number, offset: number) {
    await userState.dispatch('retrieveUsers', {amount, offset, orderBy: OrderBy.UserUsername, orderDir: OrderDir.Ascending});
  }

  /**
   * click handler for the table row which route to user views
   * @param userId id of user to route to
   */
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
