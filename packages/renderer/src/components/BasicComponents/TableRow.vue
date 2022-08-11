<template>
  <tr
    class="border-b-2 border-b-gray-500 bg-white text-black hover:bg-primary_light cursor-pointer"
    v-bind="$attrs"
    @click="$emit('click', props.identifier)"
  >      
    <td 
      v-for="colNum in props.numOfCols"
      :key="colNum"
    >
      <!-- slots for table data -->
      <slot
        :name="`data${colNum}`"
        :entity="props.entity"
      />
    </td>
  </tr> 
</template>

<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>

  interface Props {
    numOfCols: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    identifier: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: any;
  }

  const props = defineProps<Props>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const emit = defineEmits<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (name: 'click', entityId: any): void
  }>();

</script>