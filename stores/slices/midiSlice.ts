import { coordinateToMidi, midiToCoordinate, sleep } from "@/utils/utils";
import { toast } from "sonner";
import type { StateCreator } from "zustand";
import type { RootState } from "../store";
import type { ButtonSetting, MIDIDevice } from "../types";

export interface MIDISlice {
	midiAccess: WebMidi.MIDIAccess | null;
	devices: MIDIDevice[];
	selectedInputDeviceId: string | null;
	selectedPlaybackOutputDeviceIdList: string[];
	selectedVisualOutputDeviceId: string | null;
	deviceInitialize: () => Promise<void>;
	setSelectedInput: (id: string | null) => void;
	addPlaybackOutput: (id: string) => void;
	removePlaybackOutput: (id: string) => void;
	setSelectedVisualOutput: (id: string | null) => void;
}

export const createMIDISlice: StateCreator<RootState, [], [], MIDISlice> = (
	set,
	get,
) => ({
	midiAccess: null,
	devices: [],
	selectedInputDeviceId: null,
	selectedPlaybackOutputDeviceIdList: [],
	selectedVisualOutputDeviceId: null,

	deviceInitialize: async () => {
		try {
			const midiAccess = await navigator.requestMIDIAccess();
			const devices: MIDIDevice[] = [];

			// 入力デバイスの取得
			// biome-ignore lint/complexity/noForEach: <explanation>
			midiAccess.inputs.forEach((input) => {
				devices.push({
					id: input.id,
					name: input.name || "Unknown Device",
					type: "input",
					port: input,
				});
			});

			// 出力デバイスの取得
			// biome-ignore lint/complexity/noForEach: <explanation>
			midiAccess.outputs.forEach((output) => {
				devices.push({
					id: output.id,
					name: output.name || "Unknown Device",
					type: "output",
					port: output,
				});
			});

			// デバイスの接続状態変更監視
			midiAccess.onstatechange = (event) => {
				const port = event.port;
				const currentDevices = get().devices;

				if (port.state === "connected") {
					if (!currentDevices.some((d) => d.id === port.id)) {
						set((state) => ({
							devices: [
								...state.devices,
								{
									id: port.id,
									name: port.name || "Unknown Device",
									type: port.type,
									port: port,
								},
							],
						}));
						toast.success("MIDIデバイスが接続されました", {
							description: port.name || "Unknown Device",
						});
					}
				} else {
					set((state) => ({
						devices: state.devices.filter((d) => d.id !== port.id),
						selectedInputDeviceId:
							state.selectedInputDeviceId === port.id
								? null
								: state.selectedInputDeviceId,
						selectedPlaybackOutputDeviceIdList:
							state.selectedPlaybackOutputDeviceIdList.filter(
								(id) => id !== port.id,
							),
						selectedVisualOutputDeviceId:
							state.selectedVisualOutputDeviceId === port.id
								? null
								: state.selectedVisualOutputDeviceId,
					}));
					toast.error("MIDIデバイスが切断されました", {
						description: port.name || "Unknown Device",
					});
				}
			};

			set({ midiAccess, devices });
		} catch (error) {
			console.error("MIDI initialization error:", error);
			toast.error("MIDIデバイスへのアクセスに失敗しました");
		}
	},

	setSelectedInput: (id: string | null) => {
		const { devices } = get();
		const currentInput = devices.find(
			(d) => d.type === "input" && d.id === get().selectedInputDeviceId,
		);
		const newInput = devices.find((d) => d.type === "input" && d.id === id);

		// 現在のイベントリスナーを削除
		if (currentInput) {
			const midiInput = currentInput.port as WebMidi.MIDIInput;
			midiInput.onmidimessage = null;
		}

		// 新しいイベントリスナーを設定
		if (newInput) {
			const midiInput = newInput.port as WebMidi.MIDIInput;
			midiInput.onmidimessage = async (event) => {
				const [inputStatus, inputNote, inputVelocity] = event.data;
				// 再生用出力デバイスにメッセージを送信
				// ToDo:あとで設定できるようにする
				// biome-ignore lint/complexity/noForEach: <explanation>
				get().selectedPlaybackOutputDeviceIdList.forEach((outputId) => {
					const output = get().devices.find(
						(d) => d.type === "output" && d.id === outputId,
					);
					if (output) {
						const midiOutput = output.port as WebMidi.MIDIOutput;
						midiOutput.send([inputStatus, inputNote, inputVelocity]);
					}
				});

				// 映像用出力デバイスにメッセージを送信
				// ToDo:あとで設定できるようにする
				if (get().selectedVisualOutputDeviceId) {
					const visualOutputDevice = get().devices.find(
						(d) =>
							d.type === "output" &&
							d.id === get().selectedVisualOutputDeviceId,
					);
					if (visualOutputDevice) {
						const xy = midiToCoordinate(inputNote);
						sendMidiMessage(
							event,
							visualOutputDevice,
							get().buttonSettings[xy.y][xy.x],
							xy,
						);
					}
				}
			};
		}

		set({ selectedInputDeviceId: id });
	},

	addPlaybackOutput: (id: string) => {
		set((state) => ({
			selectedPlaybackOutputDeviceIdList: [
				...state.selectedPlaybackOutputDeviceIdList,
				id,
			],
		}));
	},

	removePlaybackOutput: (id: string) => {
		set((state) => ({
			selectedPlaybackOutputDeviceIdList:
				state.selectedPlaybackOutputDeviceIdList.filter(
					(outputId) => outputId !== id,
				),
		}));
	},

	setSelectedVisualOutput: (id: string | null) => {
		set({ selectedVisualOutputDeviceId: id });
	},
});

