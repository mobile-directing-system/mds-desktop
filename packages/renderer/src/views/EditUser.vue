<template>
  <div
    id="update-user-form"
    class=" bg-white ml-4  my-10"
  >
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
            id="update-user-username"
            v-model="updatedUserName"
            label="Username"
            required
          />
        </div>
        <!------- first_name  ------>
        <div class="mb-6">
          <FormInput
            id="update-user-firstName"
            v-model="updatedUserFirstName"
            label="Firstname"
            required
          />
        </div>
        <!------- last_name  ------>
        <div class="mb-6">
          <FormInput
            id="update-user-lastName"
            v-model="updatedUserLastName"
            label="Lastname"
            required
          />
        </div>
        <div class="flex justify-between">
          <!-- Update User Button -->
          <NormalButton
            v-if="updatedUserFirstName != '' && updatedUserName != '' && updatedUserLastName != ''"
            id="update-user-update-button"
            @click.prevent="editUser()"
          >
            Update User
          </NormalButton>
          <!-- Delete User Button -->
          <NormalButton
            id="update-user-delete-button"
            class="ml-auto"
            @click.prevent="deleteUser()"
          >
            Delete User
          </NormalButton>
        </div>
        <div class=" pt-4 flex justify-between">
          <!-- Cancel Button -->
          <NormalButton
            id="update-user-cancel-button"
            class=" ml-auto"
            @click.prevent="router.push('/user')"
          >
            Cancel
          </NormalButton>
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
  const currentUser = users.value().get(selectedUserID as string);

  const updatedUserFirstName = ref('');
  const updatedUserName = ref('');
  const updatedUserLastName = ref('');

  //set refs with content of current user if it exists
  if(currentUser) {
    updatedUserFirstName.value = currentUser.first_name;
    updatedUserName.value = currentUser.username;
    updatedUserLastName.value = currentUser.last_name;
  }

  /**
   * function to create the edited user object and initate call to the backend. Click handler for the Edit User Button.
   */
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

  /**
   * function to delete the user. Click handler for the Delete User Button.
   */
  function deleteUser(){
      userState.dispatch('deleteUserById', selectedUserID.toString());
      router.push('/user');
  }
</script>
