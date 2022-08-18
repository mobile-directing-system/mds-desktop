<template>
  <div
    v-if="errors().length >0"
    class="z-50 absolute mx-auto w-96 max-w-sm p-4 grid grid-cols-1 left-1/2 transform -translate-x-1/2 "
    role="alert"
  >
    <div
      v-for="error in errors().slice(0, 3)"
      :key="error.errorId"
      class="text-on_error_light bg-error_light rounded-lg shadow mb-1 flex items-center"
    >
      <div class="ml-3 text-sm font-normal inline-flex w-72 max-w-xs overflow-x-hidden max-h-16">
        {{ error.errorMessage }}
      </div>
      <button
        type="button"
        class="ml-auto mt-1 mb-1 mr-1 bg-error_light text-on_error_light hover:bg-error_dark rounded-lg focus:ring-2 focus:ring-error p-1.5 inline-flex h-8 w-8"
        aria-label="Close"
        @click.prevent="removeError(error.errorId)"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {computed} from 'vue';
  import { useErrorState } from '../../store';

  const errorState = useErrorState();
  const errors = computed(() => errorState.getters.errors);
  
  function removeError(errorId: string) {
    errorState.dispatch('removeError', errorId);
  }
</script>