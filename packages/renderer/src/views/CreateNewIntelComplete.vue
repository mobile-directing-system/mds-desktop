<template>
  <div>
    <div class=" bg-background ml-4 rounded-lg  my-10 w-max">
      <header class=" max-w-lg pb-10">
        <h1 class="  text-left text-4xl font-bold text-on_background">
          Create new Intel
        </h1>        
      </header>
      <main>
        <div class="flex">
          <div class="m-4 w-80">
            <!-- Intel Type -->
            <SearchableSelect
              v-model="selectedIntelTypeValue"
              mode="single"
              :options="['analog-radio-message', 'plaintext-message']"
              :placeholder="'Intel type:'"
              label="Select the Intel type"
              :filter-results="true"
              class="mb-3 w-50"
            />
        
            <!-- Addressbook Selection -->
            <AddressBookSelection 
              v-if="selectedIntelTypeValue !=''"
              id="Address-book-selection"
              v-model="addressbookIDs"
            />
            <SearchableSelect
              v-if="selectedIntelTypeValue !=''"
              v-model="selectedOperationId"
              mode="single"
              :options="operationsSearchResultsArray"
              placeholder="Select an operation"
              label="title"
              value-prop="id"
              :filter-results="false"
              @search-change="handleOperationSelectionInput"
              @open="handleOperationSelectionInput('')"
            />
            <SearchableSelect
              v-if="selectedIntelTypeValue !=''"
              v-model="Importance"
              mode="single"
              :options="['Standard', 'Instant', 'Lightning', 'Catastrophe']"
              :placeholder="'Importance:'"
              label="Select the importance"
              :filter-results="true"
              class="mb-3 w-50 mt-6"
            />
          </div>
          <div class="m-4">
            <!-- Content -->
            <!-- Analog-radio-message content -->
            <div 
              v-if="selectedIntelTypeValue === 'analog-radio-message'"
            >
              <FormInput
                id="channel"
                v-model="analogRadioMessageChannel"
                div-class="w-80"
                label="Recieved over channel"
              />
              <FormInput
                id="callsign"
                v-model="analogRadioMessageCallsign"
                div-class="w-80"
                label="Sender callsign"
              />
              <FormInput
                id="head"
                v-model="analogRadioMessageHead"
                div-class="w-80"
                label="Message head"
              />
              <textarea
                id="plaintextConent"
                v-model="analogRadioMessageContent"
                class="w-80"
                placeholder="Enter message content here:"
                rows="10"
              />
            </div>
            <!-- Plaintext content -->
            <textarea
              v-if="selectedIntelTypeValue === 'plaintext-message'"
              id="plaintextConent"
              v-model="plaintextContent"
              class="w-80"
              placeholder="Enter message content here:"
              rows="10"
            />
          </div>
        </div>
        <NormalButton
          v-if="((selectedIntelTypeValue == 'plaintext-message' && plaintextContent != '') 
            || (selectedIntelTypeValue == 'analog-radio-message' 
              && analogRadioMessageCallsign != '' 
              && analogRadioMessageChannel != '' 
              && analogRadioMessageContent != '' 
              && analogRadioMessageHead != '')) 
            && (selectedOperationId != '') 
            && (addressbookIDs.length >0)"
          @click="showConfirmModal=true"
        >
          Send
        </NormalButton>
      </main>
      <!-- Confirm Send Modal -->
      <FloatingModal
        :show-modal="showConfirmModal"
        :title="'Confirm to send intel'"
        class="p-10 text-xl"
        @click="toggleShowSendModal()"
      >
        <span> Confirm to send Intel </span>
        <NormalButton
          @click="createIntel()"
        >
          Send
        </NormalButton>
      </FloatingModal>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {ref, onMounted, computed} from 'vue';
  import { useAddressbookState, useOperationsState, useIntelState } from '../store';
  import type { PlainTextContent, RadioContent, Intel, IntelType} from '../../../types';  
  import FormInput from '../components/BasicComponents/FormInput.vue';
  import AddressBookSelection from '../components/AddressBookSelection.vue';
  import SearchableSelect from '../components/BasicComponents/SearchableSelect.vue';
  import type {Ref} from 'vue';
  import FloatingModal from '../components/BasicComponents/FloatingModal.vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';

  const addressbookState = useAddressbookState();
  const operationsState = useOperationsState();
  const intelState = useIntelState();
  const selectedIntelTypeValue = ref('');
  var selectedIntelType:IntelType;
  const selectedOperationId = ref('');
  const addressbookIDs: Ref<string[]> = ref([]);
  const Importance = ref('');
  const showConfirmModal = ref(false);

  const plaintextContent = ref('');
  const analogRadioMessageContent = ref('');
  const analogRadioMessageHead = ref('');
  const analogRadioMessageCallsign = ref(''); 
  const analogRadioMessageChannel = ref('');

  const operationsSearchResults = computed(() => operationsState.getters.searchResults);
  const operationsSearchResultsArray = computed(() => {
    return InterableIteratorToArray(operationsSearchResults.value().values());
  });


  onMounted(() =>{
    addressbookState.dispatch('retrieveEntries', {amount: 100});
    operationsState.dispatch('retrieveOperations', {amount: 100});
  });
  
  function toggleShowSendModal(){
    showConfirmModal.value = false;
  }
  function createIntel(){
    selectedIntelType = selectedIntelTypeValue.value as IntelType;
    if(selectedIntelType){
      var content:PlainTextContent|RadioContent = (selectedIntelType == 'analog-radio-message')? {
          channel: analogRadioMessageChannel.value,
          callsign: analogRadioMessageCallsign.value,
          head: analogRadioMessageHead.value,
          content: analogRadioMessageContent.value,
        }:{
          text: plaintextContent.value,
        }; 
      const intelToCreate:Intel = {
        id: '',
        created_at: new Date(1995),
        created_by: '', 
        search_text:'',
        is_valid: true,
        operation: selectedOperationId.value,
        type: selectedIntelType,
        content: content,
        importance: (Importance.value == 'Standard'? 1000: (Importance.value == 'Instant'?2000:(Importance.value == 'Lightning'?3000:(Importance.value == 'Catastrophe'?4000:  0)))),
        initial_deliver_to: addressbookIDs.value as string[], 
      };
      intelState.dispatch('createIntel',intelToCreate);
      clearValues();
      toggleShowSendModal();
    }
  }
  function clearValues(){
    selectedIntelTypeValue.value='';
    plaintextContent.value='';
    analogRadioMessageChannel.value='';
    analogRadioMessageCallsign.value='';
    analogRadioMessageHead.value='';
    analogRadioMessageContent.value=''; 
    selectedOperationId.value = '';
    Importance.value = '';
    addressbookIDs.value = [];
   }

  function handleOperationSelectionInput(query: string) {
    operationsState.dispatch('searchOperationsByQuery', {query, limit:10});
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

