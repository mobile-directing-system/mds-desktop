<template>
  <button
    :class="props.overwrite? '' : props.disabled? 'bg-surface text-on_surface hover:bg-surface hover:text-on_surface cursor-auto font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center' : 'text-on_primary bg-primary hover:bg-primary_dark hover:text-on_primary_dark focus:ring-4 focus:outline-none focus:ring-primary_light font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center'"
    v-bind="$attrs"
    @click=" emitClickEvent($event)"
  >
    <!-- User-defined Button Content -->
    <slot />
  </button>
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
   * It is a container which provides a normal HTML button with customizable content, consistent style and is disableable.
   * When the NormalButton is disabled no events are emitted and the style changes to signify that the button is disabled.
   * All passed attributes, which are not props, are inherited by the HTML button element.
   */
  interface Props {
    disabled?: boolean;   // when set disables the button
    overwrite?: boolean;  // when set changes the behavior of the class attribute to append
  }
  const props = defineProps<Props>();
  
  const emit = defineEmits<{
    (name: 'click', e: MouseEvent ): void // returns the MouseEvent from the inital click event on the HTML-Button
  }>();

  /**
   * Button click handler
   * @param me original MouseEvent
   */
  function emitClickEvent(me: MouseEvent) {
    // only emit click event if the button is not disabled
    if(!props.disabled) {
      emit('click', me);
    } else {
      me.preventDefault();
    }
  }
</script>