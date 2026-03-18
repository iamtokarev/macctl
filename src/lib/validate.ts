export function ensureVolume(value: number): number {
	if (!Number.isFinite(value) || value < 0 || value > 100) {
		throw new Error("Volume must be a number between 0 and 100");
	}
	return value;
}
