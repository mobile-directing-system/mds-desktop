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
          @btn-click="showEditUserModal = !showEditUserModal"
        />
      </div>
    </div>
    <div
      v-if="showEditUserModal"
      class="absolute inset-0 z-40 opacity-30 bg-black"
    />
    <div
      v-if="showEditUserModal"
      class="fixed overflow-x-hidden overflow-y-auto inset-0 justify-center items-center z-50 my-24"
    >
      <div class="relative mx-auto w-auto max-w-2xl">
        <div class="bg-white w-full p-10 rounded shadow-xl flex flex-col">
          <p class=" text-center font-bold text-lg">
            Update User
          </p>
          <div class="mb-6">
            <label
              for="username"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Username</label>
            <input
              id="username"
              v-model="updatedUserName"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
            >
          </div>
          <!------- first_name  ------>
          <div class="mb-6">
            <label
              for="firstName"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >First Name</label>
            <input
              id="firstName"
              v-model="updatedUserFirstName"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
            >
          </div>
          <!------- last_name  ------>
          <div class="mb-6">
            <label
              for="lastName"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Last Name</label>
            <input
              id="lastName"
              v-model="updatedUserLastName"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
            >
          </div>
          <NormalButton
            :btn-text="'Submit Update'"
            @click="editUser, showEditUserModal = !showEditUserModal"
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

    const userState = useUserState();
    const users = computed(() => userState.getters.users);
    const selectedUserIndex = ref(-1);
    const selectedUserID = ref('');
    const selectedUserUsername = ref('');
    const selectedUserFirstName = ref('');
    const selectedUserLastName = ref(''); 
    const showEditUserModal = ref(false);
    const updatedUserName = ref('');
    const updatedUserFirstName = ref('');
    const updatedUserLastName = ref('');

    function selectRow(i: number, user_id: string){
            selectedUserIndex.value = i;
            selectedUserID.value = user_id;
            const selectedUser = users.value().filter((elem) => elem.id === user_id)[0];
            selectedUserUsername.value = selectedUser.username;
            selectedUserFirstName.value = selectedUser.first_name;
            selectedUserLastName.value =  selectedUser.last_name;
            updatedUserFirstName.value = selectedUser.first_name;
            updatedUserLastName.value = selectedUser.last_name;
            updatedUserName.value = selectedUser.username;
    }

    function deleteUser(){
        userState.dispatch('deleteUserById', selectedUserID.value);
        selectedUserIndex.value = -1;
    }
    function editUser(){
        const updateUser = users.value().filter((elem) => elem.id === selectedUserID.value)[0];
        updateUser.first_name = updatedUserFirstName.value;
        updateUser.last_name = updatedUserLastName.value;
        updateUser.username = updatedUserName.value;
        userState.dispatch('updateUser', updateUser);
    }
</script>
