# Pagination Bar

The *PaginationBar* component is located at `packages/renderer/src/components/BasicComponents/PaginationBar.vue`.
This component displays previous and next buttons which are disabled if no more entries exist in the respective direction.
If emits the *updatePage* event when one of those buttons are clicked with a payload indicating the amount of entries at which offset should be loaded.
It also displays how much pages of entries are available and on which page the user currently is.
All passed attributes, which are no props, are passed to the containing `div`.

## Props

| Name                     | Type     | Required | Default Value | Description                                           |
| ------------------------ | -------- | -------- | ------------- | ----------------------------------------------------- |
| totalRetrievableEntities | `number` | yes      | -             | the total amount of entities which could be retreived |
| pageSize                 | `number` | yes      | -             | the amount of entities per page                       |
| initialPage              | `number` | no       | undefined     | when passed the initialPage and not page 1 is considered when returning the pageSize and offset |

## Events

| Name              | Type                                 | Description             |
| ----------------- | ------------------------------------ | ----------------------- |
| updatePage        | `{ amount: number , offset: number}` | The event is emitted when either of the two button is clicked and returns the values needed for retrieving the correct page from the backend |

## Slots

This component has no slots.