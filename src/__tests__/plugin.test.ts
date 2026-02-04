import { afterEach, describe, expect, it } from "bun:test";
import { join } from "path";
import bunTsconfigPaths, { createTsconfigResolver } from "..";

const FIXTURES_DIR = join(import.meta.dir, "fixtures");

describe("plugin", () => {
	it("returns a valid BunPlugin object", () => {
		const plugin = bunTsconfigPaths();

		expect(plugin).toBeDefined();
		expect(plugin.name).toBe("bun-tsconfig-paths");
		expect(typeof plugin.setup).toBe("function");
	});

	it("accepts empty options", () => {
		const plugin = bunTsconfigPaths({});

		expect(plugin).toBeDefined();
		expect(plugin.name).toBe("bun-tsconfig-paths");
		expect(typeof plugin.setup).toBe("function");
	});
});

describe.only("output", () => {
	const originalCwd = process.cwd();

	afterEach(() => {
		process.chdir(originalCwd);
	});

	it("removes @components/* @utils/* paths from the build output", async () => {
		process.chdir(join(FIXTURES_DIR, "basic"));

		const result = await Bun.build({
			entrypoints: [join(".", "src", "index.ts")],
			tsconfig: "tsconfig.json",
			plugins: [bunTsconfigPaths()],
		});

		expect(result.success).toBe(true);
		expect(result.outputs.length).toBeGreaterThan(0);

		const outputFile = result.outputs[0];
		const outputText = await outputFile?.text();

		expect(outputText).toContain("Button Component");
		expect(outputText).not.toContain("@components/");

		expect(outputText).toContain("toISOString");
		expect(outputText).not.toContain("@utils/");
	});

	it("handles project without path aliases gracefully", async () => {
		process.chdir(join(FIXTURES_DIR, "no-paths"));

		const result = await Bun.build({
			entrypoints: [join(".", "src", "index.ts")],
			tsconfig: "tsconfig.json",
			plugins: [bunTsconfigPaths()],
		});

		expect(result.success).toBe(true);
	});

	it("errors with invalid tsconfig.json", () => {
		expect(() =>
			createTsconfigResolver(join(FIXTURES_DIR, "invalid", "tsconfig.json")),
		).toThrowError();
	});
});
