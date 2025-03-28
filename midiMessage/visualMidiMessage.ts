import type { ButtonSetting, MIDIDevice } from "@/stores/types";
import { coordinateToMidi, midiToCoordinate, sleep } from "@/utils/utils";

export const handleSendVisualMidiMessage = async (
	event: WebMidi.MIDIMessageEvent,
	deviceList: MIDIDevice[],
	selectedVisualOutputDeviceId: string | null,
	buttonSettings: ButtonSetting[][],
) => {
	const visualOutputDevice = deviceList.find(
		(device) =>
			device.type === "output" && device.id === selectedVisualOutputDeviceId,
	);

	if (!visualOutputDevice) {
		return;
	}

	const coordinate = midiToCoordinate(event.data[1]);
	const buttonSetting = buttonSettings[coordinate.y][coordinate.x];

	effectTypeBranch(event, visualOutputDevice, buttonSetting);
};

const effectTypeBranch = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
) => {
	const coordinate = midiToCoordinate(event.data[1]);
	if (buttonSetting.effectType === "dot") {
		sendMidiMessageDot(event, device, buttonSetting, coordinate);
	} else if (buttonSetting.effectType === "horizontal") {
		sendMidiMessageHorizontal(event, device, buttonSetting, coordinate);
	} else if (buttonSetting.effectType === "vertical") {
		sendMidiMessageVertical(event, device, buttonSetting, coordinate);
	} else if (buttonSetting.effectType === "explosion") {
		sendMidiMessageExplosion(event, device, buttonSetting, coordinate);
	}
};

const sendMidiMessageDot = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const midiOutput = device.port as WebMidi.MIDIOutput;
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 消灯
	if (inputVelocity === 0) {
		midiOutput.send([inputStatus, inputNote, 0]);
		return;
	}

	// 点灯
	const midi = coordinateToMidi(coordinate.x, coordinate.y);
	midiOutput.send([inputStatus, midi, buttonSetting.color]);
	return;
};

const sendMidiMessageHorizontal = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const midiOutput = device.port as WebMidi.MIDIOutput;
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 消灯
	if (inputVelocity === 0) {
		for (let i = 0; i <= 7; i++) {
			const midi = coordinateToMidi(i, coordinate.y);
			midiOutput.send([inputStatus, midi, 0]);
		}
		return;
	}

	// 横一列に点灯
	for (let i = 0; i <= 7; i++) {
		const midi = coordinateToMidi(i, coordinate.y);
		midiOutput.send([inputStatus, midi, buttonSetting.color]);
	}
	return;
};

const sendMidiMessageVertical = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const midiOutput = device.port as WebMidi.MIDIOutput;
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 消灯
	if (inputVelocity === 0) {
		for (let i = 0; i <= 7; i++) {
			const midi = coordinateToMidi(coordinate.x, i);
			midiOutput.send([inputStatus, midi, 0]);
		}
		return;
	}

	// 縦一列に点灯
	for (let i = 0; i <= 7; i++) {
		const midi = coordinateToMidi(coordinate.x, i);
		midiOutput.send([inputStatus, midi, buttonSetting.color]);
	}
	return;
};

const sendMidiMessageExplosion = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const midiOutput = device.port as WebMidi.MIDIOutput;
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 離したときはなにもしない
	if (inputVelocity === 0) {
		return;
	}

	// ドットと1集周りが光る
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			const midi = coordinateToMidi(coordinate.x + i, coordinate.y + j);
			midiOutput.send([inputStatus, midi, buttonSetting.color]);
		}
	}
	await sleep(50);

	// ドットと一周が消える
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			const midi = coordinateToMidi(coordinate.x + i, coordinate.y + j);
			midiOutput.send([inputStatus, midi, 0]);
		}
	}

	// ドットのさらに周りが光る
	for (let i = -2; i <= 2; i++) {
		for (let j = -2; j <= 2; j++) {
			if (2 > Math.abs(i) && 2 > Math.abs(j)) {
				continue;
			}
			const midi = coordinateToMidi(coordinate.x + i, coordinate.y + j);
			midiOutput.send([inputStatus, midi, buttonSetting.color]);
		}
	}

	await sleep(50);
	// ドットのさらに周りが消える
	for (let i = -2; i <= 2; i++) {
		for (let j = -2; j <= 2; j++) {
			const midi = coordinateToMidi(coordinate.x + i, coordinate.y + j);
			midiOutput.send([inputStatus, midi, 0]);
		}
	}

	// ドットのさらにさらに周りが光る
	for (let i = -3; i <= 3; i++) {
		for (let j = -3; j <= 3; j++) {
			if (3 > Math.abs(i) && 3 > Math.abs(j)) {
				continue;
			}
			const midi = coordinateToMidi(coordinate.x + i, coordinate.y + j);
			midiOutput.send([inputStatus, midi, buttonSetting.color]);
		}
	}

	await sleep(50);
	// ドットのさらに周りが消える
	for (let i = -3; i <= 3; i++) {
		for (let j = -3; j <= 3; j++) {
			const midi = coordinateToMidi(coordinate.x + i, coordinate.y + j);
			midiOutput.send([inputStatus, midi, 0]);
		}
	}
	return;
};
