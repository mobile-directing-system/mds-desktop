<template>
  <header class=" max-w-lg mx-auto">
    <h1 class="text-4xl font-bold text-black text-center">
      Create a new User
    </h1>        
  </header>
  <div class="grid place-items-center">
    <form class="w-80">
      <main class="bg-white mx-auto max-w-lg p-8 rounded-lg shadow-2xl my-10">
        <!------- Username  ------>
        <FormInput
          id="username"
          v-model="username"
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
        <NormalButton
          id="submit"
          btn-text="Submit"
          btn-type="submit"
          @btn-click="onSubmit"
        />
      </main>
    </form>
  </div>
</template>

<script lang="ts" setup>

    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import FormInput from '../components/BasicComponents/FormInput.vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import type { Router } from 'vue-router';

    const router:Router = useRouter();

    const username = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const iPassword = ref('');

    async function onSubmit() {
        const loggedIn = username.value!='' && firstName.value != '' && lastName.value!='' && iPassword.value !='';
        console.log(loggedIn);
        if(loggedIn) {
            router.push('/main');
        } 
    }
</script>