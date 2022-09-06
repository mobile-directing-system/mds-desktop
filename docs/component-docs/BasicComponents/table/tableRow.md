# Table Row

This component is located at `packages/renderer/src/components#/BasicComponents/TableRow.vue`.

## Props

| Name         | Type     | Required | Default Value | Description                                                    |
| ------------ | -------- | -------- | ------------- | -------------------------------------------------------------- |
| rowData      | `any`    | yes      | -             | Contains the data item to be renderer in this row              |
| identifier   | `any`    | no       | undefined     | Contains the identifier to be returned when the row is clicked |
| numOfCols    | `number` | yes      | -             | Defined the number of columns of the table                     |
| tDataClass   | `string` | no       | undefined     | Defines the class string to be added to each `<td>`            |

## Events

| Name              | Type  | Description                                                                                |
| ----------------- | ----- | ------------------------------------------------------------------------------------------ |
| click             | `any` | Event emitted when the `<tr>`  is clicked. Returns the identifier associated with the row. |

## Slots

| Name        | Prop-Name    | Prop-Type                  | Description                                 |
| ----------- | ------------ | -------------------------- | ------------------------------------------- |