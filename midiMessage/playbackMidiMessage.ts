import type { ButtonSetting, MIDIDevice } from "@/stores/types";
import { midiToCoordinate } from "@/utils/utils";

export const handleSendPlaybackMidiMessage = async (
	event: WebMidi.MIDIMessageEvent,
	deviceList: MIDIDevice[],
	selectedPlaybackOutputDeviceIdList: string[],
	buttonSettings: ButtonSetting[][],
) => {
	// buttonSetting取得
	const coordinate = midiToCoordinate(event.data[1]);
	const buttonSetting = buttonSettings[coordinate.y][coordinate.x];

	// 再生するデバイス取得
	const outputDevice = deviceList.find(
		(device) =>
			device.type === "output" &&
			device.id ===
				selectedPlaybackOutputDeviceIdList[buttonSetting.outputDeviceIndex],
	);
	if (!outputDevice) {
		return;
	}

	// 再生するデバイスにメッセージを送信
	sendPlaybackMidiMessage(event, outputDevice, buttonSetting);
};

const sendPlaybackMidiMessage = (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
) => {
	const [inputStatus, inputNote, inputVelocity] = event.data;
	const midiOutput = device.port as WebMidi.MIDIOutput;
	midiOutput.send([inputStatus, buttonSetting.midiNote, inputVelocity]);
};
