<template>
  <div>
    <div class="grid bg-white  rounded-lg  my-10">
      <div class="flex justify-between">
        <h1 class="ml-4 text-4xl font-bold text-black text-center">
          Addressbook Entry: {{ selectedAddressbookEntry?.label }}
        </h1>
        <NormalButton
          class=" ml-auto  mr-6"
        >
          +
        </NormalButton>
      </div>
    </div>
    <FloatingModal
      :show-modal="showModalNewChannel"
      :title="'Create new Channel'"
      class=" p-10 text-xl"
      @click="toggleShowModal()"
    >
      <FormInput  
        id="label"
        v-model="newChannelLabel"
        div-class="w-80"
        :label="'Label'"
      />
      <SearchableSelect
        v-model="newChannelType"
        mode="single"
        :options="['direct', 'email','forward-to-group','forward-to-user','phone-call','push','radio']"
        :placeholder="'ChannelType'"
        label="Channel Type"
        :filter-results="true"
      />
      <SearchableSelect
        v-if="newChannelType === 'forward-to-user'"
        v-model="newChannelType"
        mode="single"
        :options="usersSearchResultsArray"
        :placeholder="'ChannelType'"
        label="username"
        value-prop="id"
        track-by="username"
        :filter-results="false"
      />
      <SearchableSelect
        v-if="newChannelType === 'forward-to-group'"
        v-model="newChannelType"
        mode="single"
        :options="usersSearchResultsArray"
        :placeholder="'ChannelType'"
        label="username"
        value-prop="id"
        track-by="username"
        :filter-results="true"
      />
      <FormInput
        v-if="(newChannelType != 'forward-to-user') && (newChannelType != 'forward-to-group')"
        id="details"
        v-model="newChannelDetailsValue"
        div-class="w-80"
        label="Details"
      />
      <FormInput
        id="prio"
        v-model="newChannelPrio"
        div-class="w-80"
        label="Priority"
      />
      <FormInput
        id="min_importance"
        v-model="newChannelMinImprotance"
        div-class="w-80"
        label="Minimum Importance"
      />
      <NormalButton
        @click="createNewChannel()"
      >
        Create new Channel
      </NormalButton>
    </FloatingModal>
    <TableContainer
      :contents="channels().values()"
      id-identifier="id"
    >
      <template #tableHeader>
        <TableHeader :num-of-cols="5">
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
            <button
              type="button"
              class="bg-background text-on_background hover:bg-surface_dark hover:text-on_surface_dark rounded-lg focus:ring-2 focus:ring-surface p-1.5 inline-flex h-8 w-8 "
              @click.prevent="showModalNewChannel = !showModalNewChannel"
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
          :num-of-cols="5"
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
        </TableRow>
      </template>
    </TableContainer>
    <NormalButton
      class=" ml-auto"
      @click.prevent="router.push('/groups')"
    >
      Cancel
    </NormalButton>
  </div>
</template>
<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import TableContainer from '../components/BasicComponents/TableContainer.vue';
    import TableRow from '../components/BasicComponents/TableRow.vue';
    import TableHeader from '../components/BasicComponents/TableHeader.vue';
    import {useAddressbookState, useUserState, useChannelState, useGroupState} from '../store';
    import {useRoute, useRouter} from 'vue-router';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    import type { Channel, ChannelDetail, ChannelType} from '../../../types';
    import FloatingModal from '../components/BasicComponents/FloatingModal.vue';
    import FormInput from '../components/BasicComponents/FormInput.vue';
    import SearchableSelect from '../components/BasicComponents/SearchableSelect.vue';

    onMounted(() => channelState.dispatch('retrieveChannels', selectedAddressbookEntryId as string));

    const route = useRoute();
    const router = useRouter();
    const addressbookState = useAddressbookState();
    const channelState = useChannelState();
    const groupState = useGroupState();
    const userState = useUserState();
    const showModalNewChannel = ref(false);

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

    const updatedLabel = ref('');
    const updatedDescription = ref('');
    const updatedUser = ref('');
    const updatedOperation = ref('');

    const newChannelLabel = ref('');
    var newChannelType:ChannelType;
    const newChannelPrio = 0;
    const newChannelMinImprotance = 0;
    var newChannelDetails:ChannelDetail;
    const newChannelTimeout = 0;
    const newChannelDetailsValue = ref('');

    if(selectedAddressbookEntry) {
        updatedLabel.value = selectedAddressbookEntry.label;
        updatedDescription.value = selectedAddressbookEntry.description;
        updatedUser.value = selectedAddressbookEntry.user ? selectedAddressbookEntry.user : '';
        updatedOperation.value = selectedAddressbookEntry.operation ? selectedAddressbookEntry.description : '';
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
    }
    async function createNewChannel() {
        if(newChannelLabel.value != '' && newChannelPrio>0 && newChannelMinImprotance>0 && newChannelTimeout>0 && newChannelDetails && newChannelType){
            const newChannel:Channel = {
                id: '',
                entry : selectedAddressbookEntryId as string,
                label : newChannelLabel.value,
                priority : newChannelPrio,
                min_importance : newChannelMinImprotance,
                timeout : newChannelTimeout,
                type : newChannelType,
                details : newChannelDetails,
            };
            var channelsList:Channel[] = [newChannel];
            channels.value().forEach(x => channelsList.concat(x));
            channelState.dispatch('setChannels', {entryId: (selectedAddressbookEntryId as string), channels: channelsList});
            showModalNewChannel.value = false; 
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
</script>