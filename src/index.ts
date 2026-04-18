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
	.description(
		[
			"Control macOS system settings from the CLI. Designed for scripting and AI agents.",
			"",
			"All commands emit a single JSON object to stdout:",
			'  { status: "success" | "error", action: string, message: string, data: object }',
			"Errors are written to stderr with a non-zero exit code.",
			"",
			"Uses AppleScript (osascript). Some commands (screen.lock, app.*) require the",
			"running terminal to have macOS Accessibility permission granted in System Settings.",
		].join("\n"),
	)
	.version(packageVersion)
	.showHelpAfterError()
	.showSuggestionAfterError()
	.addHelpText(
		"after",
		[
			"",
			"Examples:",
			"  $ macctl volume set 40",
			"  $ macctl volume mute toggle",
			'  $ macctl app open "Google Chrome"',
			"  $ macctl app running Slack",
			"  $ macctl screen lock",
		].join("\n"),
	);

program.addCommand(createVolumeCommand());
program.addCommand(createScreenCommand());
program.addCommand(createAppCommand());

program.parse();
