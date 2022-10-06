<template>
  <div
    class="mailbox-container"
  >
    <div
      v-if="selectedIntel === ''"
      class="overflow-x-hidden"
    >
      <div class="table-fixed">
        <table class="w-full">
          <tbody>
            <tr
              v-for="data in intelPage().values()"
              :key="data.id"
              class="border-b-2 border-b-surface_dark cursor-pointer hover:bg-surface_light hover:text-on_surface_light"
              @click="selectedIntel = data.id"
            >
              <td class="table-data1">
                <div class="mr-5 my-2.5 font-medium">
                  {{ users().get(data.created_by)?.username }}
                </div>
              </td>
              <td class="table-data2 my-2.5">
                {{ printIntelHeading(data) }}
              </td>
              <td class="table-data3 my-2.5">
                <div class="ml-5 font-medium">
                  {{ printDate(data.created_at) }}
                </div>
              </td>
              <td class="table-data5 my-2.5">
                <div class="ml-5">
                  {{ printType(data) }}
                </div>
              </td>
              <td class="table-data4 my-2.5">
                <div class="ml-5 font-medium">
                  {{ printImportance(data) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <PaginationBar
          id="incoming-intel-table-pagination"
          :total-retrievable-entities="intelTotal()"
          :page-size="10"
          @update-page="updatePage($event.amount, $event.offset)"
        />
      </div>
    </div>
    <div
      v-if="selectedIntel !== ''"
      class="overflow-x-hidden"
    >
      <div
        class="flex-row pb-2 mb-10 border-b-2 border-b-surface_dark"
      >
        <div class="w-full flex justify-between ">
          <span>From: {{ users().get(intel().get(selectedIntel)?.created_by ?? '' )?.username }}</span>
          <span>At: {{ printDate(intel().get(selectedIntel)?.created_at) }}</span>
        </div>
        <div class="w-full flex justify-between ">
          <span>To: {{ printRecipient(intel().get(selectedIntel)) }}</span>
          <span>Importance: {{ printImportance(intel().get(selectedIntel)) }}</span>
          <span>Type: {{ printType(intel().get(selectedIntel)) }}</span>
        </div>
      </div>
      <div
        class="mb-2 pb-2 border-b-2 border-b-surface_dark"
      >
        <span v-if="intel().get(selectedIntel)?.type === IntelType.plaintext_message">{{ printIntelContent(intel().get(selectedIntel)) }}</span>
        <div
          v-if="intel().get(selectedIntel)?.type === IntelType.analog_radio_message"
          class="flex justify-between mb-2"
        >
          <span v-if="intel().get(selectedIntel)?.type === IntelType.analog_radio_message">{{ `Callsign: ${printIntelCallsign(intel().get(selectedIntel))}` }}</span>
          <span v-if="intel().get(selectedIntel)?.type === IntelType.analog_radio_message">{{ `Channel: ${printIntelChannel(intel().get(selectedIntel))}` }}</span>
        </div>
        <span 
          v-if="intel().get(selectedIntel)?.type === IntelType.analog_radio_message"
          class="block mb-2"
        >{{ `Subject: ${printIntelHeading(intel().get(selectedIntel))}` }}</span>
        <span v-if="intel().get(selectedIntel)?.type === IntelType.analog_radio_message">{{ printIntelContent(intel().get(selectedIntel)) }}</span>
      </div>
      <div>
        <NormalButton
          @click.prevent="selectedIntel = ''"
        >
          Cancel
        </NormalButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

  import type { Intel, RadioContent, PlainTextContent } from '../../../types';
  import { IntelType } from '../constants';
  import { computed, onMounted, watch, ref } from 'vue';
  import { useIntelState, useInAppNotificationState, useUserState, useOperationsState } from '../store';
  import PaginationBar from './BasicComponents/PaginationBar.vue';
  import NormalButton from './BasicComponents/NormalButton.vue';

  const intelState = useIntelState();
  const notificationState = useInAppNotificationState();
  const userState = useUserState();
  const operationsState = useOperationsState();

  const intelPage = computed(() => intelState.getters.page);
  const intel = computed(() => intelState.getters.intel);
  const intelTotal = computed(() => intelState.getters.total);
  const intelNotifications = computed(()=> notificationState.getters.intelNotifications);
  const users = computed(() => userState.getters.users);
  const operations = computed(() => operationsState.getters.operations);

  const selectedIntel = ref('');

  let cachedPageAmount: number|undefined = undefined;
  let cachedPageOffset: number|undefined = undefined;

  onMounted(() => {
    //intelState.dispatch('retrieveMultipleIntel', {amount: 20, offset: 0});
  });

  watch(intelPage.value(), (curVal) => {
    for(const intel of curVal.values()) {
      userState.dispatch('retrieveUserById', intel.created_by);
      operationsState.dispatch('retrieveOperation', intel.operation);
    }
  });

  watch(intelNotifications.value(), () => {
    if(cachedPageAmount && cachedPageOffset) {
      updatePage(cachedPageAmount, cachedPageOffset);
    }
  });

  function printIntelHeading(intel?: Intel):string {
    if(!intel) {
      return '';
    }
    let heading = '';

    if(intel.type === IntelType.analog_radio_message) {
      heading = (intel.content as RadioContent).head;
    } else if(intel.type === IntelType.plaintext_message) {
      heading = (intel.content as PlainTextContent).text;
    }

    return heading;
  }

  function updatePage(amount: number, offset: number) {
    cachedPageAmount = amount;
    cachedPageOffset = offset;
    intelState.dispatch('retrieveMultipleIntel', {amount, offset});
  }

  function printIntelContent(intel?: Intel): string {
    if(intel === undefined) {
      return '';
    }
    if(intel.type === IntelType.analog_radio_message) {
      return (intel.content as RadioContent).content;
    } else if(intel.type === IntelType.plaintext_message) {
      return (intel.content as PlainTextContent).text;
    } else {
      return 'Content for this message type is not implemented';
    }
  }

  function printIntelCallsign(intel?: Intel): string {
    if(!intel) {
      return '';
    }
    return (intel.content as RadioContent).callsign;
  }

  function printIntelChannel(intel?: Intel): string  {
    if(!intel) {
      return '';
    }
    return (intel.content as RadioContent).channel;
  }

  function printDate(date?: Date): string {
    if(!date) {
      return '';
    }
    const year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
    const month = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date);
    const day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
    const hour = new Intl.DateTimeFormat('en', {hour12: false, hour: '2-digit'}).format(date);
    let minute = new Intl.DateTimeFormat('en', {minute: '2-digit'}).format(date);
    if(minute.length === 1) {
      minute = `0${minute}`;
    }
    return `${day}.${month}.${year} ${hour}:${minute}`;
  }

  function printImportance(intel?: Intel): string {
    if(!intel) {
      return '';
    }
    if(intel.importance === 1000) {
      return 'Standard';
    } else if (intel.importance === 2000) {
      return 'Instant';
    } else if (intel.importance === 3000) {
      return 'Lightning';
    } else if (intel.importance === 4000) {
      return 'Catastrophe';
    } else {
      return '';
    }
  }

  function printType(intel?: Intel): string {
    if(!intel) {
      return '';
    }
    if(intel.type === IntelType.plaintext_message) {
      return 'Plaintext Message';
    } else if (intel.type === IntelType.analog_radio_message) {
      return 'Analog Radio Message';
    } else {
      return '';
    }
  }

  function printRecipient(intel?: Intel):string {
    if(!intel) {
      return '';
    }
    const opTitle = operations.value().get(intel.operation)?.title;
    return opTitle ?? '';
  }

</script>
<style scoped>
  .table-data1 {
    white-space: nowrap;
  }
  .table-data2 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    max-width: 0;
  }
  .table-data3 {
    white-space: nowrap;
  }

  .table-data4 {
    white-space: nowrap;
  }

  .table-data5 {
    white-space: nowrap;
  }
</style>