import type {
	ButtonSetting,
	Color,
	LightnessAnimationPage,
	LightnessListList,
	MIDIDevice,
} from "@/stores/types";
import {
	colorToRGB,
	coordinateToMidi,
	midiToCoordinate,
	sleep,
} from "@/utils/utils";

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

const sendLightnessAnimationPage = (
	device: MIDIDevice,
	colorType: Color["colorType"],
	pressedCoordinate: { x: number; y: number },
	lightnessAnimationPage: LightnessAnimationPage,
) => {
	let x = 0;
	let y = 0;
	for (const lightnessList of lightnessAnimationPage.lightnessListList.reverse()) {
		x = 0;
		for (const lightness of lightnessList) {
			if (lightness === null) {
				x = x + 1;
				continue;
			}
			sendLedMidiMessage(
				device,
				{
					colorType,
					lightness,
				},
				{
					x:
						pressedCoordinate.x - lightnessAnimationPage.centerCoordinate.x + x,
					y:
						pressedCoordinate.y - lightnessAnimationPage.centerCoordinate.y + y,
				},
			);
			x = x + 1;
		}
		y = y + 1;
	}
};

const sendLedMidiMessage = (
	device: MIDIDevice,
	color: Color,
	coordinate: { x: number; y: number },
) => {
	// 座標が範囲を超えたらなにもしない
	if (
		coordinate.x < 0 ||
		coordinate.x > 7 ||
		coordinate.y < 0 ||
		coordinate.y > 7
	) {
		return;
	}
	const midiOutput = device.port as WebMidi.MIDIOutput;
	const rgb = colorToRGB(color);
	const note = coordinateToMidi(coordinate.x, coordinate.y);
	const sendMidiInfo: Uint8Array = new Uint8Array([
		0xf0,
		0x00,
		0x20,
		0x29,
		0x02,
		0x18,
		0x0b,
		note, //LED(どのパッドか)
		rgb.r, //Red(0-3F 0:OFF 3F:MAX )
		rgb.g, //Green(0-3F 0:OFF 3F:MAX)
		rgb.b, //Blue(0-3F 0:OFF 3F:MAX)
		0xf7, //End of SysEx
	]);
	midiOutput.send(sendMidiInfo);
};

const sendMidiMessageDot = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 消灯
	if (inputVelocity === 0) {
		sendLedMidiMessage(
			device,
			{
				colorType: "black",
				lightness: 0,
			},
			coordinate,
		);
		return;
	}

	// 点灯
	sendLedMidiMessage(
		device,
		{
			colorType: buttonSetting.colorType,
			lightness: 1,
		},
		coordinate,
	);

	return;
};

const sendMidiMessageHorizontal = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 消灯
	if (inputVelocity === 0) {
		sendLightnessAnimationPage(device, "black", coordinate, {
			lightnessListList: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
			centerCoordinate: {
				x: 7,
				y: 0,
			},
		});
		return;
	}

	// 横一列に点灯
	sendLightnessAnimationPage(device, buttonSetting.colorType, coordinate, {
		lightnessListList: [
			[
				0.01, 0.02, 0.03, 0.05, 0.1, 0.3, 0.5, 1, 0.5, 0.3, 0.1, 0.05, 0.03,
				0.02, 0.01,
			],
		],
		centerCoordinate: {
			x: 7,
			y: 0,
		},
	});
	return;
};

const sendMidiMessageVertical = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 消灯
	if (inputVelocity === 0) {
		sendLightnessAnimationPage(device, "black", coordinate, {
			lightnessListList: [
				[0],
				[0],
				[0],
				[0],
				[0],
				[0],
				[0],
				[0], //中心
				[0],
				[0],
				[0],
				[0],
				[0],
				[0],
				[0],
			],
			centerCoordinate: { x: 0, y: 7 },
		});
		return;
	}

	// 縦一列に点灯
	sendLightnessAnimationPage(device, buttonSetting.colorType, coordinate, {
		lightnessListList: [
			[0.01],
			[0.02],
			[0.03],
			[0.05],
			[0.1],
			[0.3],
			[0.5],
			[1], //中心
			[0.5],
			[0.3],
			[0.1],
			[0.05],
			[0.03],
			[0.02],
			[0.01],
		],
		centerCoordinate: { x: 0, y: 7 },
	});
	return;
};

const sendMidiMessageExplosion = async (
	event: WebMidi.MIDIMessageEvent,
	device: MIDIDevice,
	buttonSetting: ButtonSetting,
	coordinate: { x: number; y: number },
) => {
	const [inputStatus, inputNote, inputVelocity] = event.data;

	// 離したときはなにもしない
	if (inputVelocity === 0) {
		return;
	}

	// ドットと1集周りが光る
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			sendLedMidiMessage(
				device,
				{
					colorType: buttonSetting.colorType,
					lightness: 1,
				},
				{ x: coordinate.x + i, y: coordinate.y + j },
			);
		}
	}
	await sleep(50);

	// ドットと一周が消える
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			sendLedMidiMessage(
				device,
				{
					colorType: "black",
					lightness: 0,
				},
				{ x: coordinate.x + i, y: coordinate.y + j },
			);
		}
	}

	// ドットのさらに周りが光る
	for (let i = -2; i <= 2; i++) {
		for (let j = -2; j <= 2; j++) {
			if (2 > Math.abs(i) && 2 > Math.abs(j)) {
				continue;
			}
			sendLedMidiMessage(
				device,
				{
					colorType: buttonSetting.colorType,
					lightness: 0.1,
				},
				{ x: coordinate.x + i, y: coordinate.y + j },
			);
		}
	}

	await sleep(50);
	// ドットのさらに周りが消える
	for (let i = -2; i <= 2; i++) {
		for (let j = -2; j <= 2; j++) {
			sendLedMidiMessage(
				device,
				{
					colorType: "black",
					lightness: 0,
				},
				{ x: coordinate.x + i, y: coordinate.y + j },
			);
		}
	}

	// ドットのさらにさらに周りが光る
	for (let i = -3; i <= 3; i++) {
		for (let j = -3; j <= 3; j++) {
			if (3 > Math.abs(i) && 3 > Math.abs(j)) {
				continue;
			}
			sendLedMidiMessage(
				device,
				{
					colorType: buttonSetting.colorType,
					lightness: 0.03,
				},
				{ x: coordinate.x + i, y: coordinate.y + j },
			);
		}
	}

	await sleep(50);
	// ドットのさらに周りが消える
	for (let i = -3; i <= 3; i++) {
		for (let j = -3; j <= 3; j++) {
			sendLedMidiMessage(
				device,
				{
					colorType: "black",
					lightness: 0,
				},
				{ x: coordinate.x + i, y: coordinate.y + j },
			);
		}
	}
	return;
};
