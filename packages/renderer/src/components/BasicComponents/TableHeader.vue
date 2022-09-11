<template>
  <tr v-bind="$attrs">
    <th
      v-for="colNum in props.numOfCols"
      :key="colNum"
      class="p-2"
    >
      <!-- Dynamic Slots for Table Header Content -->
      <slot
        :name="`header${colNum}`" 
      />
    </th>
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
   * This component provides a <tr> with numOfCols many <th>. All passed attrtibutes,
   * which are not props, are inherited by the <tr>.
   */

  interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    numOfCols: number; // This props defined how many colmuns are in the table
  }

  const props = defineProps<Props>();

</script>