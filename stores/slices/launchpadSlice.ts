import type { StateCreator } from "zustand";
import type { RootState } from "../store";
import type { ButtonSetting } from "../types";
import { presetManager } from "@/utils/presetManager";

export interface LaunchpadSlice {
	buttonSettings: ButtonSetting[][];
	updateButtonSetting: (
		row: number,
		col: number,
		setting: Partial<ButtonSetting>,
	) => void;
	resetButtonSettings: () => void;
	getButtonSetting: (row: number, col: number) => ButtonSetting;
	loadPresetToState: (presetId: string) => void;
}

const createInitialButtonSettings = (): ButtonSetting[][] => {
	return Array(8)
		.fill(null)
		.map(() =>
			Array(8)
				.fill(null)
				.map(() => ({
					effectType: "explosion",
					colorType: "white",
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

	// プリセットをステートに読み込む
	loadPresetToState: (presetId: string) => {
		const settings = presetManager.loadPreset(presetId);
		if (settings) {
			set({ buttonSettings: settings });
		}
	},
});
