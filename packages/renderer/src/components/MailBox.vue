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
                <div class="mr-5">
                  {{ users().get(data.created_by)?.username }}
                </div>
              </td>
              <td class="table-data2">
                {{ printIntelHeading(data) }}
              </td>
              <td class="table-data3">
                <div class="ml-5">
                  {{ printDate(data.created_at) }}
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
        class="flex justify-between mb-2 border-b-2 border-b-surface_dark"
      >
        <span>From: {{ users().get(intel().get(selectedIntel)?.created_by ?? '' )?.username }}</span>
        <span>At: {{ printDate(intel().get(selectedIntel)?.created_at) }}</span>
      </div>
      <div
        class="mb-2 border-b-2 border-b-surface_dark"
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
    let minute = new Intl.DateTimeFormat('en', {minute: '2-digit'}).format(date);
    if(minute.length === 1) {
      minute = `0${minute}`;
    }
    return `${day}.${month}.${year} ${hour}:${minute}`;
  }

</script>
<style scoped>
  .mailbox-container {
  }
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
  .table-ellipsis {
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>