import { runAppleScript, runJavaScriptForAutomation } from "./applescript";

export type AppState = {
	name: string;
	running: boolean;
};

function escapeAppleScriptString(value: string): string {
	return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function quotedAppName(name: string): string {
	const trimmed = name.trim();

	if (!trimmed) {
		throw new Error("Application name is required.");
	}

	return `"${escapeAppleScriptString(trimmed)}"`;
}

function parseJson<T>(value: string): T {
	try {
		return JSON.parse(value) as T;
	} catch {
		throw new Error(`Expected JSON output, got: ${value}`);
	}
}

export function isAppRunning(name: string): AppState {
	const trimmedName = name.trim();

	if (!trimmedName) {
		throw new Error("Application name is required.");
	}

	const running = parseJson<boolean>(
		runJavaScriptForAutomation(`
			ObjC.import("AppKit");
			const appName = ${JSON.stringify(trimmedName)};
			const apps = $.NSWorkspace.sharedWorkspace.runningApplications.js;
			JSON.stringify(
				apps.some((app) => ObjC.unwrap(app.localizedName) === appName),
			);
		`),
	);

	return {
		name: trimmedName,
		running,
	};
}

export function openApp(name: string): AppState {
	const appName = quotedAppName(name);
	runAppleScript(`tell application ${appName} to activate`);
	return isAppRunning(name);
}

export function focusApp(name: string): AppState {
	return openApp(name);
}

export function quitApp(name: string): AppState {
	const current = isAppRunning(name);

	if (!current.running) {
		return current;
	}

	const appName = quotedAppName(name);
	runAppleScript(`tell application ${appName} to quit`);
	return isAppRunning(name);
}

export function listApps(): { apps: string[]; count: number } {
	const apps = parseJson<string[]>(
		runJavaScriptForAutomation(`
			ObjC.import("AppKit");
			const apps = $.NSWorkspace.sharedWorkspace.runningApplications.js;
			const names = [
				...new Set(
					apps
						.map((app) => ObjC.unwrap(app.localizedName))
						.filter(Boolean),
				),
			].sort((a, b) => a.localeCompare(b));
			JSON.stringify(names);
		`),
	);

	return {
		apps,
		count: apps.length,
	};
}
