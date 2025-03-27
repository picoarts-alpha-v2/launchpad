"use client";

import type { Coordinate } from "@/stores/types";
import { useState } from "react";
import { LaunchpadButtonSettings } from "./LaunchpadButtonSettings";

export function LaunchpadButton({ x, y }: Coordinate) {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	let className = "rounded-sm";
	if (y === 8 || x === 8) {
		className = "rounded-full";
	}
	if (y === 8 && x === 8) {
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
