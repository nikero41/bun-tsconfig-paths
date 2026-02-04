import { existsSync, lstatSync, readdirSync } from "fs";
import tsconfigPaths from "tsconfig-paths";
import { join, parse } from "path";

const EXTENSIONS = [
	".ts",
	".tsx",
	".mts",
	".cts",
	".js",
	".jsx",
	".mjs",
	".cjs",
];

export function resolvePath(
	importPath: string,
	matchPath: ReturnType<typeof tsconfigPaths.createMatchPath>,
) {
	let basePath = matchPath(importPath, undefined, undefined, EXTENSIONS);

	if (!basePath) {
		const normalizedPath = importPath.replace(/js(?=x$)|js$/, "ts");
		basePath = matchPath(normalizedPath, undefined, undefined, EXTENSIONS);
		if (!basePath) return undefined;
	}

	// matchPath may returns path without extension, resolve the actual file
	const resolvedPath = resolveWithExtension(basePath);
	if (!resolvedPath) return undefined;

	return { path: resolvedPath };
}

function resolveWithExtension(path: string) {
	if (!existsSync(path)) {
		const { dir, name } = parse(path);
		const result = readdirSync(dir, { withFileTypes: true }).find(entity =>
			isJsFile(entity.name, name),
		);

		return result ? join(dir, result.name) : undefined;
	}

	if (lstatSync(path).isFile()) return path;

	const result = readdirSync(path, { withFileTypes: true }).find(entity => {
		if (!entity.name.startsWith("index")) return false;
		return isJsFile(entity.name, "index");
	});
	return result ? join(path, result.name) : undefined;
}

export function isJsFile(filename: string, targetFileName: string) {
	const nameInfo = parse(filename);
	return (
		nameInfo.name === targetFileName && !!nameInfo.ext.match(/[cm]?[jt]sx?$/)
	);
}
