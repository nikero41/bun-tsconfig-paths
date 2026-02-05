# bun-tsconfig-paths

[![Licence](https://badgen.net/github/license/nikero41/bun-tsconfig-paths)](https://github.com/nikero41/bun-tsconfig-paths)
[![CI](https://badgen.net/github/checks/nikero41/bun-tsconfig-paths)](https://github.com/nikero41/bun-tsconfig-paths/actions)
[![Dependabot](https://badgen.net/github/dependabot/nikero41/bun-tsconfig-paths)](https://github.com/nikero41/bun-tsconfig-paths/security/dependabot)
[![npm](https://badgen.net/npm/v/bun-tsconfig-paths)](https://www.npmjs.com/package/bun-tsconfig-paths)
[![npm downloads](https://badgen.net/npm/dt/bun-tsconfig-paths)](https://www.npmjs.com/package/bun-tsconfig-paths)

A Bun plugin that resolves TypeScript path aliases from your `tsconfig.json`.

## Installation

```bash
bun add -d bun-tsconfig-paths
```

## Usage

### With Bun's Bundler

Add the plugin to your `Bun.build()` configuration:

```typescript
import tsconfigPaths from "bun-tsconfig-paths";

await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	plugins: [tsconfigPaths()],
});
```

### With Custom tsconfig Path

If your `tsconfig.json` is in a different location:

```typescript
import tsconfigPaths from "bun-tsconfig-paths";

await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	plugins: [tsconfigPaths({ tsConfigPath: "./packages/app/tsconfig.json" })],
});
```

### Example tsconfig.json

The plugin reads path aliases from your `tsconfig.json`:

```json
{
	"compilerOptions": {
		"paths": {
			"*": ["./src/*"],
			"@/*": ["./src/*"],
			"@components/*": ["./src/components/*"],
			"@utils/*": ["./src/utils/*"]
		}
	}
}
```

With this configuration, you can use imports like:

```typescript
import { Button } from "@components/Button";
import { formatDate } from "@utils/date";
```

## API

### `tsconfigPaths(options?)`

Returns a Bun plugin that resolves TypeScript path aliases.

#### Options

```typescript
interface TsConfigPathsOptions {
	tsConfigPath?: string; /** Path to tsconfig.json file */
}
```

## Requirements

- Bun >= 1.0.0
- TypeScript >= 5.0

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**

2. **Clone your fork**

   ```bash
   git clone https://github.com/your-username/bun-tsconfig-paths.git
   cd bun-tsconfig-paths
   ```

3. **Install dependencies**

   ```bash
   bun install
   ```

4. **Make your changes**

5. **Run checks before submitting**

   ```bash
   bun format      # Format code with Prettier
   bun lint        # Type check with TypeScript
   bun test        # Run tests
   bun run build   # Build the project
   ```

6. **Submit a Pull Request**

## Acknowledgements

This project is built upon and inspired by:

- [tsconfig-paths](https://github.com/dividab/tsconfig-paths) - The core library that powers the path resolution logic
- [bun-plugin-dts](https://github.com/AkaraChen/bun-plugin-dts) - Inspiration for the Bun plugin structure and build setup
