# Table Row

This component is located at `packages/renderer/src/components#/BasicComponents/TableRow.vue`.
This component provides `<tr>` with `numOfCols` many `<td>`.
All passed attributes, which are not props, are inherited by the `<tr>`.

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

| Name        | Prop-Name    | Prop-Type                                  | Description                                 |
| ----------- | ------------ | ------------------------------------------ | ------------------------------------------- |
| data#num    | {data}       | `element type of table container contents` | Defines the contents of the #num columnn    |