# Floating Modal

The *FloatingModal* component is located at `packages/renderer/src/components/BasicComponents/FloatingModal.vue`.
This component is a container providing the functionality of a modal.
It provides an opaque overlay that makes the rest of the UI unclickable and indicates this through its opaqueness.
Additionally it provides the divs for the overlay itself to be filled with the content.
These `<div>`s also have a span with the title at the top and a small x button for closing the modal.
The logic for showing the modal and closing it must be implemented by the user through the *showModal* prop and the handling of the *click* event.
All passed attributes, which are not props, are passed to the div wrapping the passed modal content.

## Props

| Name       | Type             | Required | Default Value | Description                                                                            |
| ---------- | ---------------- | -------- | ------------- | -------------------------------------------------------------------------------------- |
| showModal  | `boolean`        | yes      | -             | boolean idicating whether or no the modal should be shown                              |
| title      | `string`         | yes      | -             | string containing the title for the modal displayed at the top                         |
| id         | `string`         | no       | undefined     | id string to give the elems of this component unique id's for instrumentation in tests |

## Events

| Name  | Type       | Description                                                                           |
| ----- | ---------- | ------------------------------------------------------------------------------------- |
| click | `void`     | The click event of this compoenent is emitted when the close modal button is clicked. |

## Slots

| Name | Prop-Name | Prop-Type | Description                                                                 |
| ---- | --------- | --------- | --------------------------------------------------------------------------- |
| -    | -         | -         | Unnamed slot without passed props for the content of the modal              |