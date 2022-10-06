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
  import Mailbox from '../components/MailBox.vue';

</script>