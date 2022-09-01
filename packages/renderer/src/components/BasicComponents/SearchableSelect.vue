<template>
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
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import Multiselect from '@vueform/multiselect';
  import { debounce } from 'lodash';

  interface Props {
    mode: 'tags' | 'multiple' | 'single';
    placeholder: string;
    label?:string;
    trackBy?: string;
    valueProp?: string;
    filterResults: boolean;
    debounce?: number;
    maxWait?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any[];
  }

  const defaultDebounceTime = 200;
  const defaultMaxWaitTime = 200;
  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'search-change', query: string, select: Multiselect): void
  }>();

  function handleSelectionInput(query: string, select: Multiselect):void {
    emit('search-change', query, select);
  }

  const debouncedHandleSelectionInput = debounce(handleSelectionInput, props.debounce? props.debounce : defaultDebounceTime, {'maxWait': props.maxWait? props.maxWait : defaultMaxWaitTime});



</script>
<style src="@vueform/multiselect/themes/default.css"></style>