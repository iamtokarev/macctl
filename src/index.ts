#!/usr/bin/env bun

import { Command } from "commander";
import { createAppCommand } from "./commands/app";
import { createScreenCommand } from "./commands/screen";
import { createVolumeCommand } from "./commands/volume";
import { getPackageVersion } from "./lib/version";

const program = new Command();
const packageVersion = await getPackageVersion();

program
	.name("macctl")
	.description("CLI for controlling macOS")
	.version(packageVersion)
	.showHelpAfterError()
	.showSuggestionAfterError();

program.addCommand(createVolumeCommand());
program.addCommand(createScreenCommand());
program.addCommand(createAppCommand());

program.parse();
