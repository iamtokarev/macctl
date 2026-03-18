import { runAppleScript } from "./applescript";

export function lockScreen(): { method: "keystroke" } {
	runAppleScript(
		'tell application "System Events" to keystroke "q" using {control down, command down}',
	);

	return { method: "keystroke" };
}
