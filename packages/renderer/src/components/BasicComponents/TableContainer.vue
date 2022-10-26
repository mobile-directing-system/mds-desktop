<template>
  <!-- Table Div -->
  <div class="table-fixed place-items-center mr-10">
    <!-- Table -->
    <table 
      v-bind="$attrs"
      class=" border-spacing-2 w-full rounded-md overflow-hidden m-4"
    >
      <!-- Table Header -->
      <thead class=" bg-blue-700 font-bold text-white text-l text-left text-lg">
        <!-- User-defined Table Headers -->
        <slot name="tableHeader" />
      </thead>
      <!-- Table Body -->
      <tbody class="text-left">
        <!-- User-defined Table Rows -->
        <slot
          v-for="entity in props.contents"
          :key="props.idIdentifier? entity[props.idIdentifier] : entity"
          :row-data="entity"
          name="tableRow"
        />
      </tbody>
    </table>
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
   * This component provides a <div> with the table class and a HTML <table>. All passed attributes,
   * which are not props, are inherited by the surrounding div.
   */

  interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contents: any;          // This prop contains any collection of data items to display
    idIdentifier?: string;  // If contents are collection of objects, defines the object propterty to use as key for vue loop
  }
  const props = defineProps<Props>();

</script>