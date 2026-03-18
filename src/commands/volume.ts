import { Command } from "commander";
import { printResult } from "../lib/result";
import { ensureVolume } from "../lib/validate";

export function createVolumeCommand() {
	const volume = new Command("volume").description(
		"Control system output volume",
	);

	volume
		.command("get")
		.description("Get current output volume")
		.action(() => {
			printResult({
				status: "success",
				action: "volume.get",
				message: "Not implemented yet",
			});
		});

	volume
		.command("set")
		.description("Set output volume (0-100)")
		.argument("<value>", "volume percentage", (value) => Number(value))
		.action((value: number) => {
			ensureVolume(value);

			printResult({
				status: "success",
				action: "volume.set",
				message: `Requested volume ${value}`,
				data: { value },
			});
		});

	volume
		.command("up")
		.description("Increase output volume")
		.argument("[amount]", "amount to increase", (value) => Number(value), 5)
		.action((amount: number) => {
			ensureVolume(amount);

			printResult({
				status: "success",
				action: "volume.up",
				message: `Requested volume increase by ${amount}`,
				data: { amount },
			});
		});

	volume
		.command("down")
		.description("Decrease output volume")
		.argument("[amount]", "amount to decrease", (value) => Number(value), 5)
		.action((amount: number) => {
			ensureVolume(amount);

			printResult({
				status: "success",
				action: "volume.down",
				message: `Requested volume decrease by ${amount}`,
				data: { amount },
			});
		});

	return volume;
}
