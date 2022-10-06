<template>
  <div>
    <div class=" bg-background ml-4 rounded-lg  my-10 w-max">
      <header class=" max-w-lg pb-10">
        <h1 class="  text-left text-4xl font-bold text-on_background">
          Create new Intel
        </h1>        
      </header>
      <main>
        <div>
          <div
            v-if="currentStep===0"
          >
            <div>
              <span class=" text-lg m-4">Select the Intel type:</span>
            </div>
            <div class=" m-4">
              <NormalButton
                @click.prevent="currentStep++; selectedIntelTypeValue = 'analog-radio-message'"
              >
                Analog Radio Message
              </NormalButton>  
            </div>
            <div class=" m-4">
              <NormalButton
                @click.prevent="currentStep++; selectedIntelTypeValue = 'plaintext-message'"
              >
                Plaintext Message
              </NormalButton>  
            </div>
          </div>
          <div>
            <div
              v-if="currentStep===1"
            >
              <!-- Addressbook Selection -->
              <AddressBookSelection 
                id="Address-book-selection"
                v-model="addressbookIDs"
              />
              <NormalButton
                v-if="addressbookIDs.length >0"
                @click.prevent="currentStep++"
              >
                Next
              </NormalButton>
            </div>
          </div>
          <div
            v-if="currentStep===2"
          >
            <SearchableSelect
              v-model="selectedOperationId"
              mode="single"
              :options="operationsSearchResultsArray"
              placeholder="Select an operation"
              label="title"
              value-prop="id"
              :filter-results="false"
              class="mb-3"
              @search-change="handleOperationSelectionInput"
              @open="handleOperationSelectionInput('')"
            />
            <div>
              <div
                v-if="!userIsMember"
                class="bg-error_superlight border-2 w-100 mb-6 p-1 border-error_dark text-on_error_superlight rounded"
              >
                You must be a member of the selected operation to continue.
              </div>
              <NormalButton
                v-if="selectedOperationId !='' && userIsMember"
                @click.prevent="currentStep++"
              >
                Next
              </NormalButton>
            </div>
          </div>
          <div
            v-if="currentStep===3"
          >
            <div class=" text-lg m-4">
              <span>Select the Importance:</span>
            </div>
            <div class=" m-4">
              <NormalButton
                @click.prevent="currentStep++; Importance = 'Standard'"
              >
                Standard
              </NormalButton>  
            </div>
            <div class=" m-4">
              <NormalButton
                @click.prevent="currentStep++; Importance = 'Instant'"
              >
                Instant
              </NormalButton>
            </div>
            <div class=" m-4">
              <NormalButton
                @click.prevent="currentStep++; Importance = 'Lightning'"
              >
                Lightning
              </NormalButton>
            </div>
            <div class=" m-4">
              <NormalButton
                @click.prevent="currentStep++; Importance = 'Catastrophe'"
              >
                Catastrophe
              </NormalButton>
            </div>
          </div>  
          <div
            v-if="currentStep===4"
          >
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
            <NormalButton
              v-if="((selectedIntelTypeValue == 'plaintext-message' && plaintextContent != '') 
                || (selectedIntelTypeValue == 'analog-radio-message' 
                  && analogRadioMessageCallsign != '' 
                  && analogRadioMessageChannel != '' 
                  && analogRadioMessageContent != '' 
                  && analogRadioMessageHead != ''))" 
              @click.prevent="currentStep++"
            >
              Next
            </NormalButton>
          </div>
          <div 
            v-if="currentStep===5"
            class="flex"
          >
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
              <div
                v-if="!userIsMember"
                class="bg-error_superlight border-2 w-100 mb-6 p-1 border-error_dark text-on_error_superlight rounded"
              >
                You must be a member of the selected operation to continue.
              </div>
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
              && (addressbookIDs.length >0)
              && currentStep ==5
              && userIsMember"
            @click.prevent="createIntel()"
          >
            Send
          </NormalButton>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {ref, onMounted, computed, watch} from 'vue';
  import { useAddressbookState, useOperationsState, useIntelState, useLoginState } from '../store';
  import type { PlainTextContent, RadioContent, Intel} from '../../../types';  
  import type { IntelType } from '../constants';
  import FormInput from '../components/BasicComponents/FormInput.vue';
  import AddressBookSelection from '../components/AddressBookSelection.vue';
  import SearchableSelect from '../components/BasicComponents/SearchableSelect.vue';
  import type {Ref} from 'vue';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';

  const addressbookState = useAddressbookState();
  const operationsState = useOperationsState();
  const intelState = useIntelState();
  const loginState = useLoginState();
  const selectedIntelTypeValue = ref('');
  var selectedIntelType:IntelType;
  const selectedOperationId = ref('');
  const addressbookIDs: Ref<string[]> = ref([]);
  const Importance = ref('');
  const userIsMember = ref(true); 
  const currentUserId = loginState.getters.loggedInUserId();

  const plaintextContent = ref('');
  const analogRadioMessageContent = ref('');
  const analogRadioMessageHead = ref('');
  const analogRadioMessageCallsign = ref(''); 
  const analogRadioMessageChannel = ref('');

  const currentStep = ref(0);

  const operationsSearchResults = computed(() => operationsState.getters.searchResults);
  const operationsSearchResultsArray = computed(() => {
    return InterableIteratorToArray(operationsSearchResults.value().values());
  });
  const operationMembers = computed(() => operationsState.getters.members);

  onMounted(() =>{
    addressbookState.dispatch('retrieveEntries', {amount: 100});
    operationsState.dispatch('retrieveOperations', {amount: 100});
  });

  watch(selectedOperationId, async (curVal) => {
    if(curVal) {
        await operationsState.dispatch('retrieveOperationMembersById', curVal);
        userIsMember.value = isCurrentUserMember();
        console.log(userIsMember.value);
    }
  });
  
  function isCurrentUserMember():boolean{
    console.log( operationMembers.value().get(selectedOperationId.value));
    console.log(currentUserId);
    const membersForSelected = operationMembers.value().get(selectedOperationId.value);
    if(membersForSelected){
      return membersForSelected.filter(x => x === currentUserId).length>0? true: false;
    }else{
      return false;
    }
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
    currentStep.value = 0;
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

