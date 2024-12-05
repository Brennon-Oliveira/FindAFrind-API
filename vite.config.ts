import { defineConfig } from 'vitest/config'
import tsconfigPath from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPath()],
  test: {
    environmentMatchGlobs: [
      ['./src/http/**', './prisma/vitest-environment-prisma.ts'],
    ],
  },
})
