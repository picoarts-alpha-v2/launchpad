import { create } from "zustand";

export type ButtonSetting = {
	effectType: "dot" | "explosion" | "vertical" | "horizontal";
	color: number;
	midiNote: number;
	outputDeviceId: string | null;
};

interface LaunchpadState {
	buttonSettings: ButtonSetting[][];
	updateButtonSetting: (
		row: number,
		col: number,
		setting: Partial<ButtonSetting>,
	) => void;
	resetButtonSettings: () => void;
	getButtonSetting: (row: number, col: number) => ButtonSetting;
}

// 9x9のグリッドの初期状態を作成
const createInitialButtonSettings = (): ButtonSetting[][] => {
	return Array(10)
		.fill(null)
		.map(() =>
			Array(10)
				.fill(null)
				.map(() => ({
					effectType: "dot",
					color: 0,
					midiNote: 60,
					outputDeviceId: null,
				})),
		);
};

export const useLaunchpadStore = create<LaunchpadState>()((set, get) => ({
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
}));
