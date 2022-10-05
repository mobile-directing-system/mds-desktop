<template>
  <div
    id="mailbox"
    class=" bg-white ml-4  my-10"
  >
    <header class=" max-w-lg pb-10">
      <h1 class="  text-left text-4xl font-bold text-black">
        Mailbox
      </h1>        
    </header>
    <Mailbox />
  </div>
</template>
<script lang="ts" setup>
  import { useIntelState } from '../store';
  import Mailbox from '../components/MailBox.vue';

  const intelState = useIntelState();
  intelState.dispatch('retrieveIntelById', 'bb2a2171-7ba0-40b3-9da7-09d52e31d330');

</script>