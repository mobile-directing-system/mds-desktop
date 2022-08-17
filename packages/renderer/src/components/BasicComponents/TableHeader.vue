<template>
  <tr v-bind="$attrs">
    <th
      v-for="colNum in props.numOfCols"
      :key="colNum"
      class="p-2"
    >
      <!-- slots for table headers -->
      <slot
        :name="`header${colNum}`" 
      />
    </th>
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
    numOfCols: number;
  }

  const props = defineProps<Props>();

</script>