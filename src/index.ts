#!/usr/bin/env bun

import { Command } from "commander";
import { createScreenCommand } from "./commands/screen";
import { createVolumeCommand } from "./commands/volume";

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
