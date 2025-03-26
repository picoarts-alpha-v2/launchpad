"use client";

import { useState } from "react";
import { LaunchpadButtonSettings } from "./LaunchpadButtonSettings";

export type LaunchpadButtonProps = {
	x: number;
	y: number;
};

export function LaunchpadButton({ x, y }: LaunchpadButtonProps) {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	let className = "rounded-sm";
	if (y === 9 || x === 9) {
		className = "rounded-full";
	}
	if (y === 9 && x === 9) {
		className = "invisible";
	}

	return (
		<>
			<button
				className={`size-10 bg-background m-0.5 flex justify-center items-center ${className} hover:bg-muted-foreground cursor-pointer`}
				onClick={() => setIsSettingsOpen(true)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						setIsSettingsOpen(true);
					}
				}}
				tabIndex={0}
				type="button"
			>
				{`${x}/${y}`}
			</button>

			<LaunchpadButtonSettings
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				x={x}
				y={y}
			/>
		</>
	);
}
