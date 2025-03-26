import React from "react";
import { LaunchpadButton, type LaunchpadButtonProps } from "./LaunchpadButton";

export function Launchpad() {
	const launchpadButtonPropsListList: LaunchpadButtonProps[][] = [];
	for (let y = 1; y <= 9; y++) {
		const launchpadButtonPropsList: LaunchpadButtonProps[] = [];
		for (let x = 1; x <= 9; x++) {
			launchpadButtonPropsList.push({
				x: x,
				y: y,
			});
		}
		launchpadButtonPropsListList.push(launchpadButtonPropsList);
	}

	return (
		<div className="flex flex-col items-center gap-6">
			<div className="relative">
				{/* Launchpadの外枠 */}
				<div className="absolute inset-0 bg-zinc-800 rounded-xl" />

				{/* メインのLaunchpadグリッド */}
				<div className="relative bg-zinc-950 rounded-xl p-6 shadow-2xl">
					<div className="grid grid-cols-9 gap-2 p-4 bg-zinc-900 rounded-lg">
						{launchpadButtonPropsListList
							.reverse()
							.map((launchpadButtonPropsList, rowIndex) => (
								<React.Fragment
									key={`row-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										rowIndex
									}`}
								>
									{launchpadButtonPropsList.map((launchpadButtonProps) => (
										<LaunchpadButton
											{...launchpadButtonProps}
											key={JSON.stringify(launchpadButtonProps)}
										/>
									))}
								</React.Fragment>
							))}
					</div>

					{/* Launchpadのブランドロゴ */}
					<div className="absolute top-1 left-8">
						<span className="text-xs font-bold text-zinc-600">NOVATION</span>
					</div>
					<div className="absolute top-1 right-8">
						<span className="text-xs font-bold text-zinc-600">LAUNCHPAD</span>
					</div>
				</div>
			</div>
		</div>
	);
}
