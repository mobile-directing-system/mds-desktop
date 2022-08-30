<template>
  <div class=" bg-background ml-4 max-w-lg rounded-lg  my-10">
    <header class=" max-w-lg pb-10">
      <h1 class="  text-left text-4xl font-bold text-on_background">
        Create a new Addressbook Entry
      </h1>        
    </header>
    <form class="w-100">
      <main>
        <!----- Label ---->
        <FormInput
          id="label"
          v-model="addedlabel"
          div-class="w-80"
          label="Label"
        />
        <!----- Description ----->
        <FormInput
          id="description"
          v-model="addeddescription"
          div-class="w-80"
          label="Description"
        />
        <!----- Operation ----->
        <div class="mb-6 w-80">
          <label
            for="operation"
            class="block mb-2 text-sm font-medium text-on_background"
          >Select an Operation</label>
          <select
            id="operation"
            v-model="addedOperationId"
            class="bg-surface_superlight border border-surface_dark text-on_surface_superlight text-sm rounded-lg focus:ring-primary_light focus:border-primary_light block w-full p-2.5"
          >
            <option
              value=""
              selected
            >
              Choose an Operation
            </option>
            <option
              v-for="operation in operations().values()"
              :key="operation.id"
              :value="operation.id"
            >
              {{ operation.title }}
            </option>
          </select>
        </div>
        <!------ User ----->
        <div class="mb-6 w-80">
          <label
            for="users"
            class="block mb-2 text-sm font-medium text-on_background"
          >Select an User</label>
          <select
            id="users"
            v-model="addedUserId"
            class="bg-surface_superlight border border-surface_dark text-on_surface_superlight text-sm rounded-lg focus:ring-primary_light focus:border-primary_light block w-full p-2.5"
          >
            <option
              value=""
              selected
            >
              Choose an User
            </option>
            <option
              v-for="user in users().values()"
              :key="user.id"
              :value="user.id"
            >
              {{ user.first_name }} {{ user.last_name }}
            </option>
          </select>
        </div>
        <div class="pt-4 flex justify-between">
          <NormalButton
            v-if="addedlabel !='' && addeddescription != ''"
            @click.prevent="createAddressbookEntry()"
          >
            Create Entry
          </NormalButton>
          <NormalButton
            class=" ml-auto"
            @click.prevent="router.push('/addressbook')"
          >
            Cancel
          </NormalButton>
        </div>
      </main>
    </form>
  </div>
</template>
<script lang = "ts" setup>
    import { ref, computed, onMounted } from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import { useRouter } from 'vue-router';
    import { useAddressbookState, useUserState, useOperationsState } from '../store';
    import FormInput from '../components/BasicComponents/FormInput.vue';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    import type { User, Operation, AddressbookEntry } from '../../../types';
    const addedlabel = ref('');
    const addeddescription = ref('');
    const addedOperationId = ref('');
    const addedUserId = ref('');
    const router = useRouter();
    const userState = useUserState();
    const addressbookState = useAddressbookState();
    const operationsState = useOperationsState();

    const operations = computed(() => operationsState.getters.operations);
    const users = computed(() => userState.getters.users);

    onMounted(() => {
        operationsState.dispatch('retrieveOperations', {amount : 100});
        userState.dispatch('retrieveUsers', {amount: 100});
    });
    
    function createAddressbookEntry(){
        const newEntry:AddressbookEntry =  {
            id:'',
            label: addedlabel.value,
            description: addeddescription.value ,
            operation: addedOperationId.value? addedOperationId.value:undefined,
            user: addedUserId.value? addedUserId.value:undefined,
        };
        addressbookState.dispatch('createEntry', newEntry);
        router.push('/addressbook');
    }
</script>