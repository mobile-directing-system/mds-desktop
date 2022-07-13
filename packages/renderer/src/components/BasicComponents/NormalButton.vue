<template>
  <button
    :id="props.btnId"
    :type="props.btnType"
    class="text-on_primary bg-primary hover:bg-primary_dark focus:ring-4 focus:outline-none focus:ring-primary_light font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
    @click.prevent="$emit('btn-click', $event)"
  >
    {{ props.btnText }}
  </button>
</template>
<script lang="ts" setup>
  /**
   * Normal button component represents a 
   * button in normal color. Must be passed
   * btnText for the text to be displayed in
   * the button. Can be Passed btnId and btnType
   * which map to the id and type HTML-attributes.
   * To handle click events define a click handler
   * where you use the component.
   */
  interface Props {
    btnText: string;
    btnId?: string;
    btnType?: 'submit' | 'reset' | 'button' | undefined;
  }
  const props = defineProps<Props>();
  // eslint-disable-next-line
  const emits = defineEmits<{
    (name: 'btn-click', e: MouseEvent ): void
  }>();
</script>