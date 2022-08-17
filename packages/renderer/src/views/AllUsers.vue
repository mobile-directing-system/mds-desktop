<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class=" ml-4 text-4xl font-bold text-black ">
          All Users
        </h1>
        <NormalButton
          class=" ml-auto mr-6"
          @click.prevent="router.push('/create-new-user')"
        >
          +
        </NormalButton>
      </div>
      <div class=" table-fixed place-items-center mr-10">
        <table class=" border-spacing-2 w-full rounded-md overflow-hidden m-4">
          <thead class=" bg-blue-700 font-bold text-white text-l text-left text-lg">
            <tr class="p-2">
              <th class="p-2">
                User Name
              </th>
              <th class="p-2">
                Firstname
              </th>
              <th class="p-2">
                Lastname
              </th>
            </tr>
          </thead> 
          <tbody class="text-left">     
            <tr
              v-for="(user,i) in users()" 
              :key="i"
              class="p-2 border-b-2 border-b-gray-500 bg-white text-black hover:bg-primary_superlight hover:text-white cursor-pointer"
            
              @click="selectRow(i, user.id)"
            >      
              <td class="p-2">
                {{ user.username }}
              </td>
              <td class="p-2">
                {{ user.first_name }}
              </td>
              <td class="p-2">
                {{ user.last_name }}
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup> 
  import { ref, computed } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import { useUserState } from '../store';
  import {useRouter} from 'vue-router';

  const userState = useUserState();
  const users = computed(() => userState.getters.users);
  const selectedUserIndex = ref(-1);
  const selectedUserID = ref('');
  const selectedUserUsername = ref('');
  const router = useRouter();

  function selectRow(i: number, user_id: string){
    selectedUserIndex.value = i;
    selectedUserID.value = user_id;
    const selectedUser = users.value().filter((elem) => elem.id === selectedUserID.value)[0];
    selectedUserUsername.value = selectedUser.username;
    router.push({ name: 'EditCurrentUser', params: { selectedUserID: user_id } });
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
