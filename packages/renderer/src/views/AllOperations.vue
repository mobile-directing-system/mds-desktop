<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class=" ml-96 text-4xl font-bold text-black text-center">
          All Operations
        </h1>
        <NormalButton
          class=" ml-auto "
          :btn-text="'+'"
          @btn-click="router.push('/create-new-operation')"
        />
      </div>
      <div class=" table-fixed place-items-center mr-4">
        <table class=" border-spacing-2 w-full rounded-md overflow-hidden m-4">
          <thead class=" bg-blue-700 font-bold text-white text-l text-left text-lg">
            <tr>
              <th>Index</th>
              <th>Title</th>
              <th>Description</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead> 
          <tbody class="text-left">     
            <tr
              v-for="(operation,i) in operations()" 
              :key="i"
              class=" "
              :class="[i===selectedOperationIndex ? ' border-b-2 border-b-white rounded-lg bg-blue-700 text-white' : 'border-b-2 border-b-gray-500 bg-white text-black']"
              @click="selectRow(i, operation.id)"
            >      
              <td>{{ i + 1 }}</td>
              <td>{{ operation.title }}</td>
              <td>{{ operation.description }}</td>
              <td>{{ operation.start }}</td>
              <td>{{ operation.end }}</td>
            </tr> 
          </tbody>
        </table>
                  
        <div
          class="place-items-center mt-6"
        >
          <h3
            v-if="selectedOperationTitle != ''"
            class="text-center font-bold text-2xl"
          >
            Options
          </h3>
          <p
            v-if="selectedOperationTitle != ''"
            class="p-4 text-center"
          >
            Selected User: {{ selectedOperationTitle }}
          </p>
          <div
            v-if="selectedOperationTitle != ''"
            class=" justify-center flex space-x-14 pt-4 text-2xl"
          >
            <NormalButton
              :btn-text="'Edit Operation'"
              @btn-click="router.push({ name: 'EditCurrentOperation', params: { selectedOperationID } })"
            />
          </div>
          <div class="flex justify-between">
            <NormalButton
              class="mt-4 ml-auto"
              :btn-text="'Cancel'"
              @btn-click="router.push('/main');"
            />
          </div>
        </div>
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
</style>
