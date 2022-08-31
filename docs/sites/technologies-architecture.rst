Technolgies & Architecture
##########################

Technologies
============

For this :electron-homepage:`Electron <>` app we use :vue-homepage:`Vue.js <>` as the web framework with :tailwind-homepage:`tailwindcss <>` and :flowbite-homepage:`Flowbite <>` as the UI framework and the logic is writtin in Typescript.
For routing we use :vue-router-homepage:`vue-router <>`.
For state management of the UI we use :vuex-homepage:`vuex <>` with the :vuex-smart-module-homepage:`vuex-smart-module <>` to have TypeScript support.
We use :lodash-homepage:`Lodash <>` as a utitlity library in the frontend.
The vue app the UI uses :vite-homepage:`Vite <>` for building and bundling.
The communication with the backend is implemented using :axios-homepage:`Axios <>`.

Architecture
============

.. image:: ../images/mds-desktop-architecture.svg
  :width: 600
  :alt: MDS-Desktop Architecture Diagram


Minimal Implementation for new Service
======================================

To implement a minimal service for a new entity (e.g. User, Group, etc.) do the following:

#. Start with implementing the calls to the backend API using Axios in *main/src/backend*. Once implemented export them in the *main/src/backend/index.ts* file.
#. Use them to write a handler-wrapper in *main/src/ipcHandlers*. Export these handlers in the *main/src/ipcHandlers/index.ts*.
#. Register these handlers in ipcMain in *main/src/index.ts* and give them speaking names.

  .. warning::
    
    Use those names, make sure that those names are **exactly** the same as the ones given to them when registering them, write a wrapper for calling them in *preload/src*. Export those wrappers in *preload/src/index.ts*. **Important** There is a bug with the auto-export plugin that requires you to export each wrapper function sperately on a new line. If this is not done the vue code can't find the preload module.
    
#. Lastly implement a seperate vuex module to manage the state of the retrieved entities. Use the preload wrapper functions to fetch data from the backend.