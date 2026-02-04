/** @type {import('prettier').Config} */
export default {
	plugins: ["@ianvs/prettier-plugin-sort-imports"],
	arrowParens: "avoid",
	bracketSameLine: false,
	bracketSpacing: true,
	singleQuote: false,
	trailingComma: "all",
	printWidth: 80,
	endOfLine: "lf",
	semi: true,
	useTabs: true,
	tabWidth: 2,
	proseWrap: "preserve",
	htmlWhitespaceSensitivity: "css",
	importOrder: ["<THIRD_PARTY_MODULES>", "", "^types$", "^@/(.*)$", "^[.]"],
};
