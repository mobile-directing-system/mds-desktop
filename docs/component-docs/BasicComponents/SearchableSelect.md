# Searchable Select

The *SearchableSelect* component is located at `packages/renderer/src/components/BasicComponents/SearchableSelect.vue`.
This component provides a wrapper around a [vueform/multiselect](https://github.com/vueform/multiselect) to adjust The
look of the dependency to the look of the app at large, to add debounce to the search and to add props for configuring the multiselect component. 
All props and events of the multiselect not handled by the wrapper can be used with the wrapper as mentioned in the multiselect documentation
All passed attributes, which are not props, are inherited by the multiselect component.

**Important** The underlying multiselect component uses the options list to display selected options. This means that if the v-model is changed programatically the options list needs to contain the new selections and they need to be **rendered already**. Because of this it is not possible to set the options list and then immediatley set the v-model. This can be solved by putting the updating of the v-model inside a setTimeout with durartion of 0.

## Props

| Name        | Type                               | Required | Default Value | Description                            |
| ----------- | ---------------------------------- | -------- | ------------- | -------------------------------------- |
| mode        | `'tags' \| 'multiple' \| 'single' `| yes      | -             | Select the mode for the multiselect    |
| placeholder | `string`                           | yes      | -             | Placeholder string for the multiselect |
| label       | `string`                           | no       | undefined     | If options are objects, this string defines what object property is shown in the options list |
| trackBy     | `string`                           | no       | label         | If options are objects, this string defines what object property is searched |
| valueProp   | `string`                           | no       | undefined     | If options are objects, this string defines what object property is used as value for selected options |
| debounce    | `string`                           | no       | undefined     | Defines the debouce time               |
| maxWait     | `string`                           | no       | undefined     | Defines the maxWait during debounce    |
| options     | `any []`                           | yes      | -             | Defines the options that are shown in the options list |

## Events

| Name          | Type         | Description                                                            |
| ------------- | ------------ | ---------------------------------------------------------------------- |
| search-change | `string`     | Returns query typed by the user in the select field                    |

## Slots

This component has no slots.