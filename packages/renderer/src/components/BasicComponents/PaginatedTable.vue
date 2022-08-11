<template>
  <div class=" table-fixed place-items-center mr-10">
    <table class=" border-spacing-2 w-full rounded-md overflow-hidden m-4">
      <thead class=" bg-blue-700 font-bold text-white text-l text-left text-lg">
        <tr>
          <th 
            v-for="title in props.columnTitles"
            :key="title"
          >
            {{ title }}
          </th>
        </tr>
      </thead> 
      <tbody class="text-left">     
        <tr
          v-for="entity in props.contents" 
          :key="entity[props.idIdentifier]"
          class="border-b-2 border-b-gray-500 bg-white text-black hover:bg-primary_superlight cursor-pointer"
          @click="$emit('click', entity[idIdentifier])"
        >      
          <td 
            v-for="identifier in props.columnIdentifiers"
            :key="identifier"
          >
            {{ entity[identifier] }}
          </td>
        </tr> 
      </tbody>
    </table>
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
  </div>
</template>
<script lang="ts" setup>
  
  import { computed, ref, onMounted } from 'vue';
  import NormalButton from './NormalButton.vue';

  interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contents: any[];
    idIdentifier: string;
    columnTitles: string[];
    columnIdentifiers: string[];
    totalRetrievableEntities: number;
    initialPage?: number;
  }
  const props = defineProps<Props>();
  const emit = defineEmits<{
    (name: 'updatePage', {amount, offset}:{amount: number, offset: number}): void
    (name: 'click', entityId: string): void
  }>();

  const paginationAmount = 5;
  const paginationPage = ref(props.initialPage? props.initialPage : 0);
  //const paginationPage = ref(0);
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