<template>
  <!-- Mailbox Component -->
  <div
    class="mailbox-container"
  >
    <!-- Mailbox Table -->
    <!-- Displayed when NO intel is selected -->
    <div
      v-if="selectedIntel === ''"
      class="overflow-x-hidden"
    >
      <!-- Table Component is not used here as we need custom definition which is cumbersome to add and use if added to the Table Component -->
      <div class="table-fixed">
        <table class="w-full">
          <tbody>
            <tr
              v-for="data in intelPage().values()"
              :key="data.id"
              class="border-b-2 border-b-surface_dark cursor-pointer hover:bg-surface_light hover:text-on_surface_light"
              @click="selectedIntel = data.id"
            >
              <!-- Creator Column -->
              <td class="table-data1">
                <div class="mr-5 my-2.5 font-medium">
                  {{ users().get(data.created_by)?.username }}
                </div>
              </td>
              <!-- Intel Short Form Column -->
              <td class="table-data2 my-2.5">
                {{ printIntelHeading(data) }}
              </td>
              <!-- Creation Date Column -->
              <td class="table-data3 my-2.5">
                <div class="ml-5 font-medium">
                  {{ printDate(data.created_at) }}
                </div>
              </td>
              <!-- Intel Type Column -->
              <td class="table-data5 my-2.5">
                <div class="ml-5">
                  {{ printType(data) }}
                </div>
              </td>
              <!-- Intel Importance Column -->
              <td class="table-data4 my-2.5">
                <div class="ml-5 font-medium">
                  {{ printImportance(data) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination Bar for the Mailbox Table -->
        <PaginationBar
          id="incoming-intel-table-pagination"
          :total-retrievable-entities="intelTotal()"
          :page-size="10"
          @update-page="updatePage($event.amount, $event.offset)"
        />
      </div>
    </div>
    <!-- Message Display Div -->
    <!-- Displayed if intel IS selected -->
    <div
      v-if="selectedIntel !== ''"
      class="overflow-x-hidden"
    >
      <!-- Intel Meta Data Heading -->
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
      <!-- Display Message Content -->
      <div
        class="mb-2 pb-2 border-b-2 border-b-surface_dark"
      >
        <!-- Content of Plaintext Messages -->
        <span v-if="intel().get(selectedIntel)?.type === IntelType.plaintext_message">{{ printIntelContent(intel().get(selectedIntel)) }}</span>
        <!-- Formatted Content of Analog Radio Messages -->
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
      <!-- Leave Message View Buttons -->
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

  /**
   * This component provides two different views so that these two views and the functionality of switching between them can be
   * simply imported into a view to use it. The two views implemented in this component are the mailbox table with a paginated
   * list of intel and a view for displaying the intels or messages. Passed attributes, which are not props, to this component
   * are added to the surrounding .mailbox-container div.
   */

  import type { Intel, RadioContent, PlainTextContent } from '../../../types';
  import { IntelType } from '../constants';
  import { computed, watch, ref } from 'vue';
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

  // Retrieve user for creator id and associated operation for each intel on the page
  watch(intelPage.value(), (curVal) => {
    for(const intel of curVal.values()) {
      userState.dispatch('retrieveUserById', intel.created_by);
      operationsState.dispatch('retrieveOperation', intel.operation);
    }
  });

  // If a notification for a new intel is received update the current page
  watch(intelNotifications.value(), () => {
    if(cachedPageAmount !== undefined && cachedPageOffset !== undefined) {
      updatePage(cachedPageAmount, cachedPageOffset);
    }
  }, {deep: true});

  /**
   * functionto extract a preview string depending on the type of the passed intel
   * @param intel from which to extract the preview string
   * @returns preview string for the different intel types
   */
  function printIntelHeading(intel?: Intel):string {
    //if no intel is passed return empty string
    if(!intel) {
      return '';
    }
    let heading = '';

    if(intel.type === IntelType.analog_radio_message) {
      // set heading to analog radio message heading
      heading = (intel.content as RadioContent).head;
    } else if(intel.type === IntelType.plaintext_message) {
      // set heading to plaintext message content
      heading = (intel.content as PlainTextContent).text;
    }

    return heading;
  }

  /**
   * function to refresh the intel page on page changes
   * @param amount of intel to retrieve for the page
   * @param offset at which to start retrieveing intel
   */
  function updatePage(amount: number, offset: number) {
    cachedPageAmount = amount;
    cachedPageOffset = offset;
    intelState.dispatch('retrieveMultipleIntel', {amount, offset});
  }

  /**
   * function to extract the content depending on the intel types
   * @param intel intel from which to return the content
   * @returns content of the passed intel
   */
  function printIntelContent(intel?: Intel): string {
    // return empty string if no intel is passed
    if(intel === undefined) {
      return '';
    }
    if(intel.type === IntelType.analog_radio_message) {
      // return content of analog radio message as content
      return (intel.content as RadioContent).content;
    } else if(intel.type === IntelType.plaintext_message) {
      // return text of plaintext message as content
      return (intel.content as PlainTextContent).text;
    } else {
      // return fixed string if message type is not implemented
      return 'Content for this message type is not implemented';
    }
  }

  /**
   * function to extract the callsign of an intel
   * @param intel from which to extract the callsign
   * @returns the callsign of the passed analog radio message intel
   */
  function printIntelCallsign(intel?: Intel): string {
    // return empty string if no intel is passed
    if(!intel) {
      return '';
    }
    // return callsign of intel
    return (intel.content as RadioContent).callsign;
  }

  /**
   * function to extract the radio channel of an intel if it exists
   * @param intel from which to extract the radio channel
   * @returns teh radio channel of the passed intel
   */
  function printIntelChannel(intel?: Intel): string  {
    // return empty string if no intel is passed
    if(!intel) {
      return '';
    }
    // return radio channel of intel
    return (intel.content as RadioContent).channel;
  }

  /**
   * function to format a date correctly into a string
   * @param date which to return the format string from
   * @returns the formatted date string
   */
  function printDate(date?: Date): string {
    // return empty string if no date is passed
    if(!date) {
      return '';
    }

    // extract the correctly formated string parts
    const year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
    const month = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date);
    const day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
    const hour = new Intl.DateTimeFormat('en', {hour12: false, hour: '2-digit'}).format(date);
    let minute = new Intl.DateTimeFormat('en', {minute: '2-digit'}).format(date);

    // pad minute string to two digits if it is not
    if(minute.length === 1) {
      minute = `0${minute}`;
    }

    // return formatted date string assembled from the extracted parts
    return `${day}.${month}.${year} ${hour}:${minute}`;
  }

  /**
   * function to convert the importance of an intel to the  the correct corresponding string
   * @param intel from which to convert the importance to the importance string
   * @returns string corresponding to the importance of the passed intel
   */
  function printImportance(intel?: Intel): string {
    // return empty string when no intel is passed
    if(!intel) {
      return '';
    }
    // Switch between the different strings depending on the importance number
    // The frontend only generates these numbers when creating intel
    if(intel.importance === 1000) {
      return 'Standard';
    } else if (intel.importance === 2000) {
      return 'Instant';
    } else if (intel.importance === 3000) {
      return 'Lightning';
    } else if (intel.importance === 4000) {
      return 'Catastrophe';
    } else {
      // If somehow the importance is none of the numbers above return an empty string for the importance
      return '';
    }
  }

  /**
   * function to convert type of an intel to corresponding type string
   * @param intel from which to convert the type to the type string
   * @returns a string corresponding to the type of the passed intel
   */
  function printType(intel?: Intel): string {
    // return empty string when no intel is passed
    if(!intel) {
      return '';
    }
    // Switch between the different implemented intel types
    // if an unimplemented intel type is present return empty string
    if(intel.type === IntelType.plaintext_message) {
      return 'Plaintext Message';
    } else if (intel.type === IntelType.analog_radio_message) {
      return 'Analog Radio Message';
    } else {
      return '';
    }
  }

  /**
   * function to extract the recipient of an intel by getting the title of the associated operation
   * @param intel from which to extract the recipient
   * @returns the title of the associated operation of the passed intel as recipient
   */
  function printRecipient(intel?: Intel):string {
    // return empty string when no intel is passed
    if(!intel) {
      return '';
    }
    // get and return the operation title as the recipient
    // if no operations title can be found return an empty string
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