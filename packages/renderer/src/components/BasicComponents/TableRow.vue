<template>
  <tr
    v-bind="$attrs"
    class="border-b-2 border-b-surface_superdark bg-white text-black hover:bg-primary_light cursor-pointer"
    @click="clickHandler"
  >      
    <td 
      v-for="colNum in props.numOfCols"
      :key="colNum"
      :class="tDataClass? tDataClass : 'p-2'"
    >
      <!-- slots for table data -->
      <slot
        :name="`data${colNum}`"
        :data="props.rowData"
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    identifier?: any;
    numOfCols: number;
    tDataClass?: string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (name: 'click', entityId: any): void
  }>();

  function clickHandler() {
    if(props.identifier) {
      emit('click', props.identifier);
    }
  }

</script>