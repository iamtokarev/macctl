import { dirname, resolve } from "node:path";

type PackageJson = {
	version?: unknown;
};

const RELEASE_BRANCH = "main";
const PUSH_INSTRUCTION = "git push origin main --follow-tags";

function runCommand(args: string[]): string {
	const proc = Bun.spawnSync(args, {
		stdout: "pipe",
		stderr: "pipe",
	});

	const stdout = proc.stdout.toString().trim();
	const stderr = proc.stderr.toString().trim();

	if (proc.exitCode !== 0) {
		throw new Error(stderr || stdout || `Command failed: ${args.join(" ")}`);
	}

	return stdout;
}

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

function ensureCleanWorktree() {
	const status = runCommand(["git", "status", "--short"]);

	if (status.length > 0) {
		throw new Error("Release requires a clean git worktree.");
	}
}

function ensureMainBranch() {
	const branch = runCommand(["git", "branch", "--show-current"]);

	if (branch !== RELEASE_BRANCH) {
		throw new Error(
			`Release must run from ${RELEASE_BRANCH}. Current branch: ${branch}`,
		);
	}
}

function bumpPatch(version: string): string {
	const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);

	if (!match) {
		throw new Error(
			`Version must use SemVer x.y.z format. Current version: ${version}`,
		);
	}

	const major = Number(match[1]);
	const minor = Number(match[2]);
	const patch = Number(match[3]);
	return `${major}.${minor}.${patch + 1}`;
}

async function readPackageJson(path: string): Promise<PackageJson> {
	return (await Bun.file(path).json()) as PackageJson;
}

async function writePackageJson(path: string, packageJson: PackageJson) {
	await Bun.write(path, `${JSON.stringify(packageJson, null, "\t")}\n`);
}

function stageReleaseVersion() {
	runCommand(["git", "add", "package.json"]);
}

function createReleaseCommit(tagName: string) {
	runCommand(["git", "commit", "-m", `chore(release): ${tagName}`]);
}

function createAnnotatedTag(tagName: string) {
	runCommand(["git", "tag", "-a", tagName, "-m", tagName]);
}

async function main() {
	const packageJsonPath = await findPackageJson(import.meta.dir);

	ensureCleanWorktree();
	ensureMainBranch();

	const originalPackageJsonText = await Bun.file(packageJsonPath).text();
	const packageJson = await readPackageJson(packageJsonPath);

	if (
		typeof packageJson.version !== "string" ||
		packageJson.version.length === 0
	) {
		throw new Error("package.json must contain a non-empty version string.");
	}

	const nextVersion = bumpPatch(packageJson.version);
	const tagName = `v${nextVersion}`;

	packageJson.version = nextVersion;
	await writePackageJson(packageJsonPath, packageJson);

	try {
		runCommand(["bun", "run", "check"]);
		runCommand(["bun", "run", "build"]);

		const builtVersion = runCommand([
			"bun",
			"run",
			"./dist/index.js",
			"--version",
		]);

		if (builtVersion !== nextVersion) {
			throw new Error(
				`Built CLI version mismatch. Expected ${nextVersion}, got ${builtVersion}.`,
			);
		}
	} catch (error) {
		await Bun.write(packageJsonPath, originalPackageJsonText);
		throw error;
	}

	stageReleaseVersion();
	createReleaseCommit(tagName);
	createAnnotatedTag(tagName);

	console.log(`Released ${tagName}`);
	console.log(`Next step: ${PUSH_INSTRUCTION}`);
}

await main();
