<template>
  <button
    :class="props.disabled? 'bg-surface text-on_surface hover:bg-surface hover:text-on_surface cursor-auto font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center' : 'text-on_primary bg-primary hover:bg-primary_dark hover:text-on_primary_dark focus:ring-4 focus:outline-none focus:ring-primary_light font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center'"
    v-bind="$attrs"
    @click=" emitClickEvent($event)"
  >
    <slot />
  </button>
</template>

<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

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
    disabled?: boolean;
  }
  const props = defineProps<Props>();
  // eslint-disable-next-line
  const emit = defineEmits<{
    (name: 'click', e: MouseEvent ): void
  }>();

  function emitClickEvent(me: MouseEvent) {
    if(!props.disabled) {
      emit('click', me);
    }
  }
</script>