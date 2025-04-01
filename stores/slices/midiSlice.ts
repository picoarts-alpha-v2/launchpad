import { handleSendPlaybackMidiMessage } from "@/midiMessage/playbackMidiMessage";
import { handleSendVisualMidiMessage } from "@/midiMessage/visualMidiMessage";
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
			const midiAccess = await navigator.requestMIDIAccess({ sysex: true });
			if (!midiAccess.sysexEnabled) {
				toast.error("MIDIデバイスへのアクセスに失敗しました");
				return;
			}
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
				handleSendPlaybackMidiMessage(
					event,
					get().devices,
					get().selectedPlaybackOutputDeviceIdList,
					get().buttonSettings,
				);

				// 映像用出力デバイスにメッセージを送信
				handleSendVisualMidiMessage(
					event,
					get().devices,
					get().selectedVisualOutputDeviceId,
					get().buttonSettings,
				);
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
