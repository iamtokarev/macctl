import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

type PackageJson = {
	version?: unknown;
};

function findPackageJson(startDir: string): string {
	let currentDir = startDir;

	while (true) {
		const candidate = resolve(currentDir, "package.json");

		if (existsSync(candidate)) {
			return candidate;
		}

		const parentDir = dirname(currentDir);

		if (parentDir === currentDir) {
			throw new Error("Could not locate package.json.");
		}

		currentDir = parentDir;
	}
}

export async function getPackageVersion(): Promise<string> {
	const packageJsonPath = findPackageJson(import.meta.dirname);
	const packageJson = JSON.parse(
		readFileSync(packageJsonPath, "utf8"),
	) as PackageJson;

	if (
		typeof packageJson.version !== "string" ||
		packageJson.version.length === 0
	) {
		throw new Error("package.json must contain a non-empty version string.");
	}

	return packageJson.version;
}
