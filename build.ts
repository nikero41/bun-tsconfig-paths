import type { BuildConfig } from 'bun'

const baseConfig: BuildConfig = {
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  minify: true,
  target: 'node',
}

await Promise.all([
  Bun.build({
    ...baseConfig,
    format: 'esm',
    naming: "[dir]/[name].js",
  }),
  Bun.build({
    ...baseConfig,
    format: 'cjs',
    naming: "[dir]/[name].cjs",
  })
])
