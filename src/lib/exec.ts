export type ExecResult = {
	stdout: string;
	stderr: string;
	exitCode: number;
};

export function runCommand(cmd: string[], quiet = false): ExecResult {
	const proc = Bun.spawnSync(cmd, {
		stdout: "pipe",
		stderr: "pipe",
	});

	const stdout = proc.stdout.toString().trim();
	const stderr = proc.stderr.toString().trim();
	const exitCode = proc.exitCode;

	if (exitCode !== 0) {
		throw new Error(stderr || stdout || `Command failed: ${cmd.join(" ")}`);
	}

	if (!quiet && stderr) {
		console.error(stderr);
	}

	return { stdout, stderr, exitCode };
}