const sendMidiMessage = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	xy: { x: number; y: number },
) => {
	const midiOutput = device.port as WebMidi.MIDIOutput;
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 消灯
	if (inputVelocity === 0) {
		if (buttonSetting.effectType === "dot") {
			midiOutput.send([inputStatus, inputNote, 0]);
			return;
		}

		if (buttonSetting.effectType === "horizontal") {
			for (let i = 0; i < 7; i++) {
				const midi = coordinateToMidi(i, xy.y);
				midiOutput.send([inputStatus, midi, 0]);
			}
			return;
		}

		if (buttonSetting.effectType === "vertical") {
			for (let i = 0; i < 7; i++) {
				const midi = coordinateToMidi(xy.x, i);
				midiOutput.send([inputStatus, midi, 0]);
			}
			return;
		}
		if (buttonSetting.effectType === "explosion") {
			return;
		}
	}

	if (buttonSetting.effectType === "dot") {
		// 点灯
		const midi = coordinateToMidi(xy.x, xy.y);
		midiOutput.send([inputStatus, midi, buttonSetting.color]);
		return;
	}

	if (buttonSetting.effectType === "horizontal") {
		// 横一列に点灯
		for (let i = 0; i < 7; i++) {
			const midi = coordinateToMidi(i, xy.y);
			midiOutput.send([inputStatus, midi, buttonSetting.color]);
		}
		return;
	}

	if (buttonSetting.effectType === "vertical") {
		// 縦一列に点灯
		for (let i = 0; i < 7; i++) {
			const midi = coordinateToMidi(xy.x, i);
			midiOutput.send([inputStatus, midi, buttonSetting.color]);
		}
		return;
	}
	if (buttonSetting.effectType === "explosion") {
		// ドットと1集周りが光る
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				const midi = coordinateToMidi(xy.x + i, xy.y + j);
				midiOutput.send([inputStatus, midi, buttonSetting.color]);
			}
		}
		await sleep(50);

		// ドットと一周が消える
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				const midi = coordinateToMidi(xy.x + i, xy.y + j);
				midiOutput.send([inputStatus, midi, 0]);
			}
		}

		// ドットのさらに周りが光る
		for (let i = -2; i <= 2; i++) {
			for (let j = -2; j <= 2; j++) {
				if (2 > Math.abs(i) && 2 > Math.abs(j)) {
					continue;
				}
				const midi = coordinateToMidi(xy.x + i, xy.y + j);
				midiOutput.send([inputStatus, midi, buttonSetting.color]);
			}
		}

		await sleep(50);
		// ドットのさらに周りが消える
		for (let i = -2; i <= 2; i++) {
			for (let j = -2; j <= 2; j++) {
				const midi = coordinateToMidi(xy.x + i, xy.y + j);
				midiOutput.send([inputStatus, midi, 0]);
			}
		}

		// ドットのさらにさらに周りが光る
		for (let i = -3; i <= 3; i++) {
			for (let j = -3; j <= 3; j++) {
				if (3 > Math.abs(i) && 3 > Math.abs(j)) {
					continue;
				}
				const midi = coordinateToMidi(xy.x + i, xy.y + j);
				midiOutput.send([inputStatus, midi, buttonSetting.color]);
			}
		}

		await sleep(50);
		// ドットのさらに周りが消える
		for (let i = -3; i <= 3; i++) {
			for (let j = -3; j <= 3; j++) {
				const midi = coordinateToMidi(xy.x + i, xy.y + j);
				midiOutput.send([inputStatus, midi, 0]);
			}
		}
		return;
	}
};
