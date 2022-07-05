<template>
  <FloatingErrorToast
    v-if="showError()"
    toast-text="An Error has occured."
    toast-id="errorToast"
    @toast-close="closeErrorToast()"
  />
  <router-view />
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useErrorState, useLoginState } from './store';
  import { useRouter } from 'vue-router';
  import FloatingErrorToast from './components/BasicComponents/FloatingErrorToast.vue';

  /**
   * load router and logininfo store to check
   * if already logged in and if so navigate to
   * the main application view
   */
  const loginState = useLoginState();
  const errorState = useErrorState();
  const router = useRouter();
  const loggedIn = computed(() => loginState.getters.loggedIn);
  const showError = computed(() => errorState.getters.showError);

  function closeErrorToast() {
    errorState.dispatch('setShowError', false);
  }

  if(loggedIn.value()) {
    router.push('/main');
  }  else {
    router.push('/');
  }
</script>
