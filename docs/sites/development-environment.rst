Development Environment
#######################

This chapter provides instructions on how to setup the recommended development environment for the MDS-Desktop project, as well as the technologies used.
The MDS-Desktop app is built, on top of :vite-electron-builder-homepage:`vite-electron-builder <>` as an :electron-homepage:`Electron <>` application which uses :vue-homepage:`Vue.js <>` to render the ui and :vite-homepage:`Vite <>` to build the vue.js application.
As an Electron app this application is built on top of :node-homepage:`Node.js <>` and uses the :npm-homepage:`npm <>` package manager for dependency management and the build process.

Setup Development Environment
=============================

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