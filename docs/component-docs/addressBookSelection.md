# Addressbook Selection

The *AddressBookSelection* component is located at `packages/renderer/src/components/AddressBookSelection.vue`.
This component provides a table of users, a.k.a. members, with a button for adding members.
This button opens a modal for adding user, including a table view of available users and a
searchable select. Passed attributes, which are not props, to this component won't work.

## Props

| Name              | Type             | Required | Default Value | Description                                                    |
| ----------------- | ---------------- | -------- | ------------- | -------------------------------------------------------------- |
| modelValue        | `string[]`       | yes      | -             | v-model repsentation                                           |
| includeIds        | `string[]`       | no       | undefined     | array of selectable user ids                                   |
| include           | `boolean`        | no       | undefined     | if set the includeIds array is processed                       |
| disableAddMembers | `boolean`        | no       | undefined     | disable the add members button if set to true                  |
| id                | `string`         | no       | undefined     | id to make element id's of this component unique               |   

## Events

| Name              | Type         | Description                                                            |
| ----------------- | ------------ | ---------------------------------------------------------------------- |
| update:modelValue | `string[]`   | Emitted upon clicking the Add Members button, updates the v-model.     |

## Slots

| Name | Prop-Name | Prop-Type | Description                                                                 |
| ---- | ----------| --------- | --------------------------------------------------------------------------- |
| -    | -         | -         | Unnamed slot without passed props. Displayed as content of the HTML button. | 