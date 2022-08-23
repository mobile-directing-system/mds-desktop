<template>
  <Multiselect 
    :classes="{
      containerActive: 'ring ring-primary_light ring-opacity-30',
      tag: 'bg-primary_superlight text-white text-sm font-semibold py-0.5 pl-2 rounded mr-1 mb-1 flex items-center whitespace-nowrap rtl:pl-0 rtl:pr-2 rtl:mr-0 rtl:ml-1',
    }"
    v-bind="$attrs"
    searchable
    hide-selected
    :mode="props.mode"
    :filterResults="false"
    :options="props.options"
    :label="props.label"
    :value-prop="props.valueProp"
    :track-by="props.trackBy"
    :placeholder="props.placeholder"
  />
</template>

<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import Multiselect from '@vueform/multiselect';

  interface Props {
    mode: 'tags' | 'multiple' | 'single';
    placeholder: string;
    label:string;
    trackBy: string;
    valueProp: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any[];
  }

  const props = defineProps<Props>();
</script>
<style src="@vueform/multiselect/themes/default.css"></style>