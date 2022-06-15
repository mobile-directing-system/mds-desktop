/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/flowbite/**/*.js',
    './packages/renderer/index.html',
    './packages/renderer/src/**/*.{vue,js,ts,jsx,tsx}',
    //"./index.html",
    //"./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
