Development
###########

This chapter concerns documentation related to the development of the MDS-Desktop app not the use of it by endusers.

Development Environment
=======================

This chapter provides instructions on how to setup the recommended development environment for the MDS-Desktop project.
The MDS-Desktop app is built, on top of :vite-electron-builder-homepage:`vite-electron-builder <>` as an :electron-homepage:`Electron <>` application which uses :vue-homepage:`Vue.js <>` to render the ui and :vite-homepage:`Vite <>` to build the vue.js application.
As an Electron app this application is built on top of :node-homepage:`Node.js <>` and uses the :npm-homepage:`npm <>` package manager for dependency management and the build process.

Setup Development Environment
-----------------------------

First you need to setup Node.js and npm if you haven't already.
To install both download and execute the :node-installer:`Node.js Installer <>` or use a :node-pm-installer:`package manager <>` for the installation, if available.

Next if you just want to run the MDS-Desktop app you can clone the regular repository using:

.. code-block:: sh

    git clone https://github.com/mobile-directing-system/mds-desktop.git

If you want to contribute however, you need to create a fork of the regular repository and clone the fork instead.
Finish setting up the app by changing into the root directory of the repository and run ``npm i``.
To run the app in dev mode with HMR for most parts of the app run ``npm run watch``.
Lasty to run the app in productiion mode with the statically compiled vue ui run ``npm run prod``.

You can use any Editor you like to work with the app but we strongly recommend :vscode-homepage:`VSCode <>`.
This editor enable comfortable development by providing a number of extensions that help with the developement.
Recommended extensions for working on the app are *npm Intellisense*, *Vue Language Features*, *ESLint* and *Tailwind CSS IntelliSense*.

Technolgies & Architecture
==========================

This chapter covers used technologies, theirs docs, if necessary how they are used and the architecture of the MDS-Desktop app.

Technologies
------------

For this :electron-homepage:`Electron <>` app we use :vue-homepage:`Vue.js <>` as the web framework with :tailwind-homepage:`tailwindcss <>` and :flowbite-homepage:`Flowbite <>` as the UI framework and the logic is writtin in Typescript.
For routing we use :vue-router-homepage:`vue-router <>`.
For state management of the UI we use :vuex-homepage:`vuex <>` with the :vuex-smart-module-homepage:`vuex-smart-module <>` to have TypeScript support.
We use :lodash-homepage:`Lodash <>` as a utitlity library in the frontend.
The vue app the UI uses :vite-homepage:`Vite <>` for building and bundling.
The HTTP communication with the backend is implemented using :axios-homepage:`Axios <>` and the Weboscket communication with :ws:`ws <>`.
The UI tests are done with :playwright:`Playwright <>` and :vitest:`Vitest <>`.

Architecture
------------

.. image:: ../images/mds-desktop-architecture.svg
  :width: 600
  :alt: MDS-Desktop Architecture Diagram

As an Electron app the MDS-Desktop app is split into three parts. 
The first is the Website which defines the UI, for which we use a web app developed in vue.
The second is the Preload Module which defines what Node.js functionality is usable from the web app.
Here we use is mainly to expose wrapper functions around the IPC calls to the Node.js part of the app.
Lastly there is the Node.js part. This part starts & configures the browser windows to display the web app and implements other functionality not available to JS in the browser such as access to the files on the computer.

The Vue UI app is split between the router, views, components and the vuex state.
The app is structured by using the router to route between different views.
These views themselves are made up of components, HTML and Typescript.
Those components them are made up similary to the view, but in contrast to the views they are supposed to be usable at multiple points in the application.
We decide on which functionality to put into a component based on if it is going to be reused or not.
The data which is displayed by the UI is taken from vuex which we use to manage the state of our app.

.. warning:: Both views and components are written in the *SFC* format using Vue3 with the Composition API. We also use Typescript and the `<script setup>` tag for our code. When ever possible try to use those technolgies and make sure that when browsing the :vue-doc:`Vue.js Documentation <>` you have the toggle at the top of the sidebar set to Composition API.

