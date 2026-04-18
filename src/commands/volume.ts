import { Argument, Command } from "commander";
import { printResult } from "../lib/result";
import {
	decreaseVolume,
	getVolumeState,
	increaseVolume,
	setMute,
	setVolume,
	toggleMute,
	type VolumeState,
} from "../lib/volume";

function ensurePercent(value: number, field = "value"): number {
	if (!Number.isFinite(value)) {
		throw new Error(`${field} must be a number.`);
	}
	if (value < 0 || value > 100) {
		throw new Error(`${field} must be between 0 and 100.`);
	}
	return value;
}

export function createVolumeCommand() {
	const volume = new Command("volume")
		.description(
			[
				"Control system OUTPUT volume (speakers/headphones, not microphone).",
				"All levels are integer percentages in the range 0-100.",
				"Every subcommand returns data: { outputVolume: 0-100, outputMuted: boolean }.",
			].join("\n"),
		)
		.addHelpText(
			"after",
			[
				"",
				"Examples:",
				"  $ macctl volume get",
				"  $ macctl volume set 50",
				"  $ macctl volume up 10",
				"  $ macctl volume mute on",
			].join("\n"),
		);

	volume
		.command("get")
		.description(
			"Read current output volume and mute state. data: { outputVolume: 0-100, outputMuted: boolean }",
		)
		.action(() => {
			const state = getVolumeState();

			printResult({
				status: "success",
				action: "volume.get",
				message: state.outputMuted
					? `Volume is ${state.outputVolume} (muted)`
					: `Volume is ${state.outputVolume}`,
				data: state,
			});
		});

	volume
		.command("set")
		.description(
			"Set absolute output volume. Idempotent — same value twice yields the same state.",
		)
		.argument(
			"<value>",
			"integer percentage, 0-100 (0 = silent, 100 = max)",
			(value) => Number(value),
		)
		.action((value: number) => {
			ensurePercent(value);
			const state = setVolume(value);

			printResult({
				status: "success",
				action: "volume.set",
				message: `Volume set to ${state.outputVolume}`,
				data: state,
			});
		});

	volume
		.command("up")
		.description(
			"Increase output volume by a relative amount. Clamped to a maximum of 100.",
		)
		.argument(
			"[amount]",
			"integer percentage to add, 0-100 (default 5)",
			(value) => Number(value),
			5,
		)
		.action((amount: number) => {
			ensurePercent(amount, "amount");
			const state = increaseVolume(amount);

			printResult({
				status: "success",
				action: "volume.up",
				message: `Volume increased to ${state.outputVolume}`,
				data: state,
			});
		});

	volume
		.command("down")
		.description(
			"Decrease output volume by a relative amount. Clamped to a minimum of 0.",
		)
		.argument(
			"[amount]",
			"integer percentage to subtract, 0-100 (default 5)",
			(value) => Number(value),
			5,
		)
		.action((amount: number) => {
			ensurePercent(amount, "amount");
			const state = decreaseVolume(amount);

			printResult({
				status: "success",
				action: "volume.down",
				message: `Volume decreased to ${state.outputVolume}`,
				data: state,
			});
		});

	volume
		.command("mute")
		.description(
			"Set or toggle output mute. Prefer 'on' or 'off' for deterministic results; 'toggle' flips the current state.",
		)
		.addArgument(
			new Argument("<state>", "desired mute state").choices([
				"on",
				"off",
				"toggle",
			]),
		)
		.action((state: string) => {
			let result: VolumeState;

			if (state === "on") {
				result = setMute(true);
			} else if (state === "off") {
				result = setMute(false);
			} else if (state === "toggle") {
				result = toggleMute();
			} else {
				throw new Error("State must be one of: on, off, toggle");
			}

			printResult({
				status: "success",
				action: "volume.mute",
				message: result.outputMuted ? "Volume muted" : "Volume unmuted",
				data: result,
			});
		});

	return volume;
}
