# Normal Button

The *NormalButton* component is located at `packages/renderer/src/components/BasicComponents/NormalButton.vue`.
It is a container which provides a normal HTML `<button>` with customizable content, consistent style and is disableable.
When the NormalButton is disabled no events are emitted and the style changes to signify that the button is disabled.
All passed attributes, which are not props, are inherited by the HTML `<button>` element.

## Props

| Name       | Type             | Required | Default Value | Description                                                    |
| ---------- | ---------------- | -------- | ------------- | -------------------------------------------------------------- |
| disabled   | `boolean`        | no       | undefined     | when set disables the button.                                  |
| overwrite  | `boolean`        | no       | undefined     | when set changes the behavior of the class attribute to append |

## Events

| Name  | Type         | Description                                                            |
| ----- | ------------ | ---------------------------------------------------------------------- |
| click | `MouseEvent` | Returns the MouseEvent from the inital click event on the HTML-Button. |

## Slots

| Name | Type | Description                                                                 |
| ---- | ---- | --------------------------------------------------------------------------- |
| -    | -    | Unnamed slot without passed props. Displayed as content of the HTML button. | 