export type CommandResult = {
	status: "success" | "error";
	action: string;
	message?: string;
	data?: Record<string, unknown>;
};

export function printResult(result: CommandResult) {
	console.log(JSON.stringify(result, null, 2));
}
