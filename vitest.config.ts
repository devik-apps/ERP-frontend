import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
      },
    },
    include: ['app/**/*.test.ts'],
    coverage: {
      include: ['app/**/*.vue', 'app/**/*.ts'],
      exclude: ['app/api/types.gen.ts'],
    },
  },
})
