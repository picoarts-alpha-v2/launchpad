import type { ButtonSetting } from "@/stores/types";

export interface PresetData {
	id: string;
	name: string;
	settings: ButtonSetting[][];
	createdAt: string;
	updatedAt: string;
}

const STORAGE_KEY = "launchpad-presets";

export const presetManager = {
	// プリセット一覧の取得
	getPresets(): PresetData[] {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	},

	// プリセットの保存
	savePreset(name: string, settings: ButtonSetting[][]): PresetData {
		const presets = this.getPresets();

		const newPreset: PresetData = {
			id: crypto.randomUUID(),
			name,
			settings: JSON.parse(JSON.stringify(settings)),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		presets.push(newPreset);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));

		return newPreset;
	},

	// プリセットの読み込み
	loadPreset(presetId: string): ButtonSetting[][] | null {
		const preset = this.getPresets().find((p) => p.id === presetId);
		return preset ? JSON.parse(JSON.stringify(preset.settings)) : null;
	},

	// プリセットの削除
	deletePreset(presetId: string): boolean {
		const presets = this.getPresets();
		const updatedPresets = presets.filter((p) => p.id !== presetId);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPresets));
		return presets.length !== updatedPresets.length;
	},

	// プリセット名の更新
	updatePresetName(presetId: string, name: string): boolean {
		const presets = this.getPresets();
		const preset = presets.find((p) => p.id === presetId);

		if (!preset) return false;

		preset.name = name;
		preset.updatedAt = new Date().toISOString();
		localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));

		return true;
	},
};