To get started with Vue.js take a look at the :vue-doc:`Vue.js Documentation <>`.
For an introduction to the vue-router visit the :vue-router-guide:`vue-router Guide <>`.
To get a general understanding of vuex you can orient yourself at the :vuex-guide:`vuex Guide <>`.
But we use the vuex-smart-module to gain TypeScript support for vuex and used the README in the :vuex-smart-module-github:`vuex-smart-module Github <>` orient ourself when writing our vuex module.

The Preload Module is mostly autmated and only conists of wrapper functions to expose the IPC calls to the vue app.
But here it is **Important** to note that the auto-export plugin currently is bugged and needs all of the functions you want to export to be on a seperate line and in a seperate export statement.
If this is not done the vue app will not be able to find the preload module.

We use the Node.js part mostly to implement the skaffolding of the app (e.g. start browser window with the web app and hide window bar, implement exit window function, etc.) and the IPC, Handler and client-side implementation of the MDS-Server HTTP API.
To Familiarize youself with Electron you can use the :electron-intro:`Electron Introduction <>`.

Directory Structure of the Project
----------------------------------

.. code-block:: sh

    docs/                       # All the documentation, both vuepress and sphinx
    Makefile                    # Makefile to build the sphinx documentation (run make in
                                # project root)
    node_modules                # Contains the downloaded node packages/modules (don't touch)
    package.json                # Conatins node.js configuration, e.g. entry point into the app,
                                # dependecies, scripts (what can be run with npm run [command])
    packages/                   # Contains the source code of the app and configuration specific
                                # to the different parts of the app
    postcss.config.js           # Part of the TailwindCSS configuration. Concerns only the
                                # renderer part of the app. Is here for build compatibility
                                # purposes with the production build. Must be the same as the
                                # packages/renderer/postcss.config.js file
    README.md                   # Main README of the project. Mostly points to the sphinx
                                # documentation
    scripts/                    # contains mostly watch.js to support HMR with vite and electron
    tailwind.config.js          # Main TailwindCSS configuration. Concerns only the renderer
                                # part of the app. Is here for build compatibility purposes
                                # with the production build. Must be the same as the
                                # packages/renderer/tailwind.config.js file
    testDataGenerators          # directory with the bash scripts for generating the test data
                                # for the mocked backend
    tests/                      # Contains E2E tests
    vitest.config.js            # Configuration for the vitest testing framework
    docs/make.bat               # Build the sphinx documentation on windows (run make.bat)
    docs/images                 # Contains the images used in the sphinx documentation
    docs/index.rst              # Entry point into the sphinx documentation (toctree)
    docs/conf.py                # Configuration for the sphinx documentation contains
                                # the definition of external links among other things
    docs/sites                  # Contains the chapters of the sphinx documentation
    docs/_build                 # Contains the built sphinx documentation in HTML files
    docs/README.md              # Entry point into the vupress documentation
    docs/.vuepress              # Contains configuration and build products of the vuepress
                                # documentation
    docs/component-docs         # Vuepress markdown documentation files
    docs/.vuepress/config.ts    # Configuration of vuepress (mainly instruct vuepress to use
                                # vite as the bundler)
    packages/main/              # All code and configs specific to the main node.js part of 
                                # the electron app
    packages/preload/           # All code and configs specific to the preload module (mostly
                                # wrappers and auto-generated)
    packages/renderer/          # All code and configs specific to the renderer part (UI) of
                                # the electron app
    packages/types/             # Contains the types for entities (e.g. Users, Groups, etc.)
                                # Used in all three parts of the app
    packages/*/vite.config.js   # Configuration for Vite for all three different parts
    packages/*/tsconfig.json    # Configuration for the Typescript compiler for all three
                                # different parts
    packages/*/src/             # Source code for the three different parts
    packages/*/dist/            # Build products for the three different parts
    packages/main/src/backend       # Code for the communication with the MDS-Server HTTP
                                    # API including e.g. the caching of the Auth Cookie
    packages/main/src/config        # Rudimentary config file
    packages/main/src/index.ts      # Main entry point into the whole app. Starts the Windows,
                                    # registers the ipc handlers, etc.
    packages/main/src/ipcHandlers   # Implementation of ipcHandler wrappers for the backend
                                    # comms functions
    packages/main/src/windows       # Contains the code for the different windows
    packages/renderer/index.css             # Main CSS for the whole UI
    packages/renderer/index.html            # Main Page for the SPA UI vue app
    packages/renderer/postcss.config.js     # See postcss.config.js above
    packages/renderer/tailwind.config.js    # See tailwind.config.js above
    packages/renderer/src/App.vue           # Main Vue file.
    packages/renderer/components/           # Contains resuable vue components
    packages/renderer/constants/            # Contains constants such as permissions strings
    packages/renderer/src/index.ts          # Main logic entry point into the vue app.
                                            # Starts the whole vue app.
    packages/renderer/src/router/           # Contains the definition and configuration of
                                            # the vue-router
    packages/renderer/src/store/            # Contains all the code related to the
                                            # implementation and configuration of the 
                                            # vuex store & vuex modules
    packages/renderer/src/views/            # contains the pages routed through with the
                                            # router


