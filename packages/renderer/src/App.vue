<template>
  <FloatingErrorToast
    v-if="error()"
    :toast-text="errorMessage() != ''? errorMessage() : 'An Error has ocurred'"
    toast-id="errorToast"
    @toast-close="closeErrorToast()"
  />
  <router-view />
</template>

<script lang="ts" setup>
  import { computed, watch } from 'vue';
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
  const error = computed(() => errorState.getters.error);
  const errorMessage = computed(() => errorState.getters.errorMessage);

  function closeErrorToast() {
    errorState.dispatch('setError', false);
  }

  watch(loggedIn.value, (curValue) => {
    console.log('loggedIn Change');
    if(curValue) {
      router.push('/main');
    }  else {
      router.push('/');
    }
  });

  if(loggedIn.value()) {
    router.push('/main');
  }  else {
    router.push('/');
  }
</script>
