<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class="ml-4 text-4xl font-bold text-black text-center">
          Addressbook Entry: {{ selectedAddressbookEntry?.label }}
        </h1>
        <NormalButton
          class=" ml-auto  mr-6"
          @click.prevent="showModalEditEntry = !showModalEditEntry"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          /></svg>
        </NormalButton>
      </div>
      <div
        class=" text-xl mt-4"
      >
        <p> Descrition: {{ selectedAddressbookEntry?.description }}</p>
        <p v-if="updatedOperation != ''">
          Operation: {{ selectedAddressbookEntry?.operation != undefined? operations().get(selectedAddressbookEntry.operation)?.title : '' }}
        </p>
        <p v-if="updatedUser != ''">
          User: {{ selectedAddressbookEntry?.user != undefined? users().get(selectedAddressbookEntry.user)?.first_name + ' ' + users().get(selectedAddressbookEntry.user)?.first_name : '' }}
        </p>
      </div>
    </div>
    <h2 class="text-xl font-bold">
      Channels:
    </h2>
    <!-- Addressbook Modal-->
    <FloatingModal
      :show-modal="showModalEditEntry"
      :title="'Edit Addressbook Entry'"
      class=" p-10 text-xl"
      @click="toggleShowModalEntry()"
    >
      <FormInput
        id="entryLabel"
        v-model="updatedLabel"
        div-class="w-50"
        :label="'Label'"
      />
      <FormInput
        id="entryDesc"
        v-model="updatedDescription"
        div-class="w-50"
        :label="'Description'"
      />
      <!-- Operation -->
      <div class="mb-6 w-80">
        <label
          for="operation"
          class="block mb-2 text-sm font-medium text-on_background"
        >Select an Operation</label>
        <select
          id="operation"
          v-model="updatedOperation"
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
      <!-- User -->
      <div class="mb-6 w-80">
        <label
          for="users"
          class="block mb-2 text-sm font-medium text-on_background"
        >Select an User</label>
        <select
          id="users"
          v-model="updatedUser"
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
      <NormalButton
        v-if="(updatedDescription != '' && updatedLabel != '')"
        @click="editCurrentAddressbookEntry()"
      >
        Update Entry
      </NormalButton>
    </FloatingModal>
    <!-- Channel Modal -->
    <FloatingModal
      :show-modal="showModalNewChannel"
      :title="channelButtonText"
      class=" p-10 text-xl"
      @click="toggleShowModal()"
    >
      <div class=" flex">
        <div class=" mr-auto p-4">
          <FormInput  
            id="label"
            v-model="newChannelLabel"
            div-class="w-50"
            :label="'Label'"
          />
          <SearchableSelect
            v-model="newChannelTypeValue"
            mode="single"
            :options="['in-app-notification']"
            :placeholder="'ChannelType'"
            label="Channel Type"
            :filter-results="true"
            class="mb-3 w-50"
          />
          <SearchableSelect
            v-if="newChannelTypeValue === 'forward-to-user'"
            v-model="newChannelDetailsValue"
            mode="single"
            :options="usersSearchResultsArray"
            :placeholder="'Username'"
            label="username"
            value-prop="id"
            track-by="username"
            :filter-results="false"
            class=" mt-4 mb-3  w-50"
            @search-change="handleUserSelectionInput"
            @open="handleUserSelectionInput('')"
          />
          <FormInput
            v-if="(newChannelTypeValue != 'forward-to-user') && (newChannelTypeValue != '') && (newChannelTypeValue != 'forward-to-group') && (newChannelTypeValue != 'in-app-notification') && (newChannelTypeValue != '')"
            id="details"
            v-model="newChannelDetailsValue"
            div-class="w-50"
            :label="newChannelTypeValue"
          />
        </div>
        <div class="ml-auto p-4">
          <FormInput
            id="prio"
            v-model="newChannelPrio"
            type="number"
            div-class="w-50"
            label="Priority"
          />
          <FormInput
            id="min_importance"
            v-model="newChannelMinImprotance"
            div-class="w-50"
            type="number"
            label="Minimum Importance"
          />
          <FormInput
            id="timeout"
            v-model="newChannelTimeout"
            div-class="w-50"
            type="number"
            label="Timeout"
          />
        </div>
      </div>
      <NormalButton
        v-if="(newChannelLabel != '' && newChannelPrio>0 && newChannelMinImprotance>0 && newChannelTimeout>0)"
        @click="createNewChannel()"
      >
        {{ channelButtonText }}
      </NormalButton>
    </FloatingModal>
    <!-- Channel Table -->
    <TableContainer
      :contents="channels().values()"
      id-identifier="id"
    >
      <template #tableHeader>
        <TableHeader :num-of-cols="6">
          <template #header1>
            Label
          </template>
          <template #header2>
            Minimum Importance
          </template>
          <template #header3>
            Priority
          </template>
          <template #header4>
            Type
          </template>
          <template #header5>
            Details
          </template>
          <template #header6>
            <button
              type="button"
              class=" mlauto bg-background text-on_background hover:bg-surface_dark hover:text-on_surface_dark rounded-lg focus:ring-2 focus:ring-surface p-1.5 inline-flex h-8 w-8 "
              @click.prevent="showModalNewChannel = !showModalNewChannel; channelButtonText = 'Create Channel'"
            >
              <span class="sr-only">+</span>
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              /></svg>
            </button>
          </template>
        </TableHeader>
      </template>
      <template #tableRow="{rowData}:{rowData:Channel}">
        <TableRow 
          :row-data="rowData"
          :num-of-cols="6"
          :identifier="rowData.id"
        >
          <template #data1="{data}:{data:Channel}">
            {{ data.label }}
          </template>
          <template #data2="{data}:{data:Channel}">
            {{ data.min_importance }}
          </template>
          <template #data3="{data}:{data:Channel}">
            {{ data.priority }}
          </template>
          <template #data4="{data}:{data:Channel}">
            {{ data.type }}
          </template>
          <template #data5="{data}:{data:Channel}">
            {{ getChannelDetail(data) }}
          </template>
          <template #data6="{data}:{data:Channel}">
            <button
              type="button"
              class="bg-background text-on_background hover:bg-surface_dark hover:text-on_surface_dark rounded-lg focus:ring-2 focus:ring-surface p-1.5 inline-flex h-8 w-8 "
              @click.stop="editCurrentChannel(data.id); channelButtonText = 'Update Channel'"
            >
              <span class="sr-only">Edit</span>
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              /></svg>
            </button>
          </template>
        </TableRow>
      </template>
    </TableContainer>
    <div
      class="flex"
    >
      <NormalButton
        class=" ml-auto"
        @click.prevent="router.push('/addressbook')"
      >
        Cancel
      </NormalButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import TableContainer from '../components/BasicComponents/TableContainer.vue';
  import TableRow from '../components/BasicComponents/TableRow.vue';
  import TableHeader from '../components/BasicComponents/TableHeader.vue';
  import {useAddressbookState, useUserState, useChannelState, useGroupState, useOperationsState} from '../store';
  import {useRoute, useRouter} from 'vue-router';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { AddressbookEntry, Channel, ChannelDetail, ChannelType, Group, User} from '../../../types';
  import FloatingModal from '../components/BasicComponents/FloatingModal.vue';
  import FormInput from '../components/BasicComponents/FormInput.vue';
  import SearchableSelect from '../components/BasicComponents/SearchableSelect.vue';

  onMounted(() => {
    channelState.dispatch('retrieveChannels', selectedAddressbookEntryId as string);} );

  const route = useRoute();
  const router = useRouter();
  const addressbookState = useAddressbookState();
  const channelState = useChannelState();
  const groupState = useGroupState();
  const operationsState = useOperationsState();
  const userState = useUserState();
  const showModalNewChannel = ref(false);
  const showModalEditEntry = ref(false);

  const selectedAddressbookEntryId = route.params.addressbookEntryID;
  const entries = computed(() => addressbookState.getters.entries);
  const selectedAddressbookEntry = entries.value().get(selectedAddressbookEntryId as string);
  const channels = computed(() => channelState.getters.channels);
  const groups = computed(() => groupState.getters.groups);
  const users = computed(() => userState.getters.users);
  const usersSearchResults = computed(() => userState.getters.searchResults);
  const usersSearchResultsArray = computed(() => {
      return InterableIteratorToArray(usersSearchResults.value().values());
  });
  const operations = computed(() => operationsState.getters.operations);

  const updatedLabel = ref('');
  const updatedDescription = ref('');
  const updatedUser = ref('');
  const updatedOperation = ref('');
  const channelButtonText = ref('');

  const newChannelLabel = ref('');
  var newChannelType:ChannelType|undefined;
  const newChannelTypeValue = ref('');
  const newChannelPrio = ref(0);
  const newChannelMinImprotance = ref(0);
  var newChannelDetails:ChannelDetail;
  const newChannelTimeout = ref(0);
  const newChannelDetailsValue = ref('');

  const selectedChannelID = ref('');
  const currentChannel = ref();

  watch(selectedChannelID, (curVal) => {
    if(curVal){
      currentChannel.value = channels.value().get(curVal);
    }
  });
  if( newChannelTypeValue.value == 'forward-to-user'){
    watch(newChannelDetailsValue, (curVal) => {
      if(curVal) {
        userState.dispatch('retrieveUserById', curVal);
      }
    });
  }
  if(selectedAddressbookEntry) {
    updatedLabel.value = selectedAddressbookEntry.label;
    updatedDescription.value = selectedAddressbookEntry.description;
    updatedUser.value = selectedAddressbookEntry.user ? selectedAddressbookEntry.user : '';
    updatedOperation.value = selectedAddressbookEntry.operation ? selectedAddressbookEntry.operation : '';
  }
  function getChannelDetail(channel: Channel):string{
    switch(channel.type){
      case 'email':
          return channel.details.email ? channel.details.email : '';
      case 'direct' : 
          return channel.details.info ? channel.details.info : '';
      case 'forward-to-group' : 
          if(channel.details.forward_to_group){
              const group = groups.value().get(channel.details.forward_to_group);
              if(group){
                  return group.title;
              }
          }
          return '';
      case 'forward-to-user' : 
          if(channel.details.forward_to_user){
              const user = users.value().get(channel.details.forward_to_user);
              if(user){
                  return user.first_name + ' ' + user.last_name;
              }
          }
          return '';
      case 'phone-call' : 
          return channel.details.phone ? channel.details.phone : '';
      case 'radio' : 
          return channel.details.info ? channel.details.info : '';
      default:
          return '';
    }
  }
  async function toggleShowModal() {
      showModalNewChannel.value = false;        
      resetValues();
  }
  async function createNewChannel() {
      newChannelType = newChannelTypeValue.value as ChannelType;
      setChannelDetailsAccordinly();
      if(newChannelType != undefined){
          const newChannel:Channel = {
              id: '',
              entry : selectedAddressbookEntryId as string,
              label : newChannelLabel.value,
              priority : Number(newChannelPrio.value),
              min_importance : Number(newChannelMinImprotance.value),
              timeout : Number(newChannelTimeout.value),
              type : newChannelType,
              details : newChannelDetails,
          };
          var channelsList:Channel[] = [... channels.value().values(), newChannel];
          channelState.dispatch('setChannels', {entryId: (selectedAddressbookEntryId as string), channels: channelsList});
          channelState.dispatch('retrieveChannels', selectedAddressbookEntryId as string);
          showModalNewChannel.value = false; 
          resetValues();
      }
  }
  function InterableIteratorToArray<T>(iter:IterableIterator<T>):T[] {
    const arr: T[] = [];
    // eslint-disable-next-line no-constant-condition
    while(true) {
      const next = iter.next();
      if(next.done) {
        break;
      }
      arr.push(next.value);
    }
    return arr;
  }
  function resetValues() {
    newChannelType = undefined;
    newChannelTypeValue.value = '';
    newChannelLabel.value = '';
    newChannelDetailsValue.value = '';
    newChannelPrio.value = 0;
    newChannelTimeout.value =0;
    newChannelMinImprotance.value = 0;
  }
  function setChannelDetailsAccordinly(){
    if(newChannelDetailsValue.value != ''){
      switch(newChannelTypeValue.value){
        case 'direct':
          newChannelDetails = {info : newChannelDetailsValue.value};
          break;
        case 'email':
          newChannelDetails = {email : newChannelDetailsValue.value};
          break;
        case 'forward-to-group':
          newChannelDetails = {forward_to_group : newChannelDetailsValue.value};
          break;
        case 'forward-to-user':
          newChannelDetails = {forward_to_user : newChannelDetailsValue.value};
          break;
        case 'phone-call':
          newChannelDetails = {phone : newChannelDetailsValue.value};
          break;
        case 'push':
          newChannelDetails = {info : newChannelDetailsValue.value};
          break;
        case 'radio':
          newChannelDetails = {info : newChannelDetailsValue.value};
          break;
      }
    }
  }
  function editCurrentAddressbookEntry(){
    if(selectedAddressbookEntry){
      selectedAddressbookEntry.label = updatedLabel.value;
      selectedAddressbookEntry.description = updatedDescription.value;
      selectedAddressbookEntry.user = updatedUser.value;
      selectedAddressbookEntry.operation = updatedOperation.value;
      addressbookState.dispatch('updateEntries', {
          id:selectedAddressbookEntry.id,
          label: updatedLabel.value,
          description:updatedDescription.value,
          user:updatedUser.value,
          operation:updatedOperation.value,
      });
      toggleShowModalEntry();
    } else{
      toggleShowModalEntry();
    }
  }
  
  function toggleShowModalEntry(){
    if(selectedAddressbookEntry) {
        updatedLabel.value = selectedAddressbookEntry.label;
        updatedDescription.value = selectedAddressbookEntry.description;
        updatedUser.value = selectedAddressbookEntry.user ? selectedAddressbookEntry.user : '';
        updatedOperation.value = selectedAddressbookEntry.operation ? selectedAddressbookEntry.description : '';
    }
    showModalEditEntry.value = false;
  }
  /**
   * Edits current channel.
   * @param id: id of the channel to edit.
   */
  function editCurrentChannel(id:string){
    var currentChannel = channels.value().get(id);
    if(currentChannel){
      newChannelTypeValue.value = currentChannel.type;
      newChannelLabel.value = currentChannel.label;
      newChannelPrio.value = currentChannel.priority;
      newChannelTimeout.value =currentChannel.timeout;
      newChannelMinImprotance.value = currentChannel.min_importance;
      if(currentChannel.details.email){
        newChannelDetailsValue.value = currentChannel.details.email;
      } else if(currentChannel.details.forward_to_group){
        newChannelDetailsValue.value = currentChannel.details.forward_to_group;
      } else if(currentChannel.details.forward_to_user){
        newChannelDetailsValue.value = currentChannel.details.forward_to_user;
      } else if(currentChannel.details.info){
        newChannelDetailsValue.value = currentChannel.details.info;
      } 
      showModalNewChannel.value = true;
    }
  }
  /**
   * Sends out the request for the specified query.
   * @param query: the user ssearch criteria.
   */
  function handleUserSelectionInput(query: string) {
    userState.dispatch('searchUsersByQuery', {query, limit:10});
  }
</script>