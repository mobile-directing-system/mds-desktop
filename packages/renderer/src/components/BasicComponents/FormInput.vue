<template>
  <div :class="props.overwrite? props.divClass : props.divClass? 'mb-6 bg-background ' + props.divClass : 'mb-6 bg-background'">
    <!-- Label for Input -->
    <label 
      v-if="props.label !== undefined"
      :for="props.id"
      :class="props.overwrite? props.labelClass : props.labelClass? 'block mb-2 text-sm font-medium text-on_background ' + props.labelClass : 'block mb-2 text-sm font-medium text-on_background'"
    >{{ props.label }}</label>
    <!-- Form Input -->
    <input 
      :value="props.modelValue" 
      v-bind="$attrs"
      :class="props.overwrite? '' : 'bg-surface_superlight border border-surface_dark text-on_surface_superlight text-sm rounded-lg focus:ring-primary_light focus:border-primary_light block w-full p-2.5 invalid:bg-error_superlight invalid:text-on_error_superlight invalid:border-error_dark'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
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
   * It provides a container for an input in a HTML form with an optional associated label.
   * When a string for the label is provided it will be displayed, if no string is supplied
   * it is not rendered. All passed attributes which are not props are passed to the input
   * element and not the label element.
   */
  interface Props {
    modelValue: string|number;  // v-model representation
    id?: string;                // id for the input element and for attribute of the label
    label?: string;             // content for the label do display
    divClass?: string;          // classes to be appended or to overwrite the div's classes
    labelClass?: string;        // classes to be appended or to overwrite the label's classes
    overwrite?: boolean;        // changes behavior from append classes to overwrite classes
  }
  const props = defineProps<Props>();

  defineEmits<{
    (name: 'update:modelValue', value:string|number ): void // event to update v-model
  }>();

</script>