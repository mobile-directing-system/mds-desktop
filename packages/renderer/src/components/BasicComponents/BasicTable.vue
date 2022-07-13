<template>
  <div class="grid bg-white mx-auto max-w-4xl rounded-lg  my-10">
    <div class="flex justify-between">
      <h1 class=" ml-96 text-4xl font-bold text-black text-center">
        All Users
      </h1>
      <NormalButton
        class=" ml-auto "
        :btn-text="'+'"
        @btn-click="showAddUser()"
      />
    </div>
    <div class=" table-fixed place-items-center mr-4">
      <table class=" border-spacing-2 w-full rounded-md overflow-hidden m-4">
        <thead class=" bg-blue-700 font-bold text-white text-l text-left text-lg">
          <tr>
            <th>Index</th>
            <th>User Name</th>
            <th>Firstname</th>
            <th>Lastname</th>
          </tr>
        </thead> 
        <tbody class="text-left">     
          <tr
            v-for="(user,i) in users()" 
            :key="i"
            class=" "
            :class="[i===selectedUserIndex ? ' border-b-2 border-b-white rounded-lg bg-blue-700 text-white' : 'border-b-2 border-b-gray-500 bg-white text-black']"
            @click="selectRow(i, user.id)"
          >      
            <td>{{ i + 1 }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.first_name }}</td>
            <td>{{ user.last_name }}</td>
          </tr> 
        </tbody>
      </table>
              
      <div
        class="place-items-center mt-6"
      >
        <h3
          v-if="selectedUserUsername != ''"
          class="text-center font-bold text-2xl"
        >
          Options
        </h3>
        <p
          v-if="selectedUserUsername != ''"
          class="p-4 text-center"
        >
          Selected User: {{ selectedUserUsername }}
        </p>
        <div
          v-if="selectedUserUsername != ''"
          class=" justify-center flex space-x-14 pt-4 text-2xl"
        >
          <NormalButton
            :btn-text="'Delete User'"
            @btn-click="deleteUser()"
          />
          <NormalButton
            :btn-text="'Edit User'"
            @btn-click="showEditUser()"
          />
        </div>
        <div class="flex justify-between">
          <NormalButton
            class="mt-4 ml-auto"
            :btn-text="'Cancel'"
            @btn-click="backToMain()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup> 
    import { ref, computed } from 'vue';
    import NormalButton from './NormalButton.vue';
    import { useUserState } from '../../store';
import router from '/@/router';

    const userState = useUserState();
    const users = computed(() => userState.getters.users);
    const selectedUserIndex = ref(-1);
    const selectedUserID = ref('');
    const selectedUserUsername = ref('');


    function selectRow(i: number, user_id: string){
            selectedUserIndex.value = i;
            selectedUserID.value = user_id;
            const selectedUser = users.value().filter((elem) => elem.id === selectedUserID.value)[0];
            selectedUserUsername.value = selectedUser.username;
    }

    function deleteUser(){
        userState.dispatch('deleteUserById', selectedUserID.value);
        selectedUserUsername.value = '';
    }

    function showEditUser(){
      router.push('user/');
    }
    function backToMain(){
      router.push('user/');
    }
    function showAddUser(){
      router.push('user/');
    }
</script>
