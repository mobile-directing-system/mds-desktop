import { defaultTheme } from '@vuepress/theme-default'

export default {
  title: 'MDS-Desktop Documentation',
  theme: defaultTheme({
    navbar: [
      '/README.md'
    ],
    sidebar: false,
    contributors: false,
  }),
}