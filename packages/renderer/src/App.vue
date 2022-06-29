<template>
  <router-view />
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useLoginState } from './store';
  import { useRouter } from 'vue-router';

  /**
   * load router and logininfo store to check
   * if already logged in and if so navigate to
   * the main application view
   */
  const loginState = useLoginState();
  const router = useRouter();
  const loggedIn = computed(() => loginState.getters.getLoggedIn);
  if(loggedIn.value()) {
    router.push('/main');
  }  else {
    router.push('/');
  }
</script>
