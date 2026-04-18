import { Command } from "commander";
import { focusApp, isAppRunning, listApps, openApp, quitApp } from "../lib/app";
import { printResult } from "../lib/result";

const NAME_ARG_DESC =
	'macOS application display name, e.g. "Google Chrome", "Slack" (not a bundle id or shell command). Quote names containing spaces.';

export function createAppCommand() {
	const app = new Command("app")
		.description(
			[
				"Open, focus, quit, and inspect macOS applications.",
				"Application names are the macOS display names shown in Finder/Dock",
				'(e.g. "Google Chrome", "Visual Studio Code"), not bundle ids or binaries.',
				"Every subcommand returns data: { name: string, running: boolean }, except 'list'.",
			].join("\n"),
		)
		.addHelpText(
			"after",
			[
				"",
				"Examples:",
				'  $ macctl app open "Google Chrome"',
				"  $ macctl app running Slack",
				"  $ macctl app quit Safari",
				"  $ macctl app list",
			].join("\n"),
		);

	app
		.command("open")
		.description(
			"Launch an application if not running, then activate it. Equivalent to 'focus' for already-running apps.",
		)
		.argument("<name>", NAME_ARG_DESC)
		.action((name: string) => {
			const result = openApp(name);

			printResult({
				status: "success",
				action: "app.open",
				message: `${result.name} opened`,
				data: result,
			});
		});

	app
		.command("focus")
		.description(
			"Bring an application to the foreground. Launches it if not running (currently identical to 'open').",
		)
		.argument("<name>", NAME_ARG_DESC)
		.action((name: string) => {
			const result = focusApp(name);

			printResult({
				status: "success",
				action: "app.focus",
				message: `${result.name} focused`,
				data: result,
			});
		});

	app
		.command("quit")
		.description(
			"Quit an application gracefully (the app may prompt to save unsaved work). No-op if not running.",
		)
		.argument("<name>", NAME_ARG_DESC)
		.action((name: string) => {
			const result = quitApp(name);

			printResult({
				status: "success",
				action: "app.quit",
				message: `${result.name} quit`,
				data: result,
			});
		});

	app
		.command("running")
		.description(
			"Check whether an application is currently running. Branch on data.running (boolean), not on message text.",
		)
		.argument("<name>", NAME_ARG_DESC)
		.action((name: string) => {
			const result = isAppRunning(name);

			printResult({
				status: "success",
				action: "app.running",
				message: result.running
					? `${result.name} is running`
					: `${result.name} is not running`,
				data: result,
			});
		});

	app
		.command("list")
		.description(
			"List all running applications reported by NSWorkspace (includes background and menu-bar agents). data: { apps: string[], count: number }",
		)
		.action(() => {
			const result = listApps();

			printResult({
				status: "success",
				action: "app.list",
				message: `Found ${result.count} running apps`,
				data: result,
			});
		});

	return app;
}
