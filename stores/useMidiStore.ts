import { toast } from "sonner";
import { create } from "zustand";

export interface MIDIDevice {
	id: string;
	name: string;
	type: "input" | "output";
	port: WebMidi.MIDIPort;
}

interface MIDIState {
	midiAccess: WebMidi.MIDIAccess | null;
	devices: MIDIDevice[];
	selectedInput: string | null;
	selectedPlaybackOutputs: string[];
	selectedVisualOutput: string | null;

	// アクション
	initialize: () => Promise<void>;
	setSelectedInput: (id: string | null) => void;
	addPlaybackOutput: (id: string) => void;
	removePlaybackOutput: (id: string) => void;
	setSelectedVisualOutput: (id: string | null) => void;
}

export const useMidiStore = create<MIDIState>((set, get) => ({
	midiAccess: null,
	devices: [],
	selectedInput: null,
	selectedPlaybackOutputs: [],
	selectedVisualOutput: null,

	initialize: async () => {
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
						selectedInput:
							state.selectedInput === port.id ? null : state.selectedInput,
						selectedPlaybackOutputs: state.selectedPlaybackOutputs.filter(
							(id) => id !== port.id,
						),
						selectedVisualOutput:
							state.selectedVisualOutput === port.id
								? null
								: state.selectedVisualOutput,
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
			(d) => d.type === "input" && d.id === get().selectedInput,
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
			midiInput.onmidimessage = (event) => {
				handleMidiMessage(event, get());
			};
		}

		set({ selectedInput: id });
	},

	addPlaybackOutput: (id: string) => {
		set((state) => ({
			selectedPlaybackOutputs: [...state.selectedPlaybackOutputs, id],
		}));
	},

	removePlaybackOutput: (id: string) => {
		set((state) => ({
			selectedPlaybackOutputs: state.selectedPlaybackOutputs.filter(
				(outputId) => outputId !== id,
			),
		}));
	},

	setSelectedVisualOutput: (id: string | null) => {
		set({ selectedVisualOutput: id });
	},
}));

// MIDI メッセージの処理
function handleMidiMessage(event: WebMidi.MIDIMessageEvent, state: MIDIState) {
	const [status, note, velocity] = event.data;

	// 再生用出力デバイスにメッセージを送信
	// biome-ignore lint/complexity/noForEach: <explanation>
	state.selectedPlaybackOutputs.forEach((outputId) => {
		const output = state.devices.find(
			(d) => d.type === "output" && d.id === outputId,
		);
		if (output) {
			const midiOutput = output.port as WebMidi.MIDIOutput;
			midiOutput.send([status, note, velocity]);
		}
	});

	// 映像用出力デバイスにメッセージを送信
	if (state.selectedVisualOutput) {
		const visualOutput = state.devices.find(
			(d) => d.type === "output" && d.id === state.selectedVisualOutput,
		);
		if (visualOutput) {
			const midiOutput = visualOutput.port as WebMidi.MIDIOutput;
			midiOutput.send([status, note, velocity]);
		}
	}
}
