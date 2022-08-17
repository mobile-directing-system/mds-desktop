<template>
  <!-- Opaque Overlay behind Modal -->
  <div
    v-if="props.showModal"
    class="absolute inset-0 z-40 opacity-25 bg-black"
  />
  <!-- Add Member Modal -->
  <div
    v-if="props.showModal"
    class="fixed overflow-x-hidden overflow-y-auto inset-0 justify-center h-fit mt-40 flex z-50"
  >
    <div
      v-bind="$attrs"
      class="relative p-2 max-w-2xl bg-white rounded"
    >
      <div class="flex justify-between mb-2">
        <span
          class="text-sm font-medium text-gray-900 dark:text-gray-400 pl-1 mt-0.5"
        >{{ props.title }}</span>
        <NormalButton
          type="button"
          class="bg-background text-on_background hover:bg-surface_dark hover:text-on_surface_dark rounded-lg focus:ring-2 focus:ring-surface inline-flex p-0.5 h-4 w-4 m-1"
          :overwrite="true"
          @click="$emit('click')"
        >
          <span class="sr-only">Close</span>
          <svg
            class="w-3 h-3"
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
        </NormalButton>
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import NormalButton from './NormalButton.vue';

  interface Props {
    showModal: boolean;
    title: string;
  }
  const props = defineProps<Props>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const emit = defineEmits<{
    (name: 'click'): void
  }>();

</script>