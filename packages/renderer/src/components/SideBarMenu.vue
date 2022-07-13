<template>
  <div class="relative flex min-h-screen">
    <div class="bg-white text-blue-700 border-blue-700 border-r-2 w-1/5 min-w-fit p-3">
      <!-- SideBar -->
            
      <main>
        <button
          class="block w-full  items-center pt-10 "
          @click="$router.push(`/users`)"
        >
          <div class="flex items-center hover:bg-primary hover:text-on_primary hover:rounded-md hover:shadow-xl">
            <svg
              class="px-3 w-12 h-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            /></svg>
            <span class="text-2xl"> Users </span>
          </div>
        </button>
        <button
          class="block w-full  items-center pt-5"

          @click="$router.push(`/operations`)"
        >
          <div class="flex items-center hover:bg-primary hover:text-on_primary hover:rounded-md hover:shadow-xl">
            <svg
              class="px-3 w-12 h-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            /></svg>
            <span class="text-2xl"> Operations </span>
          </div>
        </button>
        <button
          class="block w-full  items-center pt-5"
          @click="$router.push(`/groups`)"
        >
          <div class="flex items-center hover:bg-primary hover:text-on_primary hover:rounded-md hover:shadow-xl">
            <svg
              class="px-3 w-12 h-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            /></svg>
            <span class="text-2xl"> Groups </span>
          </div>
        </button>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>