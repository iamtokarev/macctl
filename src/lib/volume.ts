import { runAppleScript } from "./applescript";

export type VolumeState = {
	outputVolume: number;
	outputMuted: boolean;
};

function parseBoolean(value: string): boolean {
	return value.trim().toLowerCase() === "true";
}

function parseNumber(value: string): number {
	const n = Number(value.trim());
	if (!Number.isFinite(n)) {
		throw new Error(`Expected a number, got: ${value}`);
	}
	return n;
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

export function getVolumeState(): VolumeState {
	const outputVolume = parseNumber(
		runAppleScript("output volume of (get volume settings)"),
	);

	const outputMuted = parseBoolean(
		runAppleScript("output muted of (get volume settings)"),
	);

	return { outputVolume, outputMuted };
}

export function setVolume(value: number): VolumeState {
	const safeValue = clamp(Math.round(value), 0, 100);
	runAppleScript(`set volume output volume ${safeValue}`);
	return getVolumeState();
}

export function increaseVolume(amount: number): VolumeState {
	const { outputVolume } = getVolumeState();
	return setVolume(outputVolume + amount);
}

export function decreaseVolume(amount: number): VolumeState {
	const { outputVolume } = getVolumeState();
	return setVolume(outputVolume - amount);
}

export function setMute(muted: boolean): VolumeState {
	runAppleScript(
		muted ? "set volume with output muted" : "set volume without output muted",
	);
	return getVolumeState();
}

export function toggleMute(): VolumeState {
	const current = getVolumeState();
	return setMute(!current.outputMuted);
}
