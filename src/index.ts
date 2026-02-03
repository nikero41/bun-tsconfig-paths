import type { BunPlugin } from "bun";
import tsConfigPaths from "tsconfig-paths";

export interface TsConfigPathsOptions {
	external?: boolean;
}

const tsconfigPaths = (options: TsConfigPathsOptions = {}): BunPlugin => ({
	name: "bun-tsconfig-paths",
	setup(build) {
		const result = tsConfigPaths.loadConfig();
		if (result.resultType === "failed") {
			console.warn("[bun-tsconfig-paths] Failed to load tsconfig:", result.message);
			return;
		}

		const matchPath = tsConfigPaths.createMatchPath(
			result.absoluteBaseUrl,
			result.paths,
		);

		// const tsConfigAlliasRegExp = new RegExp(
		// 	"^" +
		// 		Object.keys(result.paths)
		// 			.map(p => (p === "*" ? "^\\w+" : p.replace("*", "")))
		// 			.join("|"),
		// );

		build.onResolve({ filter: /.*/, namespace: "file" }, args => {
			const newAbsolutePath = matchPath(args.path.replace(/\.js$/, ".ts"));
			if (!newAbsolutePath) return;
			return {
				path: newAbsolutePath,
				...("external" in options ? { external: options.external } : {}),
			};
		});
	},
});

export default tsconfigPaths;
