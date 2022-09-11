<template>
  <div class=" bg-white ml-4  my-10">
    <header class=" max-w-lg ml-4 my-10">
      <h1 class="text-4xl font-bold text-on_background ">
        Create a new User
      </h1>        
    </header>
    <form class="w-80">
      <main class="ml-4">
        <!------- Username  ------>
        <FormInput
          id="username"
          v-model="userName"
          label="Username"
          required
        />
        <!------- first_name  ------>
        <FormInput
          id="firstName"
          v-model="firstName"
          label="First Name"
          required
        />
        <!------- last_name  ------>
        <FormInput
          id="lastName"
          v-model="lastName"
          label="Last Name"
          required
        />
        <!--- Initial Password--->
        <FormInput
          id="iPassword"
          v-model="iPassword"
          label="Initial Password"
          type="password"
          required
        />
          
        <div class=" pt-4 flex justify-between">
          <!-- Create User Button -->
          <NormalButton
            id="submit"
            class=""
            type="submit"
            @click.prevent="createNewUser(userName, firstName, lastName,iPassword)"
          >
            Create User
          </NormalButton>
          <!-- Cancel Button -->
          <NormalButton
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

    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import FormInput from '../components/BasicComponents/FormInput.vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import {useUserState} from '../store';

    const userName = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const iPassword = ref(''); 
    const userState = useUserState();
    const router = useRouter();

    /**
     * function to create new user object and initiate call to backend. Click handler for the create user button.
     * @param username username of the new user
     * @param firstname firstname of the new user
     * @param lastname lastname of the new user
     * @param ipassword password of the new user
     */
    function createNewUser( username: string, firstname: string, lastname :string, ipassword : string) {
        userState.dispatch('createUser', {
            id: '',
            username: username,
            first_name: firstname,
            last_name: lastname,
            is_admin: false,
            pass: ipassword,
        });
        userName.value = '';
        firstName.value ='';
        lastName.value ='';
        iPassword.value = '';
  }

</script>

