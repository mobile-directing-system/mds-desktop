<template>
  <div class="grid place-items-center bg-white mx-auto max-w-4xl p-8 rounded-lg shadow-2xl my-10">
    <h1 class="text-4xl font-bold text-black text-center">
      All Users
    </h1>
        
    <table class=" table-auto border-collapse w-full rounded-lg overflow-hidden shadow-md m-4">
      <thead class=" bg-blue-700 font-bold text-white text-l text-center text-lg">
        <tr>
          <th>Index</th>
          <th>User Name</th>
          <th>Firstname</th>
          <th>Lastname</th>
        </tr>
      </thead> 
      <tbody class="text-center">     
        <tr
          v-for="(user,i) in users()" 
          :key="i"
          class=" border-b-2 border-b-gray-300 "
          :class="[i===selectedUserIndex ? 'border-b-2 border-b-gray-300 bg-blue-700 text-white' : 'border-b-2 border-b-gray-300 bg-gray-100 text-black']"
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
      v-if="selectedUserIndex !== -1"
      class=" m-6"
    >
      <h3 class="text-center font-bold text-2xl">
        Options
      </h3>
      <p class="p-4 text-center">
        Selected User: {{ selectedUserUsername }}
      </p>
      <div class="flex space-x-14 pt-4 text-2xl">
        <NormalButton
          :btn-text="'Delete User'"
          @btn-click="deleteUser"
        />
        <NormalButton
          :btn-text="'Edit User'"
          @btn-click="editUser()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup> 
    import { ref, computed } from 'vue';
    import NormalButton from './NormalButton.vue';
    import { useUserState } from '../../store';

    const userState = useUserState();
    const users = computed(() => userState.getters.users);
    const selectedUserIndex = ref(-1);
    const selectedUserID = ref('');
    const selectedUserUsername = ref('');
    const editedUser = ref(true);    

    function selectRow(i: number, user_id: string){
            selectedUserIndex.value = i;
            selectedUserID.value = user_id;
            const selectedUser = users.value().filter((elem) => elem.id === user_id)[0];
            selectedUserUsername.value = selectedUser.username;
    }

    function deleteUser(){
        userState.dispatch('deleteUserById', selectedUserID.value);
        selectedUserIndex.value = -1;
    }
    function editUser(){
        editedUser.value = true;
    }
</script>
