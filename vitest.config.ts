import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
      },
    },
    hookTimeout: 30_000,
    testTimeout: 15_000,
    setupFiles: ['app/tests/mocks/setup.ts'],
    include: ['app/**/*.test.ts'],
    coverage: {
      include: ['app/**/*.vue', 'app/**/*.ts'],
      exclude: ['app/api/types.gen.ts'],
    },
  },
})