Websocket Connection
--------------------

The Websocket connection uses baseURL from the config plus ``/ws/desktop-app`` to connect to the backend.
The incoming messages are handled in the ``.on('message', async (e) => {...});`` callback.
When new channels and payload types are added these need to be handled in this callback.
At the end such handling should call an ipcHandler which uses the ``BrowserWindow.webContents.send()`` method to communicate with the vue-app using ipc.
The Prelude package should then export a function that takes a callback and registers it using ``ipcRenderer.on();`` for the correct event.
This exported function can then be used to e.g. pass a callback from a state constructor that calls action on the state itself to register new objects, invalidate or delete old ones, etc.

Mocked Backend
--------------

To be able to UI test the app without a running server we need a mocked backend implementation.
This is achieved by having conditional exports in ``packages/main/src/backend/index.ts``.
When the mockedBackend flag is set in the config the mocked version of tge backend communication functions are exported if not the real ones are exported.
If no mocked function exists for a backend communication function, then the real one is exported regardless of if the flag is set or not.
To work correctly both the mocked and real function have the same signature.

For implementing the mocked backend we used maps and arrays to hold default hardcoded data and store dynamic data which is passed to the mockedBackend during the operation of the app with the mockedBackend flag set.
When implementing new mocket backend parts orient yourself at the MDS-Server documentation which describes how the functions should behave in case of errors or wrong data etc.
For generating the default data data generator bash scripts are available in the ``testDataGenerators`` directory.

UI Testing
----------

For UI-Testing we use :vitest:`Vitest <>` to write the tests themselves and execute the tests.
playwright:`Playwright <>` is used for instrumentation of the Electron App, so that the tests can start and interact with the electron application.
To familiarize yourself with Playwright and Vitest we suggest you take a look at the :playwright-docs:`Playwright Docs <>` and :playwright-api:`Playwright API <>`, as well as the :vitest-docs:`Vitest Docs <>` and :vitest-api:`Vitest API <>`.

For writing tests orient yourself at the existing UI-Tests.
To write a new UI-Tests you need to first get the first window of the electron app, so the login window.
So you need to login first.
Then write your navigation \& test code.
Lastly finish by logging out.
It is nice if this is explicitly done, but if you don't do it it will be done regardless after every test if the state is still logged in.

All the UI-Tests are defined in `tests/e2e.spec.ts`. This is done as we need the tests to be executed consecutively as they need the GUI and the GUI can only be started once.
It is currently not possible to start two instances of the app and Vitest runs different ``.spec.ts`` files concurrently.

