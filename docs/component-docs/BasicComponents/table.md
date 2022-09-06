# Table

The table consists of 3 different components that need to be used together to create a working HTML `<table>`

* [TableContainer](table/tableContainer.md)
* [TableHeader](table/tableHeader.md)
* [TableRow](table/tableRow.md)

The TableHeader needs to be placed inside the named tableHeader scope and receives no props.
The TableRow needs to be placed inside the named tableRow scope and received a prop of the type of data passed to the TableContainer to render.
Inside the TableHeader there are as many slots for the table header content as specifed with the `num-of-cols` prop.
These need to be filled with the desired table headers and are named `<header1> - <header#num-of-cols>`.
Inside the TableRow there are as many slots for the table row content as specified with the `num-of-cols` prop.
These need to be filled with the desiered table rows and are named `<data1> - <data#num-of-cols>` and have the `{data}` prop of the element type of the entities passed to the TableContainer component.