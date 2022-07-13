<template>
  <div class="mb-6 bg-background">
    <label 
      v-if="props.label !== undefined"
      :for="props.id"
      class="block mb-2 text-sm font-medium text-on_background"
    >{{ props.label }}</label>
    <input 
      :value="props.modelValue" 
      v-bind="$attrs"
      class="bg-surface_superlight border border-surface_dark text-on_surface_superlight text-sm rounded-lg focus:ring-primary_light focus:border-primary_light block w-full p-2.5"
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
  }
  const props = defineProps<Props>();

  defineEmits<{
    (name: 'update:modelValue', value:string|number ): void
  }>();

</script>