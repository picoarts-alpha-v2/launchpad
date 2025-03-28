import type { ButtonSetting, MIDIDevice } from "@/stores/types";
import { midiToCoordinate } from "@/utils/utils";

export const handleSendPlaybackMidiMessage = async (
	event: WebMidi.MIDIMessageEvent,
	deviceList: MIDIDevice[],
	selectedPlaybackOutputDeviceIdList: string[],
	buttonSettings: ButtonSetting[][],
) => {
	const coordinate = midiToCoordinate(event.data[1]);
	const buttonSetting = buttonSettings[coordinate.y][coordinate.x];
};
