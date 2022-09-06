# Table Container

The *TableContainer* component is located at `packages/renderer/src/components/BasicComponents/TableContainer.vue`.
This component provides a `<div>` with the `table` class and a HTML `<table>`.
All passed attributes, which are not props, are inherited by the surrounding `<div>`.

## Props

| Name         | Type               | Required | Default Value | Description                                                |
| ------------ | ------------------ | -------- | ------------- | ---------------------------------------------------------- |
| contents     | any                | yes      | -             | This prop contains any collection of data items to display |
| idIdentifier | string             | no       | undefined     | If contents are collection of objects, defines the object propterty to use as key for vue loop |

## Events

This component has no events.

## Slots

| Name        | Prop-Name    | Prop-Type                  | Description                                 |
| ----------- | ------------ | -------------------------- | ------------------------------------------- |
| tableHeader | -            | -                          | This slot is for defining the table headers |
| tableRow    | `{row-data}` | `element type of contents` | This slot is for defining the table rows    |  