import { Command } from "commander";
import { focusApp, isAppRunning, listApps, openApp, quitApp } from "../lib/app";
import { printResult } from "../lib/result";

export function createAppCommand() {
	const app = new Command("app").description("Control macOS applications");

	app
		.command("open")
		.description("Open an application")
		.argument("<name>", "application name")
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
		.description("Bring an application to the foreground")
		.argument("<name>", "application name")
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
		.description("Quit an application gracefully")
		.argument("<name>", "application name")
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
		.description("Check whether an application is running")
		.argument("<name>", "application name")
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
		.description("List visible running applications")
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
