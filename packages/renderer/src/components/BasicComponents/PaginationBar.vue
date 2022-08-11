<template>
  <div class="flex justify-end">
    <div class="flex gap-5">
      <NormalButton
        class="mt-4 ml-auto"
        :disabled="showPreviousButton? false:true"
        @click="previousPage()"
      >
        Previous
      </NormalButton>
      {{ paginationPage + 1 }}/{{ paginationMaxPages }}
      <NormalButton
        class="mt-4 ml-auto"
        :disabled="showNextButton? false:true"
        @click="nextPage()"
      >
        Next
      </NormalButton>
    </div>
  </div>
</template>
<script lang="ts" setup>

  import { computed, ref, onMounted } from 'vue';
  import NormalButton from './NormalButton.vue';

  interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    totalRetrievableEntities: number;
    initialPage?: number;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (name: 'updatePage', {amount, offset}:{amount: number, offset: number}): void
  }>();

  const paginationAmount = 5;
  const paginationPage = ref(props.initialPage? props.initialPage : 0);
  const paginationMaxPages = computed(() => Math.ceil(props.totalRetrievableEntities / paginationAmount ));
  const showNextButton = computed(() => (paginationPage.value +1) < paginationMaxPages.value);
  const showPreviousButton = computed(() => paginationPage.value > 0);

  onMounted(() => {
    updatePage();
  });

  async function updatePage() {
    emit('updatePage', {amount: paginationAmount, offset: paginationPage.value * paginationAmount});
  }

  async function previousPage() {
    paginationPage.value--;
    updatePage();
  }

  async function nextPage() {
    paginationPage.value++;
    updatePage();
  }
</script>