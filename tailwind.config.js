/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/flowbite/**/*.js',
    './packages/renderer/index.html',
    './packages/renderer/src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
    },
    colors: {
      primary: '#1D4ED8', //blue-700
      primary_light: '#3B82F6', //blue-500
      primary_dark: '#1E3A8A', //blue-900
      secondary: '#2DD4BF', // teal-400
      secondary_light: '#99F6E4', //teal-200
      secondary_dark: '#0D9488', //teal-600
      error: '#B91C1C', //red-700
      error_light: '#EF4444', //red-500
      error_dark: '#7F1D1D', //red-900
      warning: '#EAB308', //yellow-500
      warning_light: '#FDE047', //yellow-300
      warning_dark: '#A16207', //yellow-700
      success: '#15803D', //green-700
      success_light: '#22C55E', //green-500
      success_dark: '#14532D', //green-900
      background: '#FFFFFF', //white
      surface: '#FFFFFF', //white
      on_primary: '#FFFFFF', //white
      on_primary_light: '#000000', //black
      on_primary_dark: '#FFFFFF', //white
      on_secondary: '#000000',//black
      on_secondary_light: '#000000', //black
      on_secondary_dark: '#000000', //black
      on_error: '#FFFFFF', //white
      on_error_light: '#000000', //black
      on_error_dark: '#FFFFFF', //white
      on_warning: '#000000', //black
      on_warning_light: '#000000', //black
      on_warning_dark: '#FFFFFF', //white
      on_success: '#FFFFFF', //white
      on_success_light: '#000000', //black
      on_success_dark: '#FFFFFF', //white
      on_light:'#D6D3D1', //stone-300
      on_dark:'#44403C', //stone-700
      on_background: '#000000', //black
      on_surface: '#000000', //black
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
