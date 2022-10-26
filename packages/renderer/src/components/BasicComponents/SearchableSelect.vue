<template>
  <!-- Multiselect Component -->
  <Multiselect 
    :classes="{
      containerActive: 'ring ring-primary_light ring-opacity-30',
      tag: 'bg-primary_superlight text-white text-sm font-semibold py-0.5 pl-2 rounded mr-1 mb-1 flex items-center whitespace-nowrap rtl:pl-0 rtl:pr-2 rtl:mr-0 rtl:ml-1',
      optionSelected: 'bg-primary text-on_primary',
      optionSelectedPointed: 'bg-primary_light text-on_primary_light',
    }"
    v-bind="$attrs"
    searchable
    hide-selected
    :mode="props.mode"
    :filterResults="props.filterResults"
    :options="props.options"
    :label="props.label"
    :value-prop="props.valueProp"
    :track-by="props.trackBy"
    :placeholder="props.placeholder"
    @search-change="debouncedHandleSelectionInput"
  />
</template>

<script lang="ts">
  /** script tag to disable default attribute inheritance
   * so that v-bind="$attrs" works. Needs an extra script tag
   * as it can't be done in script setup tags
   */
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>

  /**
   * This component provides a wrapper around a vueform/multiselect to adjust The look of the
   * dependency to the look of the app at large, to add debounce to the search and to add props
   * for configuring the multiselect component. All props and events of the multiselect not
   * handled by the wrapper can be used with the wrapper as mentioned in the multiselect documentation
   * All passed attributes, which are not props, are inherited by the multiselect component.
   * WARNING
   * The underlying multiselect component uses the options list to display selected options. This
   * means that if the v-model is changed programatically the options list needs to contain the new
   * selections and they need to be rendered already. Because of this it is not possible to set the
   * options list and then immediatley set the v-model. This can be solved by putting the updating
   * of the v-model inside a setTimeout with durartion of 0.
   * WARNING
   * options must be an array.
   */

  import Multiselect from '@vueform/multiselect';
  import { debounce } from 'lodash';

  interface Props {
    mode: 'tags' | 'multiple' | 'single';   // Select the mode for the multiselect
    placeholder: string;                    // Placeholder string for the multiselect
    label?:string;                           // If options are objects, this string defines what object property is shown in the options list
    trackBy?: string;                        // If options are objects, this string defines what object property is searched
    valueProp?: string;                      // If options are objects, this string defines what object property is used as value for selected options
    filterResults: boolean;                  // Disable builtin filtering of the options using the query string, to provide custom filtering yourself
    debounce?: number;                      // Defines the debouce time
    maxWait?: number;                       // Defines the maxWait during debounce
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any[];                         // Defines the options that are shown in the options list. Must be an array
  }

  const defaultDebounceTime = 200;
  const defaultMaxWaitTime = 200;
  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'search-change', query: string, select: Multiselect): void
  }>();

  /**
   * handler which is called every time the user types in the search field.
   * But it is not used directly only through the debounce wrapper
   * @param query search string
   * @param select the select component
   */
  function handleSelectionInput(query: string, select: Multiselect):void {
    emit('search-change', query, select);
  }

  // debounced input selection handler wrapper
  const debouncedHandleSelectionInput = debounce(handleSelectionInput, props.debounce? props.debounce : defaultDebounceTime, {'maxWait': props.maxWait? props.maxWait : defaultMaxWaitTime});



</script>
<style src="@vueform/multiselect/themes/default.css"></style>