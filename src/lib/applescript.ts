import { runCommand } from "./exec";

export function runAppleScript(script: string): string {
	const { stdout } = runCommand(["osascript", "-e", script], true);
	return stdout;
}

export function runJavaScriptForAutomation(script: string): string {
	const { stdout } = runCommand(
		["osascript", "-l", "JavaScript", "-e", script],
		true,
	);
	return stdout;
}
