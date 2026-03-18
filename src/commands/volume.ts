import { Command } from "commander";
import { printResult } from "../lib/result";
import {
	decreaseVolume,
	getVolumeState,
	increaseVolume,
	setMute,
	setVolume,
	toggleMute,
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
	const volume = new Command("volume").description(
		"Control system output volume",
	);

	volume
		.command("get")
		.description("Get current output volume")
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
		.description("Set output volume (0-100)")
		.argument("<value>", "volume percentage", (value) => Number(value))
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
		.description("Increase output volume")
		.argument("[amount]", "amount to increase", (value) => Number(value), 5)
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
		.description("Decrease output volume")
		.argument("[amount]", "amount to decrease", (value) => Number(value), 5)
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
		.description("Mute controls")
		.argument("<state>", "on | off | toggle")
		.action((state: string) => {
			let result;

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
