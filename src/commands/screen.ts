import { Command } from "commander";
import { printResult } from "../lib/result";
import { lockScreen } from "../lib/screen";

export function createScreenCommand() {
	const screen = new Command("screen").description(
		"Control screen-related actions",
	);

	screen
		.command("lock")
		.description("Lock the screen")
		.action(() => {
			const result = lockScreen();

			printResult({
				status: "success",
				action: "screen.lock",
				message: "Screen locked with keyboard shortcut",
				data: result,
			});
		});

	return screen;
}
