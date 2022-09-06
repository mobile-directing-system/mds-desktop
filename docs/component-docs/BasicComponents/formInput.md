# Form Input

The *FormInput* component is located at `/packages/renderer/src/components/BasicComponents/FromInput.vue`.
It provides a container for an input in a HTML form with an optional associated `<label>`. 
When a string for the label is provided it will be displayed, if no string is supplied it is not rendered. 
All passed attributes which are not props are passed to the input element and not the label element.

## Props

| Name       | Type               | Required | Default Value | Description                                                |
| ---------- | ------------------ | -------- | ------------- | ---------------------------------------------------------- |
| modelValue | `string \| number` | yes      | -             | v-model representation                                     |
| id         | `string`           | no       | undefined     | id for the input element and for attribute of the label    |
| label      | `string`           | no       | undefined     | content for the label do display                           |
| divClass   | `string`           | no       | undefined     | classes to be appended or to overwrite the div's classes   |
| labelClass | `string`           | no       | undefined     | classes to be appended or to overwrite the label's classes |
| overwrite  | `boolean`          | no       | undefined     | changes behavior from append classes to overwrite classes  |

## Events

| Name              | Type               | Description             |
| ----------------- | ------------------ | ----------------------- |
| update:modelValue | `string \| number` | event to update v-model |

## Slots

This component has no slots