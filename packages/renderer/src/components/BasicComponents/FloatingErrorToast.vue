<template>
  <div
    :id="props.toastText"
    class="z-50 absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center w-full max-w-xs p-4 mb-4 text-black bg-red-100 rounded-lg shadow"
    role="alert"
  >
    <div class="ml-3 text-sm font-normal">
      {{ props.toastText }}
    </div>
    <button
      type="button"
      class="ml-auto -mx-1.5 -my-1.5 bg-white text-black hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 "
      aria-label="Close"
      @click.prevent="$emit('toast-close', $event)"
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
</template>
<script lang="ts" setup>

  interface Props {
    toastText: string;
    toastId?: string;
  }
  const props = defineProps<Props>();
  // eslint-disable-next-line
  const emits = defineEmits<{
    (name: 'toast-close', e: MouseEvent ): void
  }>();
</script>