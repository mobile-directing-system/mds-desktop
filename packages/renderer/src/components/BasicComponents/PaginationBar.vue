<template>
  <div class="flex justify-end">
    <div class="flex gap-5">
      <!-- Previous Page Button -->
      <NormalButton
        class="mt-2 mb-2 ml-auto"
        :disabled="showPreviousButton? false:true"
        @click.prevent="previousPage()"
      >
        Previous
      </NormalButton>
      <!-- Current/Toal Pages Display -->
      <span class=" text-base mt-3">{{ paginationPage + 1 }}/{{ paginationMaxPages }}</span>
      <!-- Next Page Button -->
      <NormalButton
        class="mt-2 mb-2 ml-auto"
        :disabled="showNextButton? false:true"
        @click.prevent="nextPage()"
      >
        Next
      </NormalButton>
    </div>
  </div>
</template>
<script lang="ts" setup>

  /**
   * This component displays previous and next buttons which are disabled if no more entries exist
   * in the respective direction. If emits the updatePage event when one of those buttons are clicked
   * with a payload indicating the amount of entries at which offset should be loaded. It also
   * displays how much pages of entries are available and on which page the user currently is. All
   * passed attributes, which are no props, are passed to the containing div.
   */

  import { computed, ref, onMounted } from 'vue';
  import NormalButton from './NormalButton.vue';

  interface Props {
    totalRetrievableEntities: number; // the total amount of entities which could be retreived
    pageSize: number;                 // the amount of entities per page
    initialPage?: number;             // when passed the initialPage and not page 1 is considered when returning the pageSize and offset
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (name: 'updatePage', {amount, offset}:{amount: number, offset: number}): void // the event is emitted when either of the two button is clicked and returns the values needed for retrieving the correct page from the backend
  }>();

  const paginationPage = ref(props.initialPage? props.initialPage : 0);
  const paginationMaxPages = computed(() => Math.ceil(props.totalRetrievableEntities / props.pageSize ));
  const showNextButton = computed(() => (paginationPage.value +1) < paginationMaxPages.value);
  const showPreviousButton = computed(() => paginationPage.value > 0);

  onMounted(() => {
    //call updatePage onMount to remove the need of calling explicit updates onMounted in the using component
    updatePage();
  });

  /**
   * function to emit the updatePage event to cause paging changes
   */
  async function updatePage() {
    emit('updatePage', {amount: props.pageSize, offset: paginationPage.value * props.pageSize});
  }

  /**
   * function to navigate to the previous page
   */
  async function previousPage() {
    paginationPage.value--;
    updatePage();
  }

  /**
   * function to navigate to the next page
   */
  async function nextPage() {
    paginationPage.value++;
    updatePage();
  }
</script>