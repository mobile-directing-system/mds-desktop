<template>
  <div class=" table-fixed place-items-center mr-10">
    <table class=" border-spacing-2 w-full rounded-md overflow-hidden m-4">
      <thead class=" bg-blue-700 font-bold text-white text-l text-left text-lg">
        <slot name="tableHeader" />
      </thead> 
      <tbody class="text-left">
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

<script lang="ts" setup>

  interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contents: any;
    idIdentifier?: string;
  }
  const props = defineProps<Props>();

</script>