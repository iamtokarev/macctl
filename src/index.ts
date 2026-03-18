import { Command } from "commander";
import { createVolumeCommand } from "./commands/volume";
import { createScreenCommand } from "./commands/screen";

const program = new Command();

program
	.name("macctl")
	.description("CLI for controlling macOS")
	.version("1.0.0")
	.showHelpAfterError()
	.showSuggestionAfterError();

program.addCommand(createVolumeCommand());
program.addCommand(createScreenCommand());

program.parse();
