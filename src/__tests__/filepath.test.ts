import { describe, expect, it } from "bun:test";
import { join } from "path";
import { createTsconfigResolver } from "..";
import { isJsFile, resolvePath } from "../filepath";

const FIXTURES_DIR = join(import.meta.dir, "fixtures");
const BASIC_FIXTURE = join(FIXTURES_DIR, "basic");

describe("resolvePath", () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const tsconfigResolver = createTsconfigResolver(
		join(BASIC_FIXTURE, "tsconfig.json"),
	)!;

	it("resolves a matching path to actual file", () => {
		const inputPath = "@components/Button";
		const path = resolvePath(inputPath, tsconfigResolver);

		expect(path).toBeDefined();
		expect(path?.path).toContain("Button.ts");
	});

	it("resolves a matching path to folder with index file", () => {
		const inputPath = "@components/Card";
		const path = resolvePath(inputPath, tsconfigResolver);

		expect(path).toBeDefined();
		expect(path?.path).toContain("Card/index.ts");
	});

	it("resolves path with js file", () => {
		const inputPath = "@components/Title.js";
		const path = resolvePath(inputPath, tsconfigResolver);

		expect(path).toBeDefined();
		expect(path?.path).toContain("Title.js");
	});

	it("resolves path with .js extension", () => {
		const inputPath = "@components/Button.js";
		const path = resolvePath(inputPath, tsconfigResolver);

		expect(path).toBeDefined();
		expect(path?.path).toContain("Button.ts");
	});

	it("returns undefined for non-matching path", () => {
		const result = tsconfigResolver("./relative/path");
		expect(result).toBeUndefined();
	});

	it("returns undefined for unaliased imports", () => {
		const result = tsconfigResolver("lodash");
		expect(result).toBeUndefined();
	});

	it("returns undefined for alias that doesn't match a real file", () => {
		const result = tsconfigResolver("@components/NonExistent");
		expect(result).toBeUndefined();
	});
});

describe("isJsFile", () => {
	it.each([
		"main.ts",
		"main.mts",
		"main.cts",
		"main.tsx",
		"main.mtsx",
		"main.ctsx",
		"main.js",
		"main.mjs",
		"main.cjs",
		"main.jsx",
		"main.mjsx",
		"main.cjsx",
	])("returns true for %s", filename => {
		expect(isJsFile(filename, "main")).toBe(true);
	});

	it.each(["main", "main.html", "main.css"])(
		"returns false for %s",
		filename => {
			expect(isJsFile(filename, "mane")).toBe(false);
		},
	);
});
