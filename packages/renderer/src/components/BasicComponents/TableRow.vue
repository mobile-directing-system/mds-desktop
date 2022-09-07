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
      <!-- Dynamic Slots for Table Data -->
      <slot
        :name="`data${colNum}`"
        :data="props.rowData"
      />
    </td>
  </tr> 
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
   * This component provides <tr> with numOfCols many <td>. All passed
   * attributes, which are not props, are inherited by the <tr>.
   */

  interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowData: any;           // contains the data item to be renderer in this row
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    identifier?: any;       // contains the identifier to be returned when the row is clicked
    numOfCols: number;      // defines the number of columns of the table
    tDataClass?: string;    // defines the class string to be added to each <td>
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (name: 'click', entityId: any): void // event emitted when the <tr> is clicked. Returns the identifier associated with the row.
  }>();

  /**
   * Click handler for click on the Table Row
   */
  function clickHandler() {
    // only emit click event if an identifier was provided
    if(props.identifier) {
      emit('click', props.identifier);
    }
  }

</script>