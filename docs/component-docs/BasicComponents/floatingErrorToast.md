# Floating Error Floating

The *FloatingErrorToast* is located at `packages/renderer/src/components/BasicComponents/FloatingErrorToast.vue`.
This component that displays errors and notifications in the form of floating toasts at the  top of the app. 
The oldest 3 errors and notifications displayed. Here errors have priority over notifications, so if there are 2 errors and 4 notifications, the 2 errors and 1 notification are displayed.
The toasts disappear after 10s or if they are manually closed using the x button on the toasts.
If this happens and more newer errors they are then displayed in the same way.

## Props

This component has no props.

## Events

This component has no events.

## Slots

This component has no slots.