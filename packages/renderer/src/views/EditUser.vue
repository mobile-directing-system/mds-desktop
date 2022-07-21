<template>
  <div class=" bg-white ml-4  my-10">
    <header class=" max-w-lg pb-10">
      <h1 class="  text-left text-4xl font-bold text-black">
        User Information
      </h1>        
    </header>
    <form class="w-80">
      <main class="">
        <!------- Username  ------>
        <div class="mb-6">
          <FormInput
            id="username"
            v-model="updatedUserName"
            label="Username"
          />
        </div>
        <!------- first_name  ------>
        <div class="mb-6">
          <FormInput
            id="firstName"
            v-model="updatedUserFirstName"
            label="Firstname"
          />
        </div>
        <!------- last_name  ------>
        <div class="mb-6">
          <FormInput
            id="lastName"
            v-model="updatedUserLastName"
            label="Lastname"
          />
        </div>
        <!--- Submit Button --->
          
        <div class="flex justify-between">
          <NormalButton 
            v-if="updatedUserFirstName != '' && updatedUserName != '' && updatedUserLastName != ''"
            :btn-text="'Update User'"
            @click.prevent="editUser()"
          />
          <NormalButton
            class="ml-auto"
            :btn-text="'Delete User'"
            @click.prevent="deleteUser()"
          />
        </div>
        <div class=" pt-4 flex justify-between">
          <NormalButton
            class=" ml-auto"
            :btn-text="'Cancel'"
            @click.prevent="router.push('/user')"
          />
        </div>
      </main>
    </form>
  </div>
</template>

<script lang="ts" setup> 
  import { ref, computed} from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import FormInput from '../components/BasicComponents/FormInput.vue';
  import { useUserState} from '../store';
  import type {User} from '../../../types';

  import{useRouter, useRoute} from 'vue-router';
  const userState = useUserState();
  const router = useRouter();
  const route = useRoute();

  const users = computed(() => userState.getters.users);
  const selectedUserID = route.params.selectedUserID;
  const currentUser = users.value().filter((elem) => elem.id === selectedUserID)[0];
  const updatedUserFirstName = ref('');
  updatedUserFirstName.value = currentUser.first_name;
  const updatedUserName = ref('');
  updatedUserName.value = currentUser.username;
  const updatedUserLastName = ref('');
  updatedUserLastName.value = currentUser.last_name;
  console.log(selectedUserID.toString());
  

  function editUser(){
      const updatedUser:User = {
        id: selectedUserID.toString(),
        username: updatedUserName.value,
        first_name: updatedUserFirstName.value,
        last_name: updatedUserLastName.value,
        is_admin: false,
        pass: '',
      };
      userState.dispatch('updateUser', updatedUser);
  }
    function deleteUser(){
      userState.dispatch('deleteUserById', selectedUserID.toString());
      router.push('/user');
  }
</script>
