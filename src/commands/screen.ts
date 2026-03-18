import { Command } from "commander";
import { printResult } from "../lib/result";

export function createScreenCommand() {
	const screen = new Command("screen").description(
		"Control screen-related actions",
	);

	screen
		.command("lock")
		.description("Lock the screen")
		.action(() => {
			printResult({
				status: "success",
				action: "screen.lock",
				message: "Not implemented yet",
			});
		});

	return screen;
}
