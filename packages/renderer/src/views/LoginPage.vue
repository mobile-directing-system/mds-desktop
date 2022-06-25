<template>
  <div 
    :class="loggingIn()? 'cursor-wait':''" 
    class="w-screen h-screen grid place-items-center"
  >
    <div>
      <h1 class="text-4xl font-bold text-black text-center">
        Mobile Directing Service
      </h1>
      <LoginForm />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoginForm from './../components/LoginForm.vue';
  import { useLoginInfo } from '../store';
  import { computed } from 'vue';

  const loginInfo = useLoginInfo();
  const loggingIn = computed(() => loginInfo.getters.getLoggingIn);
</script>