<template>
  <header class=" max-w-lg ml-4 my-10">
    <h1 class="text-4xl font-bold text-on_background ">
      Create a new User
    </h1>        
  </header>
  <div class="ml-4">
    <form class="w-80">
      <main class="">
        <!------- Username  ------>
        <FormInput
          id="username"
          v-model="userName"
          label="Username"
        />
        <!------- first_name  ------>
        <FormInput
          id="firstName"
          v-model="firstName"
          label="First Name"
        />
        <!------- last_name  ------>
        <FormInput
          id="lastName"
          v-model="lastName"
          label="Last Name"
        />
        <!--- Initial Password--->
        <FormInput
          id="iPassword"
          v-model="iPassword"
          label="Initial Password"
          type="password"
        />
        <!--- Submit Button --->
        
        <div class=" pt-4 flex justify-between">
          <NormalButton
            id="submit"
            class=""
            btn-text="Submit"
            type="submit"
            @click.prevent="createNewUser(userName, firstName, lastName,iPassword)"
          />
          <NormalButton
            class=" ml-auto"
            :btn-text="'Cancel'"
            @click="router.push('/user')"
          />
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

