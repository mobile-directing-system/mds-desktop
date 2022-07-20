<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class=" ml-4 text-4xl font-bold text-black text-center">
          All Users
        </h1>
        <NormalButton
          class=" ml-auto mr-6"
          :btn-text="'+'"
          @click.prevent="router.push('/create-new-group')"
        />
      </div>
      <div class=" table-fixed place-items-center mr-10">
        <table class=" border-spacing-2 w-full rounded-md overflow-hidden m-4">
          <thead class=" bg-blue-700 font-bold text-white text-l text-left text-lg">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Operation</th>
            </tr>
          </thead> 
          <tbody class="text-left">     
            <tr
              v-for="(group,i) in groups()" 
              :key="i"
              class="border-b-2 border-b-gray-500 bg-white text-black hover:bg-primary_superlight cursor-pointer"
              @click="selectRow(i, group.id)"
            >      
              <td>{{ group.title }}</td>
              <td>{{ group.description }}</td>
              <td>{{ operations().filter((elem) => elem.id === group.operation)[0].title }}</td>
            </tr> 
          </tbody>
        </table>
        <div class="flex justify-between">
          <NormalButton
            class="mt-4 ml-auto"
            :btn-text="'Cancel'"
            @click="router.push('/main');"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup> 
    import { ref, computed, onMounted } from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import { useGroupState, useOperationsState } from '../store';
    import {useRouter} from 'vue-router';

    onMounted(() => {
      groupState.dispatch('retrieveGroups', {amount: 100});
      operationsState.dispatch('retrieveOperations', {amount: 100});
    });

    const groupState = useGroupState();
    const operationsState = useOperationsState();
    const groups = computed(() => groupState.getters.groups);
    const operations = computed(() => operationsState.getters.operations);
    const selectedGroupIndex = ref(-1);
    const selectedGroupID = ref('');
    const selectedGroupTitle = ref('');
    const router = useRouter();
    function selectRow(i: number, group_id: string){
            selectedGroupIndex.value = i;
            selectedGroupID.value = group_id;
            const selectedGroup =groups.value().filter((elem) => elem.id === selectedGroupID.value)[0];
            selectedGroupTitle.value = selectedGroup.title;
            router.push({name: 'EditCurrentGroup', params:{ selectedGroupID: group_id}});
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