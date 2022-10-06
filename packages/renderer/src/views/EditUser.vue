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
            :disabled="checkPermissions([{name: PermissionNames.UserUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.UserUpdate}])? 'false':'true'"
          />
        </div>
        <!------- first_name  ------>
        <div class="mb-6">
          <FormInput
            id="update-user-firstName"
            v-model="updatedUserFirstName"
            label="Firstname"
            required
            :disabled="checkPermissions([{name: PermissionNames.UserUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.UserUpdate}])? 'false':'true'"
          />
        </div>
        <!------- last_name  ------>
        <div class="mb-6">
          <FormInput
            id="update-user-lastName"
            v-model="updatedUserLastName"
            label="Lastname"
            required
            :disabled="checkPermissions([{name: PermissionNames.UserUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.UserUpdate}])? 'false':'true'"
          />
        </div>
        <!-- is_active -->
        <div class="mb-6 flex justify-between flex-row">
          <label
            for="update-user-is_active"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 "
          >Active</label>
          <input
            id="update-user-is_active"
            v-model="updatedUserActive"
            class="bg-gray-50 border w-1/12 mr-40 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.UserSetActive}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.UserSetActive}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <!-- Update User Button -->
          <NormalButton
            v-if="updatedUserFirstName != '' && updatedUserName != '' && updatedUserLastName != ''"
            id="update-user-update-button"
            :disabled="!checkPermissions([{name: PermissionNames.UserUpdate}])"
            @click.prevent="editUser()"
          >
            Update User
          </NormalButton>
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

  import { useRouter, useRoute } from 'vue-router';
  import { usePermissions } from '../composables';
  import { PermissionNames } from '../constants';

  const userState = useUserState();
  const router = useRouter();
  const route = useRoute();

  const users = computed(() => userState.getters.users);
  const selectedUserID = route.params.selectedUserID;
  const currentUser = users.value().get(selectedUserID as string);
  const checkPermissions = usePermissions();

  const updatedUserFirstName = ref('');
  const updatedUserName = ref('');
  const updatedUserLastName = ref('');
  const updatedUserActive = ref(false);

  //set refs with content of current user if it exists
  if(currentUser) {
    updatedUserFirstName.value = currentUser.first_name;
    updatedUserName.value = currentUser.username;
    updatedUserLastName.value = currentUser.last_name;
    updatedUserActive.value = currentUser.is_active;
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
        is_active: updatedUserActive.value,
        is_admin: false,
        pass: '',
      };
      userState.dispatch('updateUser', updatedUser);
  }
</script>
