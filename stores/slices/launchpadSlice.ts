import type { StateCreator } from "zustand";
import type { RootState } from "../store";
import type { ButtonSetting } from "../types";
import { colorVelocityList } from "@/utils/utils";

export interface LaunchpadSlice {
	buttonSettings: ButtonSetting[][];
	updateButtonSetting: (
		row: number,
		col: number,
		setting: Partial<ButtonSetting>,
	) => void;
	resetButtonSettings: () => void;
	getButtonSetting: (row: number, col: number) => ButtonSetting;
}

const createInitialButtonSettings = (): ButtonSetting[][] => {
	return Array(8)
		.fill(null)
		.map((_, indexY) =>
			Array(8)
				.fill(null)
				.map((_, indexX) => ({
					effectType: "dot",
					color: {
						colorType:
							colorVelocityList?.[indexX + indexY * 8]?.colorType === undefined
								? "white"
								: colorVelocityList[indexX + indexY * 8].colorType,
						lightness:
							colorVelocityList?.[indexX + indexY * 8]?.lightness === undefined
								? 0
								: colorVelocityList[indexX + indexY * 8].lightness,
					},
					midiNote: 60,
					outputDeviceIndex: 0,
				})),
		);
};

export const createLaunchpadSlice: StateCreator<
	RootState,
	[],
	[],
	LaunchpadSlice
> = (set, get) => ({
	buttonSettings: createInitialButtonSettings(),

	updateButtonSetting: (
		row: number,
		col: number,
		setting: Partial<ButtonSetting>,
	) =>
		set((state) => {
			const newSettings = [...state.buttonSettings];
			newSettings[row][col] = {
				...newSettings[row][col],
				...setting,
			};
			return { buttonSettings: newSettings };
		}),

	resetButtonSettings: () =>
		set({ buttonSettings: createInitialButtonSettings() }),

	getButtonSetting: (row: number, col: number) =>
		get().buttonSettings[row][col],
});
