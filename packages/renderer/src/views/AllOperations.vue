<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class="ml-4 text-4xl font-bold text-black text-center">
          All Operations
        </h1>
        <NormalButton
          class=" ml-auto  mr-6"
          @click="router.push('/create-new-operation')"
        >
          +
        </NormalButton>
      </div>
      <div class=" table-fixed place-items-center mr-10">
        <table class=" border-spacing-2 w-full rounded-md overflow-hidden m-4">
          <thead class=" bg-blue-700 font-bold text-white text-l text-left text-lg">
            <tr class="p-2">
              <th class="p-2">
                Title
              </th>
              <th class="p-2">
                Description
              </th>
              <th class="p-2">
                Start
              </th>
              <th class="p-2">
                End
              </th>
            </tr>
          </thead> 
          <tbody class="text-left">     
            <tr
              v-for="(operation,i) in operations()" 
              :key="i"
              class="border-b-2 border-b-gray-500 bg-white text-black hover:bg-primary_superlight cursor-pointer"
              @click="selectRow(i, operation.id)"
            >  
              <td class="p-2">
                {{ operation.title }}
              </td>
              <td class="p-2">
                {{ operation.description }}
              </td>
              <td class="p-2">
                {{ operation.start.toDateString() }},<br> {{ operation.start.toLocaleTimeString() }}
              </td>
              <td class="p-2">
                {{ operation.end.toDateString() }},<br> {{ operation.end.toLocaleTimeString() }}
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup> 
    import { ref, computed } from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import { useOperationsState } from '../store';
    import {useRouter} from 'vue-router';

    const operationState = useOperationsState();
    const operations = computed(()=>operationState.getters.operations);
    const selectedOperationIndex = ref(-1);
    const selectedOperationID = ref('');
    const selectedOperationTitle = ref('');
    const router = useRouter();

    function selectRow(i: number, operation_id: string){
            selectedOperationIndex.value = i;
            selectedOperationID.value = operation_id;
            const selectedOperation = operations.value().filter((elem) => elem.id === selectedOperationID.value)[0];
            selectedOperationTitle.value = selectedOperation.title;
            router.push({ name: 'EditCurrentOperation', params: { selectedOperationID: operation_id} });
    }

</script>
<style>
  .bottomPartwithSidebar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--1);
  }
  .bottomPartwithSidebar > :first-child{
    flex-basis: 1;
  }
  .bottomPartwithSidebar > :last-child{
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: 75%;
  }
  ::-webkit-scrollbar {
    display: none;
  }
</style>
