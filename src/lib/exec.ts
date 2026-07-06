import { spawnSync } from "node:child_process";

export type ExecResult = {
	stdout: string;
	stderr: string;
	exitCode: number;
};

export function runCommand(cmd: string[], quiet = false): ExecResult {
	const proc = spawnSync(cmd[0], cmd.slice(1), {
		stdio: ["ignore", "pipe", "pipe"],
	});

	if (proc.error) {
		throw proc.error;
	}

	const stdout = (proc.stdout?.toString() ?? "").trim();
	const stderr = (proc.stderr?.toString() ?? "").trim();
	const exitCode = proc.status ?? 1;

	if (exitCode !== 0) {
		throw new Error(stderr || stdout || `Command failed: ${cmd.join(" ")}`);
	}

	if (!quiet && stderr) {
		console.error(stderr);
	}

	return { stdout, stderr, exitCode };
}
