/** @type {import('tailwindcss').Config} */
const svgToDataUri = require('mini-svg-data-uri');

module.exports = {
  content: [
    './node_modules/flowbite/**/*.js',
    './packages/renderer/index.html',
    './packages/renderer/src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        'multiselect-caret': `url("${svgToDataUri(
          // eslint-disable-next-line quotes
          `<svg viewBox="0 0 320 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>`,
        )}")`,
        'multiselect-spinner': `url("${svgToDataUri(
          // eslint-disable-next-line quotes
          `<svg viewBox="0 0 512 512" fill="${theme('colors.green.500')}" xmlns="http://www.w3.org/2000/svg"><path d="M456.433 371.72l-27.79-16.045c-7.192-4.152-10.052-13.136-6.487-20.636 25.82-54.328 23.566-118.602-6.768-171.03-30.265-52.529-84.802-86.621-144.76-91.424C262.35 71.922 256 64.953 256 56.649V24.56c0-9.31 7.916-16.609 17.204-15.96 81.795 5.717 156.412 51.902 197.611 123.408 41.301 71.385 43.99 159.096 8.042 232.792-4.082 8.369-14.361 11.575-22.424 6.92z"></path></svg>`,
        )}")`,
        'multiselect-remove': `url("${svgToDataUri(
          // eslint-disable-next-line quotes
          `<svg viewBox="0 0 320 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>`,
        )}")`,
      }),
    },
    colors: {
      primary: '#1D4ED8', //blue-700
      primary_light: '#3B82F6', //blue-500
      primary_superlight: '#93C5FD', //blue-300
      primary_dark: '#1E40AF', //blue-800
      primary_superdark: '#1E3A8A', //blue-900
      secondary: '#2DD4BF', // teal-400
      secondary_light: '#5EEAD4', //teal-300
      secondary_superlight: '#99F6E4', //teal-200
      secondary_dark: '#0D9488', //teal-600
      secondary_superdark: '#115E59', //teal-800
      error: '#B91C1C', //red-700
      error_light: '#EF4444', //red-500
      error_superlight: '#FCA5A5', //red-300
      error_dark: '#991B1B', //red-800
      error_superdark: '#7F1D1D', //red-900
      warning: '#EAB308', //yellow-500
      warning_light: '#FDE047', //yellow-300
      warning_superlight: '#FEF9C3', //yelow-100
      warning_dark: '#A16207', //yellow-700
      warning_superdark: '#713F12', //yellow-900
      success: '#15803D', //green-700
      success_light: '#22C55E', //green-500
      success_superlight: '#86EFAC', //gree-300
      success_dark: '#166534', //green-800
      success_superdark: '#14532D', //green-900
      background: '#FFFFFF', //white
      surface: '#E5E7EB', //gray-200
      surface_light: '#F3F4F6', //gray-100
      surface_superlight: '#F9FAFB', //gray-50
      surface_dark: '#D1D5DB', //gray-300
      surface_superdark: '#9CA3AF', //gray-400
      on_primary: '#FFFFFF', //white
      on_primary_light: '#000000', //black
      on_primary_superlight: '#000000', //black
      on_primary_dark: '#FFFFFF', //white
      on_primary_superdark: '#FFFFFF', //white
      on_secondary: '#000000',//black
      on_secondary_light: '#000000', //black
      on_secondary_superlight: '#000000', //black
      on_secondary_dark: '#000000', //black
      on_secondary_superdark: '#FFFFFF', //white
      on_error: '#FFFFFF', //white
      on_error_light: '#000000', //black
      on_error_superlight: '#000000', //black
      on_error_dark: '#FFFFFF', //white
      on_error_superdark: '#FFFFFF', //white
      on_warning: '#000000', //black
      on_warning_light: '#000000', //black
      on_warning_superlight: '#000000', //black
      on_warning_dark: '#FFFFFF', //white
      on_warning_superdark: '#FFFFFF', //white
      on_success: '#FFFFFF', //white
      on_success_light: '#000000', //black
      on_success_superlight: '#000000', //black
      on_success_dark: '#FFFFFF', //white
      on_success_superdark: '#FFFFFF', //white
      on_background: '#000000', //black
      on_surface: '#292524', //stone-800
      on_surface_light: '#44403C', //stone-700
      on_surface_superlight: '#44403C', //stone-700
      on_surface_dark: '#1C1917', //stone-900
      on_surface_superdark: '#1C1917', //stone-900
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
