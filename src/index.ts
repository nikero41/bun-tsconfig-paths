import type { BunPlugin } from "bun";
import tsconfigPaths from "tsconfig-paths";

import { resolvePath } from "./filepath";

export interface TsConfigPathsOptions {
	/** Path to tsconfig.json file */
	tsConfigPath?: string;
}

function bunTsconfigPaths(options: TsConfigPathsOptions = {}): BunPlugin {
	return {
		name: "bun-tsconfig-paths",
		setup(build) {
			const pathResolver = createTsconfigResolver(options.tsConfigPath);
			if (!pathResolver) return;

			build.onResolve({ filter: /.*/, namespace: "file" }, args =>
				resolvePath(args.path, pathResolver),
			);
		},
	};
}

export default bunTsconfigPaths;

export function createTsconfigResolver(tsconfigRootPath: string | undefined) {
	const result = tsconfigPaths.loadConfig(tsconfigRootPath);

	if (result.resultType === "failed") {
		console.warn(
			"[bun-tsconfig-paths] Failed to load tsconfig:",
			result.message,
		);
		return null;
	}

	return tsconfigPaths.createMatchPath(result.absoluteBaseUrl, result.paths);
}
