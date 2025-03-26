export type LaunchpadButtonProps = {
	x: number;
	y: number;
};

export function LaunchpadButton({ x, y }: LaunchpadButtonProps) {
	let className = "rounded-sm";
	if (y === 9 || x === 9) {
		className = "rounded-full";
	}
	if (y === 9 && x === 9) {
		className = "invisible";
	}

	return (
		<div
			className={`size-10 bg-background m-0.5 flex justify-center items-center ${className} hover:bg-muted-foreground cursor-pointer`}
		>
			{`${x}/${y}`}
		</div>
	);
}
