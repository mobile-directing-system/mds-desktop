# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))


# -- Project information -----------------------------------------------------

project = 'MDS Desktop'
copyright = '2022, Yves Haas, Laurin Todt, Lennart Altenhof'
author = 'Yves Haas, Laurin Todt, Lennart Altenhof'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    "sphinx.ext.duration",
    "sphinx.ext.extlinks"
]

#Add external URLs

extlinks = {
  "vue-homepage": ("https://vuejs.org/", "Vue.js"),
  "vite-homepage": ("https://vitejs.dev/", "Vite"),
  "electron-homepage": ("https://www.electronjs.org/", "Electron"),
  "vite-electron-builder-homepage": ("https://github.com/cawa-93/vite-electron-builder", "vite-electron-builder"),
  "node-homepage": ("https://nodejs.org/en/", "Node.js"),
  "npm-homepage": ("https://www.npmjs.com/", "npm"),
  "vscode-homepage": ("https://code.visualstudio.com/", "VSCode"),
  "node-installer": ("https://nodejs.org/en/download/", "Node.js Installer"),
  "node-pm-installer": ("https://nodejs.org/en/download/package-manager/", "package manager"),
  "tailwind-homepage": ("https://tailwindcss.com/", "tailwindcss"),
  "vuex-homepage": ("https://vuex.vuejs.org/", "vuex"),
  "vuex-smart-module-homepage": ("https://www.npmjs.com/package/vuex-smart-module", "vuex-smart-module"),
  "vue-router-homepage": ("https://router.vuejs.org/", "vue-router"),
  "flowbite-homepage": ("https://flowbite.com/", "Flowbite"),
  "axios-homepage": ("https://axios-http.com/", "Axios"),
  "lodash-homepage": ("https://lodash.com/", "Lodash"),
  "vue-doc": ("https://vuejs.org/guide/introduction.html", "Vue.js Documentation"),
  "vue-router-guide": ("https://router.vuejs.org/guide/", "vue-router Guide"),
  "vuex-guide": ("https://vuex.vuejs.org/guide/", "vuex Guide"),
  "vuex-smart-module-github": ("https://github.com/ktsn/vuex-smart-module", "vuex-smart-module Github"),
  "electron-intro": ("https://www.electronjs.org/docs/latest", "Electron Introduction"),
  "vuepress-homepage": ("https://vuepress.vuejs.org/", "VuePress"),
  "tailwindcss-colors": ("https://tailwindcss.com/docs/customizing-colors", "TailwindCSS Customizing Colors")
}

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'furo'

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']