# Member Selection

This component is located at `packages/renderer/src/components/MemberSelection.vue`.
This component provides a table of users, a.k.a. members, with a button for adding members.
This button opens a modal for adding user, including a table view of available users and a searchable select.
Passed attributes, which are not props, to this component won't work.

## Props

| Name       | Type             | Required | Default Value | Description                                                    |
| ---------- | ---------------- | -------- | ------------- | -------------------------------------------------------------- |
| modelValue | `string[]`       | yes      | -             | v-model repsentation                                           |
| includeIds | `string[]`       | no       | undefined     | array of selectable user ids                                   |
| include    | `boolean`        | no       | undefined     | if set the includeIds array is processed                       |

## Events

| Name              | Type         | Description                                                            |
| ----------------- | ------------ | ---------------------------------------------------------------------- |
| update:modelValue | `string[]`   | Emitted upon clicking the Add Members button, updates the v-model      |

## Slots

This component has no slots.