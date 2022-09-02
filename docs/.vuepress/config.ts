import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from '@vuepress/cli'

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  })
})