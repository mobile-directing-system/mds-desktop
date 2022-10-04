<template>
  <div>
    <div
      v-if="selectedIntel === ''"
      class="overflow-x-hidden"
    >
      <TableContainer
        id="incoming-intel-table"
        :contents="intelPage().values()"
        id-identifier="id"
      >
        <template #tableRow="{rowData}:{rowData:Intel}">
          <TableRow
            :row-data="rowData"
            :num-of-cols="3"
            :identifier="rowData.id"
            @click="selectedIntel = $event"
          >
            <template #data1="{data}:{data:Intel}">
              {{ users().get(data.created_by)?.username }}
            </template>
            <template #data2="{data}:{data:Intel}">
              <div
                class=""
              >
                {{ printIntelHeading(data) }}
              </div>
            </template>
            <template #data3="{data}:{data:Intel}">
              {{ printDate(data.created_at) }}
            </template>
          </TableRow>
        </template>
      </TableContainer>
      <PaginationBar
        id="incoming-intel-table-pagination"
        class="mr-10"
        :total-retrievable-entities="intelTotal()"
        :page-size="10"
        @update-page="updatePage($event.amount, $event.offset)"
      />
    </div>
    <div
      v-if="selectedIntel !== ''"
      class="overflow-x-hidden"
    >
      <div
        class="flex justify-between mb-2 border-b-2 border-b-surface_light"
      >
        <span>From: {{ users().get(intel().get(selectedIntel)?.created_by ?? '' )?.username }}</span>
        <span>At: {{ printDate(intel().get(selectedIntel)?.created_at) }}</span>
      </div>
      <div
        class="mb-2 border-b-2 border-b-surface_light"
      >
        <span>{{ printIntelContent(intel().get(selectedIntel)) }}</span>
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
  import { useIntelState, useInAppNotificationState, useUserState } from '../store';
  import TableContainer from './BasicComponents/TableContainer.vue';
  import TableRow from './BasicComponents/TableRow.vue';
  import PaginationBar from './BasicComponents/PaginationBar.vue';
  import NormalButton from './BasicComponents/NormalButton.vue';

  const intelState = useIntelState();
  const notificationState = useInAppNotificationState();
  const userState = useUserState();

  const intelPage = computed(() => intelState.getters.page);
  const intel = computed(() => intelState.getters.intel);
  const intelTotal = computed(() => intelState.getters.total);
  const intelNotifications = computed(()=> notificationState.getters.intelNotifications);
  const users = computed(() => userState.getters.users);

  const selectedIntel = ref('');

  let cachedPageAmount: number|undefined = undefined;
  let cachedPageOffset: number|undefined = undefined;

  onMounted(() => {
    //intelState.dispatch('retrieveMultipleIntel', {amount: 20, offset: 0});
  });

  watch(intelPage.value(), (curVal) => {
    for(const intel of curVal.values()) {
      userState.dispatch('retrieveUserById', intel.created_by);
    }
  });

  watch(intelNotifications.value(), () => {
    if(cachedPageAmount && cachedPageOffset) {
      updatePage(cachedPageAmount, cachedPageOffset);
    }
  });

  function printIntelHeading(intel: Intel):string {
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

  function printDate(date: Date|undefined): string {
    if(!date) {
      return '';
    }
    const year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
    const month = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date);
    const day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
    const hour = new Intl.DateTimeFormat('en', {hour12: false, hour: '2-digit'}).format(date);
    const minute = new Intl.DateTimeFormat('en', {minute: '2-digit'}).format(date);
    return `${day}.${month}.${year} ${hour}:${minute}`;
  }

</script>