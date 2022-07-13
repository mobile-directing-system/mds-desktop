<template>
  <main
    class="bg-surface mx-auto max-w-lg p-8 rounded-lg shadow-2xl my-10"
  >
    <form class="w-80">
      <FormInput 
        id="username"
        v-model="username"
        label="Username"
        type="text"
      />
      <FormInput 
        id="password" 
        v-model="password"
        label="Password"
        type="password"
      />
      <NormalButton
        btn-text="Login"
        btn-id="submit"
        btn-type="submit"
        @btn-click="onSubmit"
      />
    </form>
  </main>
</template>
<script lang="ts" setup>
  /**
   * Login form component displays the
   * login form.
   */
  import NormalButton from './BasicComponents/NormalButton.vue';
  import FormInput from './BasicComponents/FormInput.vue';
  import { ref } from 'vue';
  import { useLoginState } from '../store';

  const loginState = useLoginState();
  const username = ref('');
  const password = ref('');

  /** 
   * function for the click handler sets loggingIn to true to
   * show a spinner when waiting for the answer of the backend.
   * calls the login action of the store to call the backend with
   * user supplied username and password. If login was succesful
   * navigate the mainpage view if not show login failed alert.
   */ 

  async function onSubmit() {
    loginState.dispatch('login', {username: username.value, password: password.value});
  }
</script>