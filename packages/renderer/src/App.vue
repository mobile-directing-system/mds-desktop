<template>
  <!-- Floating Error Toast (Visible in entire App) -->
  <FloatingErrorToast />
  <!-- Router View -->
  <router-view />
</template>

<script lang="ts" setup>
  import { computed, watch } from 'vue';
  import { useLoginState } from './store';
  import { useRouter } from 'vue-router';
  import FloatingErrorToast from './components/BasicComponents/FloatingErrorToast.vue';

  /**
   * load router and logininfo store to check
   * if already logged in and if so navigate to
   * the main application view
   */
  const loginState = useLoginState();
  const router = useRouter();
  const loggedIn = computed(() => loginState.getters.loggedIn);

  //if the user is logged out always route him to the login page
  watch(loggedIn.value, (curValue) => {
    if(curValue) {
      router.push('/main');
    }  else {
      router.push('/');
    }
  });

  //on login route the user to the main page
  if(loggedIn.value()) {
    router.push('/main');
  }  else {
    router.push('/');
  }
</script>
<style>
  @import '@vueform/multiselect/themes/tailwind.css';
</style>
