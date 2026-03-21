import { dirname, resolve } from "node:path";

type PackageJson = {
	version?: unknown;
};

async function findPackageJson(startDir: string): Promise<string> {
	let currentDir = startDir;

	while (true) {
		const candidate = resolve(currentDir, "package.json");

		if (await Bun.file(candidate).exists()) {
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
	const packageJsonPath = await findPackageJson(import.meta.dir);
	const packageJson = (await Bun.file(packageJsonPath).json()) as PackageJson;

	if (
		typeof packageJson.version !== "string" ||
		packageJson.version.length === 0
	) {
		throw new Error("package.json must contain a non-empty version string.");
	}

	return packageJson.version;
}
