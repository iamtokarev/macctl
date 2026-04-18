import { Command } from "commander";
import { printResult } from "../lib/result";
import { lockScreen } from "../lib/screen";

export function createScreenCommand() {
	const screen = new Command("screen")
		.description("Lock and control the display.")
		.addHelpText(
			"after",
			["", "Examples:", "  $ macctl screen lock"].join("\n"),
		);

	screen
		.command("lock")
		.description(
			"Lock the screen by simulating the Control+Command+Q keystroke. Requires Accessibility permission for the running terminal. Returns immediately; does not wait for the lock animation.",
		)
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
