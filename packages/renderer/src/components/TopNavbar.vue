<template>
  <div class="bg-background text-primary border-b-2 border-primary">
    <div class="pt-5 pb-3 flex justify-between">
      <div class="px-14 text-center font-extrabold text-4xl">
        MDS
      </div>
      <div class=" flex justify-evenly text-2xl">   
        <div class=" px-16">
          <router-link
            to="/main"
            class=" px-3 hover:bg-contain hover:bg-center hover:bg-primary hover:text-on_primary hover:rounded-lg hover:shadow-xl"
          >
            Ressources
          </router-link>
        </div>

        <div class=" px-16 ">
          <router-link
            to="/main"
            class=" px-3 hover:bg-primary hover:text-on_primary hover:rounded-lg hover:shadow-xl"
          >
            Intelligence
          </router-link>
        </div>
        <!-- Settings -->
        <div class="hover:bg-primary hover:text-on_primary hover:rounded-xl hover:shadow-xl flex ml-auto mr-5">
          <router-link to="/main">
            <svg
              class="w-8 h-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            /><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            /></svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

    import { useRouter } from 'vue-router';
    import type { Router } from 'vue-router';

    const router:Router = useRouter();

    console.log(router);
    
</script>