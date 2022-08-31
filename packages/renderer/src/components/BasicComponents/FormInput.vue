<template>
  <div :class="props.overwrite? props.divClass : props.divClass? 'mb-6 bg-background ' + props.divClass : 'mb-6 bg-background'">
    <label 
      v-if="props.label !== undefined"
      :for="props.id"
      :class="props.overwrite? props.labelClass : props.labelClass? 'block mb-2 text-sm font-medium text-on_background ' + props.labelClass : 'block mb-2 text-sm font-medium text-on_background'"
    >{{ props.label }}</label>
    <input 
      :value="props.modelValue" 
      v-bind="$attrs"
      :class="props.overwrite? '' : 'bg-surface_superlight border border-surface_dark text-on_surface_superlight text-sm rounded-lg focus:ring-primary_light focus:border-primary_light block w-full p-2.5 invalid:bg-error_superlight invalid:text-on_error_superlight invalid:border-error_dark'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>

<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>

  interface Props {
    modelValue: string|number;
    id?: string;
    label?: string;
    divClass?: string;
    labelClass?: string;
    overwrite?: boolean;
  }
  const props = defineProps<Props>();

  defineEmits<{
    (name: 'update:modelValue', value:string|number ): void
  }>();

</script>