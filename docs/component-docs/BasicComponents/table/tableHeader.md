# Table Header

This component is located at `packages/renderer/src/components/BasicComponents/TableHeader.vue`.
This component provides a `<tr>` with `numOfCols` many `<th>`.
All passed attrtibutes, which are not props, are inherited by the `<tr>`.


## Props

| Name         | Type               | Required | Default Value | Description                                                |
| ------------ | ------------------ | -------- | ------------- | ---------------------------------------------------------- |
| numOfCols    | number             | yes      | -             | This props defined how many colmuns are in the table       |

## Events

This component has no events.

## Slots

| Name        | Prop-Name    | Prop-Type                  | Description                                       |
| ----------- | ------------ | -------------------------- | ------------------------------------------------- |
| header#num  | -            | -                          | Defines the header of the #num columnn.           |