Minimal Implementation for new Service
--------------------------------------

To implement a minimal service for a new entity (e.g. User, Group, etc.) do the following:

#. Start with implementing the calls to the backend API using Axios in *main/src/backend*. Once implemented export them in the *main/src/backend/index.ts* file.
#. Use them to write a handler-wrapper in *main/src/ipcHandlers*. Export these handlers in the *main/src/ipcHandlers/index.ts*.
#. Register these handlers in ipcMain in *main/src/index.ts* and give them speaking names.
#. Write a wrapper functions for calling those ipcHandlers in *preload/src* and export them in *preload/src/index.ts*.

   .. warning:: Make sure that the names used for calling the ipcHandlers are **exactly** the same as the ones given to them when registering them. **Important** There is a bug with the auto-export plugin that requires you to export each wrapper function sperately on a new line. If this is not done the vue code can't find the preload module.

#. Lastly implement a seperate vuex module to manage the state of the retrieved entities. Use the preload wrapper functions to fetch data from the backend.

   .. warning:: When writing a new vuex module and utilizing the IPC wrapper exposed by the preload module it is necessary to *undom* the objects of the vuex state before they are passed to the wrapper function. If not electron will throw an error complaining that it cannot serialize the object. With *undom* we mean that you must create a deep copy of the object, so that only basic data types such as number, booleans and strings are copied. Also only fields specified in the type of the object must be copied, but not additional fields created at runtime. This means that if an object holds a reference to another object or array those must be deep copied as well.

Component Documentation
=======================

Documentation for the components themselves (in *packages/renderer/src/components*) can be found either as code comments in the components themselves or in the form of a :vuepress-homepage:`VuePress <>` documentation.
The vuepress documentation is written in markdown files in *docs/README.md* and *docs/component-docs/\**. To serve the documentation use the

.. code-block:: sh

    npm run docs:dev


command in the project root. If you want a statically built HTML version run 

.. code-block:: sh

    npm run docs:build

in the project root.

The vue components are documented with a general description of their use and particularities, as well as a list of their slots, events and props.

UI-Customization
================

As for customization of the standard TailwindCSS, we chose to only adapt the colors.

Custom Colors
-------------

For the implementation of our custom color theme we oriented ourselves at :tailwindcss-colors:`TailwindCSS Customizing Colors <>`.
As such the color definitions can be found in the either of the *tailwind.config.js* files.

.. warning:: If you want to change of extend the custom color theme please be aware that **both** *tailwind.config.js* files need to be changes for the changes to be reflected in the dev and production modes.

We chose to implement 6 different colors:

* primary: The primary color for e.g. normal buttons or other primary UI elements
* secondary: The secondary color for e.g. highlights etc or other secondary UI elements
* warning: The warning color for things the user should perceive more than the standard UI, but is not an error
* error: The error color displayed when e.g. an error occurs or form fields are not filled correctly
* surface: The color for e.g. form fields to be more recognizable on the background or for delimiter
* background: The color for the background

Each of those colors as five different hues, except the background color:

* superlight
* light
* \-
* dark
* superdark

Those must can be combinied with the colors using an *_* to choose a color, e.g. *primary_superlight* is the superlight hue of the primary color.
If no hue is provides the normal middleground color is chosen.
The combinations themselves are taken from the default TailwindCSS color palatte, so they are a subset of this palatte.

Each of these color and hue combinations also has a *on_* color for text to be displayed readably on it.
E.g. for text on the background color it would be the color *on_background* or for text on the primary_superlight color *on_primary_superlight*

These colors can be combined with TailwindCSS designators such as *text* for text color or *bg* for background color. 
The colors are appended to those designators using a *-*, so when the primary color is wanted as a background color it is *bg-primary* with 
*text-on_primary* as the text color for it to be readable.